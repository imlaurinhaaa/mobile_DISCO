'use client';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import SongCard from '../components/SongCard';

export default function Album({ route }) {
    // Por enquanto só recebe o ID, quando conectar o backend vai usar ele
    const albumId = route?.params?.id;
    console.log('ID do álbum recebido:', albumId);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Svg style={styles.background} pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <Defs>
                        <RadialGradient id="radial" cx="50%" cy="30%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#231385" />
                            <Stop offset="100%" stopColor="#101027" />
                        </RadialGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#radial)" />
                </Svg>

                <ScrollView>
                    <View style={styles.container}>
                        <EvilIcons name="arrow-left" size={30} color="white" style={styles.backIcon} />

                        <Image
                            source={require('../assets/playlistImage.png')}
                            style={styles.albumImage}
                        />

                        <View style={styles.info}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.titleAlbum}>Album Title</Text>
                                <Text style={styles.textAlbum}>Artist Name</Text>

                                <View style={styles.infoAlbum}>
                                    <Text style={styles.textInfo}>Year</Text>
                                    <Text style={styles.textInfo}>Duration</Text>
                                </View>
                            </View>

                            <AntDesign name="play-circle" size={40} color="white" />
                        </View>

                        <View style={styles.songs}>
                            <SongCard />
                            <SongCard />
                            <SongCard />
                            <SongCard />
                            <SongCard />
                            <SongCard />
                            <SongCard />
                            <SongCard />

                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '40%',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    backIcon: {
        marginLeft: 16,
        marginTop: 10,
    },
    albumImage: {
        width: 250,
        height: 250,
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    infoContainer: {
        flex: 1,
    },
    titleAlbum: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    textAlbum: {
        fontSize: 16,
        color: '#b0b0c3',
        marginBottom: 12,
    },
    infoAlbum: {
        flexDirection: 'row',
        gap: 16,
    },
    textInfo: {
        fontSize: 14,
        color: '#8080a0',
    },
    songs: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
});
