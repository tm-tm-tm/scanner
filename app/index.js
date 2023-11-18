import { useState, useEffect } from 'react';
import { SafeAreaView, View, Button, Text, StyleSheet } from 'react-native';
import { Stack, Link } from 'expo-router';

export default function Home() {

  return (
    <>
      <SafeAreaView style={styles.container}>

        <View style={styles.main}>
          <Text>
            SCANNER
          </Text>
        </View>

        <View style={styles.nav}>
          <View>
            <Link href="/check-in">Scan</Link>
          </View>
        </View>

        {/* <Link href="/modal">Present modal</Link> */}

      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#25292e',
  },
  mainContainer: {
    flex: 0.3,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    flex: 0.8,
    display: 'block',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'grey'
  },
  nav: {
    position: 'absolute',
    bottom: 0,
    margin: 18,
    width: 400,
    height: 60,
    borderRadius: 100,
    display: 'flex',
    backgroundColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  }
})



