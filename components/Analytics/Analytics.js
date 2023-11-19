import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Analytics = ({ guests }) => {
    const [capacity, setCapacity] = useState(200);

    useEffect(() => {
        loadStoredCapacity();
    }, []);

    const loadStoredCapacity = async () => {
        try {
            const savedCapacity = await AsyncStorage.getItem('eventCapacity');
            if (savedCapacity !== null) {
                setCapacity(parseInt(savedCapacity, 10));
            }
        } catch (error) {
            console.error('Error loading capacity:', error);
        }
    };

    const handleCapacityChange = (value) => {
        // If the value is an empty string, set the capacity to 0
        if (value === '') {
            setCapacity(0);
            return;
        }

        // Ensure the value is a valid number; use 0 if parsing fails
        const numericValue = parseFloat(value) || 0;

        // Update the capacity
        setCapacity(Math.max(0, numericValue));
    };

    const saveCapacity = async () => {
        try {
            await AsyncStorage.setItem('eventCapacity', capacity.toString());
            console.log('Capacity stored successfully');
        } catch (error) {
            console.error('Error storing capacity:', error);
        }
    };

    const totalGuests = guests.length;
    const guestsWithAccess = guests.filter((guest) => guest.access === true);
    const guestsWithoutAccess = guests.filter((guest) => guest.access === false);
    const percentageOfCapacityUsed = (guestsWithAccess.length / capacity) * 100;
    const percentageOfCapacityAvailable = ((capacity - guestsWithAccess.length) / capacity) * 100;

    return (
        <SafeAreaView style={styles.outerContainer}>
            <View style={styles.innerContainer}>
                <View style={styles.guestlistHeader}>
                    <Text style={styles.heading}>Guestlist</Text>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={() => updateGuestlist()}
                    >
                        <Text>Refresh</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.statistics}>
                    <Text style={styles.label}>RSVP Total</Text>
                    <Text style={styles.value}>{totalGuests}</Text>
                </Text>

                <View style={styles.statisticsContainer}>
                    <Text style={styles.statistics}>
                        <Text style={styles.label}>Access Granted</Text>
                        <Text style={styles.value}>{guestsWithAccess.length}</Text>
                    </Text>
                    <Text style={styles.statistics}>
                        <Text style={styles.label}>Waitlist</Text>
                        <Text style={styles.value}>{guestsWithoutAccess.length}</Text>
                    </Text>
                </View>
            </View>

            <View style={styles.innerContainer}>
                <View style={styles.inputContainer}>
                    <TextInput
                        keyboardType="numeric"
                        value={capacity.toString()}
                        onChangeText={handleCapacityChange}
                        onBlur={saveCapacity}
                        style={styles.input}
                    />
                    <View>
                        <Text style={styles.heading}>Event Capacity</Text>
                        <Text style={styles.labelTip}>
                            Update your event capacity as required
                        </Text>
                    </View>
                </View>

                <View style={styles.statisticsContainer}>
                    <Text style={styles.statistics}>
                        <Text style={styles.label}>Used:</Text>
                        <Text style={styles.value}>{percentageOfCapacityUsed.toFixed(2)}%</Text>
                    </Text>
                    <Text style={styles.statistics}>
                        <Text style={styles.label}>Available:</Text>
                        <Text style={styles.value}>
                            {percentageOfCapacityAvailable.toFixed(2)}%
                        </Text>
                    </Text>
                </View>

                <View>
                    <Text style={styles.capacityIndicator}>
                        <Text style={styles.capacityValue}>
                            {guestsWithAccess.length} / {capacity}
                        </Text>
                    </Text>

                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressBarFill,
                                { width: `${percentageOfCapacityUsed}%` },
                            ]}
                        ></View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        padding: 4,
        margin: 4,
        gap: 4,
        justifyContent: 'center'
    },
    innerContainer: {
        padding: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderWidth: 0.2,
        borderColor: 'rgba(192, 192, 192, 0.5)',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 2,
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 280,
        width: '50%',
        boxSizing: 'border-box',
    },
    inputContainer: {
        margin: 4,
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 4,
    },
    guestlistHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 4,
    },
    refreshButton: {
        flexDirection: 'center',
        alignItems: 'center',
        aspectRatio: 1 / 1,
        borderWidth: 0,
        borderRadius: 2,
    },
    heading: {
        fontSize: 18,
        fontWeight: '400',
        margin: 0,
        color: 'white'
    },
    labelTip: {
        fontSize: 8,
        opacity: 0.5,
        padding: 1,
        margin: -1,
        color: 'white'
    },
    input: {
        height: 24,
        width: '20%',
        fontSize: 20,
        boxSizing: 'border-box',
        borderRadius: 1,
        padding: 4,
        color: 'white',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        textAlign: 'center',
    },
    statisticsContainer: {
        flexDirection: 'row',
    },
    statistics: {
        flexDirection: 'column',
        width: '50%',
        color: 'white'
    },
    label: {
        fontSize: 10,
        color: 'white'
    },
    value: {
        fontSize: 20,
        color: 'white'
    },
    progressBar: {
        position: 'relative',
        width: '100%',
        boxSizing: 'border-box',
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 10,
    },
    progressBarFill: {
        position: 'absolute',
        boxSizing: 'border-box',
        height: 6,
        backgroundColor: '#61ff61',
        zIndex: 10,
        overflow: 'hidden',
        borderRadius: 10,
        transition: 'width 0.4s ease',
        minWidth: 16,
        maxWidth: '100%',
    },
    capacityIndicator: {
        flexDirection: 'column',
        width: '100%',
    },
    capacityValue: {
        width: '100%',
        fontSize: 18,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 0,
        boxSizing: 'border-box',
        color: 'white'
    },
    // Media queries in React Native are typically handled by using Dimensions or a responsive library
    // You can adjust styles dynamically based on the screen dimensions in your components.
});

export default Analytics;
