import { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Haptics from 'expo-haptics';
import Button from '../../components/Button/Button'

export default function Scanner() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scannedData, setScannedData] = useState(null);
    const [checkedIn, setCheckedIn] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [barcodeType, setBarcodeType] = useState('');

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [xCoordinate, setXCoordinate] = useState(0);
    const [yCoordinate, setYCoordinate] = useState(0);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const requestCameraPermission = async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
    };

    const handleBarCodeScanned = async ({ type, data, bounds, cornerPoints }) => {
        console.log('Scanned QR Code:', { type, data, bounds, cornerPoints });
        console.log('Corner Points:', { cornerPoints });

        // Accessing height and width from bounds
        const { size: { height, width }, origin: { x, y } } = bounds;

        console.log('Height:', height);
        console.log('Width:', width);
        console.log('X Coordinate:', x);
        console.log('Y Coordinate:', y);

        if (type === 'org.iso.QRCode') {
            setBarcodeType('QR Code');
        }

        setScanned(true);
        setScannedData({ type, data, bounds, cornerPoints })
        successHaptics()

        setHeight(height);
        setWidth(width);
        setXCoordinate(x);
        setYCoordinate(y);

        // Send a POST request to the API route for updating check-in status
        try {
            console.log('Sending check-in request...');
            const response = await fetch('http://192.168.20.4:3000/api/guestlist/checkIn', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: data }),
            });

            if (response.status === 200) {
                console.log('User check-in status updated successfully');
                setCheckedIn(true);
                setSuccessMessage(`User ${data} has successfully checked in`);
            } else {
                console.error('Error updating user check-in status. Response:', response);
            }
        } catch (error) {
            console.error('Error sending check-in request:', error);
        }
    };

    // const drawCornerPoints = (cornerPoints) => {
    //     console.log('Corner Points:', cornerPoints);

    //     return cornerPoints.map((point, index) => (
    //         <View
    //             key={index}
    //             style={{
    //                 position: 'absolute',
    //                 backgroundColor: 'red', // You can set the color as needed
    //                 display: 'flex',
    //                 justifyContent: 'center',
    //                 alignItems: 'center',
    //                 alignContent: 'center',
    //                 width: 8,
    //                 height: 8,
    //                 borderRadius: 5,
    //                 left: point.x - 4,
    //                 top: point.y - 4,
    //             }}
    //         />
    //     ));
    // };

    const successHaptics = () => {
        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
        )
    }

    setTimeout(() => {
        clearBoundingBox();
    }, 5000);

    const clearBoundingBox = () => {
        setCheckedIn(null);
        setScanned(false);
        setScannedData(null);
        setSuccessMessage('')
        setHeight(0);
        setWidth(0);
        setXCoordinate(0);
        setYCoordinate(0);
    };

    if (hasPermission === false || hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>
                    We need your permission to show the camera
                </Text>
                <Button
                    onPress={requestCameraPermission}
                    title="Grant Permission"
                />
            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.camera}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={StyleSheet.absoluteFillObject}
                    />
                </View>

                {scannedData && (
                    <>
                        <View
                            style={{
                                position: 'absolute',
                                borderWidth: 2,
                                borderColor: 'green',
                                height: height,
                                width: width,
                                left: xCoordinate,
                                top: yCoordinate,
                            }}
                        />
                        {/* {drawCornerPoints(scannedData.cornerPoints)} */}
                    </>

                )}

                <View style={styles.scannedData}>
                    {/* {scanned &&
                        <Button
                            label={'Rescan'}
                            onPress={() => setScanned(false)}
                        />
                    } */}

                    {scannedData && (
                        <>
                            <View style={styles.scanSuccess}>
                                <Text style={{ color: 'green' }}>
                                    QR Code Scanned
                                </Text>
                            </View>
                        </>
                    )}

                    {/* {scannedData && (
                        <>
                            <Text>Type: {barcodeType}</Text>
                            <Text>Data: {scannedData.data}</Text>
                        </>
                    )} */}

                    {checkedIn && (
                        <View style={styles.scanSuccess}>
                            <Text>
                                {successMessage}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        position: 'relative',
        flex: 0.85,
        flexDirection: 'column',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 10,
        borderRadius: 8,
        overflow: 'hidden'
    },
    scannedData: {
        flex: 0.2,
        marginHorizontal: 10,
    },
    scanSuccess: {
        backgroundColor: 'grey',
        width: 'auto',
        width: '100%',
        padding: 14,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    boundingBox: {
        position: 'relative',
        borderColor: 'green',
        borderWidth: '1px'
    }
});
