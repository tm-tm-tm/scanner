import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import Analytics from '../../components/Analytics/Analytics';

export default function Guestlist() {
    const [guests, setGuests] = useState([]);
    const [access, setAccess] = useState('')
    // const [checkedIn, setCheckedIn] = useState('');
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredGuests, setFilteredGuests] = useState([]);

    useEffect(() => {
        readGuestlist();
    }, []);

    const readGuestlist = () => {
        setLoading(true);

        fetch('http://192.168.20.4:3000/api/guestlist/guestlist', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then((res) => {
                if (res.status !== 200) {
                    console.log('Something went wrong');
                } else {
                    return res.json();
                }
            })
            .then((guests) => {
                // if (guests) {
                //     const formattedGuests = guests.map((guest) => ({
                //         ...guest,
                //         timestamp: formatTimestamp(guest.timestamp),
                //         updatedAt: formatTimestamp(guest.updatedAt),
                //     }));
                setGuests(guests);
                setLoading(false);
                console.log('Successfully returned guestlist.');
                // }
            })
            .catch((error) => {
                console.log('Error returning guestlist.', error);
            });
    };

    const updateGuestAccess = async (id) => {
        setLoading(true);

        return fetch(`http://192.168.20.4:3000/api/guestlist/guestlist`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                } else {
                    console.error('Failed to update guest access status:', res.statusText);
                    throw new Error('Failed to update guest access status');
                }
            })
            .then(({ access: updatedAccess }) => {
                setAccess(updatedAccess);
                readGuestlist()
                return updatedAccess;
            })
            .catch((error) => {
                console.error('Error updating guest access status:', error);
                throw error;
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const deleteGuest = async (id) => {
        setLoading(true)

        const res = await fetch(`http://192.168.20.4:3000/api/guestlist/guestlist`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        })

        setLoading(false)
        readGuestlist()
    }

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp)
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC' }
        return date.toLocaleTimeString('en-US', options)
    }

    const handleSearchInputChange = (query) => {
        setSearchQuery(query);

        // Filter the guests based on the search query
        const filteredData = guests.filter(({ firstName, lastName, email }) => {
            const fullName = `${firstName.toLowerCase()} ${lastName.toLowerCase()}`;
            return fullName.includes(query.toLowerCase()) || email.toLowerCase().includes(query.toLowerCase());
        });

        setFilteredGuests(filteredData);
    };

    const guestData = searchQuery ? filteredGuests : guests;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.columnBottom}>
                <View style={styles.table}>
                    <View style={styles.header}>
                        <Text style={styles.indexColumn}>#</Text>
                        <Text style={styles.firstNameColumn}>First Name</Text>
                        <Text style={styles.lastNameColumn}>Last Name</Text>
                        <Text style={styles.emailColumn}>Email</Text>
                        {/* <Text style={styles.addedColumn}>Added</Text>
                        <Text style={styles.updatedColumn}>Updated</Text> */}
                        <Text style={styles.accessColumn}>Access</Text>
                        {/* <Text style={styles.checkedInColumn}>Checked-In</Text> */}
                        <Text style={styles.deleteColumn}></Text>
                    </View>

                    {
                        loading ?
                            <>
                                <View style={styles.header}>
                                    <Text style={styles.loadingText}>Loading...</Text>
                                </View>
                            </>
                            :
                            <FlatList
                                data={guestData}
                                keyExtractor={(guest) => guest.id.toString()}
                                renderItem={({ item: guest }) => (
                                    <View
                                        key={guest.id}
                                        style={styles.row}
                                    >
                                        <Text style={styles.indexCell}>{guest.id}</Text>
                                        <Text style={styles.firstNameCell} numberOfLines={1} ellipsizeMode='tail'>{guest.firstName}</Text>
                                        <Text style={styles.lastNameCell} numberOfLines={1} ellipsizeMode='tail'>{guest.lastName}</Text>
                                        <Text style={styles.emailCell} numberOfLines={1} ellipsizeMode='tail'>{guest.email}</Text>

                                        <TouchableOpacity
                                            onPress={() => updateGuestAccess(guest.id)}
                                            disabled={loading}
                                            style={styles.accessCell}
                                            numberOfLines={1}
                                            ellipsizeMode='tail'
                                        >
                                            <View>
                                                <Text style={{ fontSize: 12 }}>
                                                    {guest.access ? 'Yes' : 'No'}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                        {/* <TouchableOpacity
                                        onPress={() => updateCheckIn(guest.id)}
                                        disabled={loading}
                                        style={styles.checkedInCell}
                                          numberOfLines={1} 
                                        ellipsizeMode='tail'
                                    >
                                        <View>
                                            <Text style={{fontSize: 12}}>{guest.checkedIn ? 'Yes' : 'No'}</Text>
                                        </View>
                                    </TouchableOpacity> */}
                                        <TouchableOpacity
                                            onPress={() => deleteGuest(guest.id)}
                                            disabled={loading}
                                            style={styles.deleteCell}
                                        >
                                            <Text style={{ fontSize: 12 }}>x</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                    }
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.searchContainer}>
                        <TextInput
                            placeholder="Search"
                            value={searchQuery}
                            onChangeText={handleSearchInputChange}
                            style={styles.searchInput}
                        />
                    </View>

                    <View>
                        <Analytics guests={guests} />
                    </View>
                </KeyboardAvoidingView>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    columnBottom: {
        flex: 1,
        marginVertical: 8,
        padding: 4,
        borderRadius: 8,
    },
    table: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 12,
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indexColumn: {
        flex: 0.2,
        textAlign: 'left',
        fontSize: 12
    },
    indexCell: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    firstNameColumn: {
        flex: 0.8,
        textAlign: 'left',
        fontSize: 12
    },
    firstNameCell: {
        flex: 0.8,
        textAlign: 'left',
        alignItems: 'center',
        fontSize: 12
    },
    lastNameColumn: {
        flex: 0.8,
        textAlign: 'left',
        fontSize: 12
    },
    lastNameCell: {
        flex: 0.8,
        textAlign: 'left',
        alignItems: 'center',
        fontSize: 12
    },
    emailColumn: {
        flex: 1.2,
        textAlign: 'left',
        fontSize: 12
    },
    emailCell: {
        flex: 1.2,
        fontSize: 12
    },
    accessColumn: {
        flex: 0.4,
        textAlign: 'left',
        fontSize: 12
    },
    accessCell: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    checkedInColumn: {
        flex: 0.4,
        textAlign: 'left',
        fontSize: 12
    },
    checkedInCell: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    deleteColumn: {
        flex: 0.2,
        textAlign: 'center',
        fontSize: 12
    },
    deleteCell: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12
    },
    loadingText: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        paddingVertical: 4,
        paddingBottom: 60
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 10,
    },
})