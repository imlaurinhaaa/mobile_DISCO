'use client';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.243:4000/api";
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || "http://192.168.0.243:4000/uploads";

const getImageUrl = (path) => {
    console.log('getImageUrl chamado com:', path);
    if (!path) return null;
    if (path.startsWith('http')) return path;

    // Remove "uploads/" se existir no caminho
    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.includes('uploads/')) {
        cleanPath = cleanPath.substring(cleanPath.indexOf('uploads/') + 8);
    }
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }

    const finalUrl = `${IMAGE_URL}/${cleanPath}`;
    console.log('URL gerada:', finalUrl);
    return finalUrl;
};

import axios from 'axios';

export default function SongsDetails({ route, navigation }) {
    const { song: initialSong } = route.params || {};
    const [song, setSong] = useState(initialSong || {});
    const [likedSongs, setLikedSongs] = useState({});

    useEffect(() => {
        if (initialSong?.id) {
            console.log('Buscando detalhes da música ID:', initialSong.id);
            axios.get(`${API_URL}/songs/${initialSong.id}`)
                .then(async response => {
                    if (response.data) {
                        const songData = response.data.song || response.data;
                        console.log("Dados da música recebidos:", songData);
                        
                        let updatedSong = { ...songData };

                        // Se tiver album_id, busca os dados do álbum para pegar as imagens
                        if (songData.album_id) {
                            try {
                                console.log("Buscando álbum ID:", songData.album_id);
                                const albumRes = await axios.get(`${API_URL}/albums/${songData.album_id}`);
                                const albumData = albumRes.data.album || albumRes.data;
                                console.log("Dados do álbum:", albumData);
                                
                                // Usa as imagens do álbum
                                if (albumData.photo_cover) updatedSong.photo_cover = albumData.photo_cover;
                                if (albumData.photo_disk) updatedSong.photo_disk = albumData.photo_disk;
                                // Fallback caso o campo seja apenas 'photo'
                                if (!updatedSong.photo_cover && albumData.photo) updatedSong.photo_cover = albumData.photo;
                                
                            } catch (err) {
                                console.error("Erro ao buscar álbum:", err);
                            }
                        }

                        setSong(prev => ({ ...prev, ...updatedSong }));
                    }
                })
                .catch(error => console.error("Erro ao buscar detalhes da música:", error));
        }
    }, [initialSong?.id]);

    function toggleLike(songId) {
        setLikedSongs((prev) => ({
            ...prev,
            [songId]: !prev[songId],
        }));
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
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <EvilIcons name="arrow-left" size={30} color="white" style={styles.backIcon} />
                        </TouchableOpacity>

                        <Image
                            source={{ uri: getImageUrl(song?.photo_disk) }}
                            style={styles.albumImage}
                        />

                        <View style={styles.infoContainer}>
                            <View style={styles.info}>
                                <Text style={styles.titleAlbum}>{song?.title || 'Título'}</Text>
                                <Text style={styles.textAlbum}>{song?.singer_name || song?.artist || 'Artista'}</Text>
                            </View>
                            <View style={styles.infoAlbum}>
                                <TouchableOpacity onPress={() => toggleLike(song?.id)}>
                                    <FontAwesome
                                        name={likedSongs[song?.id] ? 'heart' : 'heart-o'}
                                        size={24}
                                        color={likedSongs[song?.id] ? 'red' : 'white'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Image
                            source={require('../assets/img/player.png')}
                            style={styles.player}
                        />
                        <View style={styles.lyricsBox}>
                            <Text style={styles.titleLyrics}>LETRA</Text>
                            <Text style={styles.lyrics}>
                                {song?.lyrics || 'Letra indisponível'}
                            </Text>
                        </View>
                        <View style={styles.card}>
                            <Image
                                source={{ uri: getImageUrl(song?.photo_cover) }}
                                style={styles.cardImage}
                            />

                            <View style={styles.cardContent}>
                                <Text style={styles.cardTitle}>DESCRIÇÃO</Text>
                                <Text style={styles.cardText}>
                                    {song?.description || 'Sem descrição'}
                                </Text>
                            </View>
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
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    player: {
        alignSelf: 'center',
        width: '90%',
        height: 90,
    },
    lyricsBox: {
        backgroundColor: '#F7F9FF',
        borderRadius: 15,
        paddingVertical: 20,
        width: '90%',
        alignSelf: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
        minHeight: 200,
    },
    titleLyrics: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00003C',
        textAlign: 'left',
    },
    lyrics: {
        marginTop: 10,
        fontSize: 16,
        color: '#00003C',
        textAlign: 'left',
    },
    card: {
    width: '90%',
    backgroundColor: '#F7F9FF',
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
},
cardImage: {
    width: '100%',
    height: 140,
},
cardContent: {
    padding: 15,
},
cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00003C',
    marginBottom: 10,
},
cardText: {
    fontSize: 15,
    color: '#00003C',
},
});