import { useState, useEffect } from 'react'
import { SafeAreaView, View, Text, StyleSheet } from 'react-native'
import Scanner from '../../components/Scanner/Scanner'
import Button from '../../components/Button/Button'


export default function CheckIn() {

    return (
        <>
            <SafeAreaView style={styles.container}>
                <View style={styles.cameraView}>
                    <Scanner />
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraView: {
        flex: 1
    },
    details: {
    }
})
