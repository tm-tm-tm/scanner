import { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet } from 'react-native'
import Guestlist from '../../components/Guestlist/Guestlist'

export default function GuestlistPage() {

    return (
        <>
            <Guestlist />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
