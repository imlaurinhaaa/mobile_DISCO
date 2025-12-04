'use client';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import SongCard from '../components/SongCard';
import axios from 'axios';

export default function Album({ route }) {
    const { id } = route.params;

    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const albumResponse = await axios.get(`http://localhost:4000/api/albums/${id}`);
            const songsResponse = await axios.get(`http://localhost:4000/api/songs?album_id=${id}`);

            setAlbum(albumResponse.data);
            setSongs(songsResponse.data);
        } catch (e) {
            console.log("ERRO AO CARREGAR:", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#fff" />
            </SafeAreaView>
        );
    }

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
                            source={{ uri: `http://localhost:4000/uploads/${album.photo_cover}` }}
                            style={styles.albumImage}
                        />

                        <View style={styles.info}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.titleAlbum}>{album.title}</Text>
                                <Text style={styles.textAlbum}>{album.artist}</Text>

                                <View style={styles.infoAlbum}>
                                    <Text style={styles.textInfo}>{album.year}</Text>
                                    <Text style={styles.textInfo}>{album.duration || "00:00"}</Text>
                                </View>
                            </View>

                            <AntDesign name="play-circle" size={40} color="white" />
                        </View>

                        <View style={styles.songs}>
                            {songs.map(song => (
                                <SongCard
                                    key={song.id}
                                    id={song.id}
                                    title={song.title}
                                    duration={song.duration}
                                    artist={song.artist}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
