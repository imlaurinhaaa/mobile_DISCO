'use client';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || 'http://localhost:4000/uploads';

const getImageUrl = (path) => {
    if (!path) return null;
    if (typeof path === 'string' && path.startsWith('http')) return path;

    let cleanPath = String(path).replace(/\\/g, '/');
    if (cleanPath.includes('uploads/')) {
        cleanPath = cleanPath.substring(cleanPath.indexOf('uploads/') + 8);
    }
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }

    return `${IMAGE_URL}/${cleanPath}`;
};


function formatSongs(arr) {
    return (arr || []).map((s) => {
        const cover = s.photo_cover || s.cover || s.album_cover || s.photo_disk || null;
        const formatted = {
            ...s,
            photo_cover: getImageUrl(cover),
        };
        console.log('Música formatada:', formatted.title, '- Artista:', formatted.singer_name);
        return formatted;
    });
}

export default function Album({ route, navigation }) {
    const albumId = route?.params?.id;
    const [album, setAlbum] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedSongs, setLikedSongs] = useState({});

    useEffect(() => {
        const fetchAlbum = async () => {
            if (!albumId) {
                console.log('Sem ID do álbum');
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const albumRes = await axios.get(`${API_URL}/albums/${albumId}`);
                const albumData = albumRes.data?.album || albumRes.data || {};
                setAlbum(albumData);

                let songsData = [];
                try {
                    const songsRes = await axios.get(`${API_URL}/songs`, { params: { album_id: parseInt(albumId) } });
                    songsData = songsRes.data || [];

                    if (songsData.length > 50) {
                        songsData = songsData.filter(song => song.album_id == albumId);
                    }

                    if (!Array.isArray(songsData) || songsData.length === 0) {
                        const altSongsRes = await axios.get(`${API_URL}/songs/album`, { params: { id: albumId } });
                        songsData = altSongsRes.data || [];
                    }

                    if (!Array.isArray(songsData) || songsData.length === 0) {
                        const alt2 = await axios.get(`${API_URL}/albums/${albumId}/songs`);
                        songsData = alt2.data?.songs || alt2.data || [];
                    }
                } catch (songsErr) {
                    songsData = [];
                }

                setSongs(formatSongs(songsData));
            } catch (err) {
                setAlbum(null);
                setSongs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbum();
    }, [albumId]);

    const toggleLike = (songId) => {
        setLikedSongs((prev) => ({
            ...prev,
            [songId]: !prev[songId],
        }));
    };

    const albumCover = album?.photo_cover || album?.cover || album?.photo || album?.photo_disk;
    const albumTitle = album?.title || 'Álbum';
    const albumArtist = album?.singer_name || 'Artista';
    const albumYear = album?.release_year || album?.year || 'Ano';
    const albumDuration = album?.duration || `${songs.length || 0} músicas`;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Svg style={styles.background} pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <Defs>
                        <RadialGradient id="radial" cx="50%" cy="30%" rx="50%" ry="50%">
                            <Stop offset="0%" stopColor="#231385" stopOpacity="1" />
                            <Stop offset="25%" stopColor="#120A61" stopOpacity="1" />
                            <Stop offset="38%" stopColor="#09054F" stopOpacity="1" />
                            <Stop offset="50%" stopColor="#00003C" stopOpacity="1" />
                            <Stop offset="75%" stopColor="#080832" stopOpacity="1" />
                            <Stop offset="100%" stopColor="#101027" stopOpacity="1" />
                        </RadialGradient>
                    </Defs>
                    <Rect x="0" y="0" width="100%" height="100%" rx="0" fill="url(#radial)" />
                </Svg>

                <ScrollView>
                    <View style={styles.container}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <EvilIcons name="arrow-left" size={30} color="white" style={styles.backIcon} />
                        </TouchableOpacity>

                        {loading ? (
                            <ActivityIndicator size="large" color="#7A3CF0" style={{ marginVertical: 40 }} />
                        ) : (
                            <Image
                                source={albumCover ? { uri: getImageUrl(albumCover) } : require('../assets/playlistImage.png')}
                                style={styles.albumImage}
                            />
                        )}

                        <View style={styles.info}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.titleAlbum}>{albumTitle}</Text>
                                <Text style={styles.textAlbum}>{albumArtist}</Text>

                                <View style={styles.infoAlbum}>
                                    <Text style={styles.textInfo}>{albumYear}</Text>
                                    <Text style={styles.textInfo}>{albumDuration}</Text>
                                </View>
                            </View>

                            <AntDesign name="play-circle" size={40} color="white" />
                        </View>
                        <View style={styles.songs}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#7A3CF0" style={{ marginTop: 12 }} />
                            ) : songs.length > 0 ? (
                                songs.map((song) => (
                                    <TouchableOpacity
                                        key={song.id || song.title}
                                        style={styles.songRow}
                                        onPress={() => navigation.navigate('SongsDetails', { id: song.id, song })}
                                    >
                                        {song.photo_cover ? (
                                            <Image source={{ uri: song.photo_cover }} style={styles.songCover} />
                                        ) : (
                                            <View style={styles.songCoverPlaceholder} />
                                        )}
                                        <View style={styles.songMeta}>
                                            <Text style={styles.songTitle}>{song.title || 'Sem título'}</Text>
                                            <Text style={styles.songArtist}>{song.singer_name || 'Artista desconhecido'}</Text>
                                        </View>
                                        <Text style={styles.songDuration}>{song.duration || ''}</Text>
                                        <TouchableOpacity onPress={() => toggleLike(song.id)}>
                                            <FontAwesome
                                                name={likedSongs[song.id] ? 'heart' : 'heart-o'}
                                                size={20}
                                                color={likedSongs[song.id] ? 'red' : '#fff'}
                                            />
                                        </TouchableOpacity>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.empty}>Nenhuma música encontrada para este álbum</Text>
                            )}
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
    },
    background: {
        position: 'absolute',
        width: '100%',
        height: '100%',
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
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1c1c2e',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        gap: 12,
    },
    songCover: {
        width: 52,
        height: 52,
        borderRadius: 10,
    },
    songCoverPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 10,
        backgroundColor: '#2A2A4A',
    },
    songMeta: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    songTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    songArtist: {
        color: '#b0b0c3',
        fontSize: 13,
    },
    songDuration: {
        color: '#888',
        fontSize: 12,
    },
    empty: {
        color: '#b0b0c3',
        marginTop: 10,
    },
});
