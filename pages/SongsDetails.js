'use client';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
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
    const { song: initialSong, id: songId } = route.params || {};
    const [song, setSong] = useState(initialSong || {});
    const [likedSongs, setLikedSongs] = useState({});
    const [lyricsVisible, setLyricsVisible] = useState(false);

    useEffect(() => {
        const id = initialSong?.id || songId;
        if (id) {
            axios.get(`${API_URL}/songs/${id}`)
                .then(async response => {
                    if (response.data) {
                        const songData = response.data.song || response.data;

                        let updatedSong = { ...songData };

                        // Buscar dados do cantor se não tiver singer_name
                        if (songData.singer_id && !songData.singer_name) {
                            try {
                                const singerRes = await axios.get(`${API_URL}/singers/${songData.singer_id}`);
                                const singerData = singerRes.data.singer || singerRes.data;

                                if (singerData.name) updatedSong.singer_name = singerData.name;
                            } catch (err) {
                                console.error("Erro ao buscar cantor:", err);
                            }
                        }

                        if (songData.album_id) {
                            try {
                                const albumRes = await axios.get(`${API_URL}/albums/${songData.album_id}`);
                                const albumData = albumRes.data.album || albumRes.data;

                                if (albumData.photo_cover) updatedSong.photo_cover = albumData.photo_cover;
                                if (albumData.photo_disk) updatedSong.photo_disk = albumData.photo_disk;
                                if (!updatedSong.photo_cover && albumData.photo) updatedSong.photo_cover = albumData.photo;

                            } catch (err) {
                                console.error("Erro ao buscar álbum:", err);
                            }
                        }

                        setSong(updatedSong);
                    }
                })
                .catch(error => console.error("Erro ao buscar detalhes da música:", error));
        }
    }, [songId, initialSong?.id]);

    function toggleLike(songId) {
        setLikedSongs((prev) => ({
            ...prev,
            [songId]: !prev[songId],
        }));
    }

    return (
        <View style={styles.container}>
            <Svg style={styles.background} pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <Defs>
                    <RadialGradient id="radial" cx="50%" cy="30%" rx="50%" ry="50%">
                        <Stop offset="0%" stopColor="#231385" />
                        <Stop offset="100%" stopColor="#101027" />
                    </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#radial)" />
            </Svg>

            <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 40 }}>
                <View>
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
                            <Text style={styles.textAlbum}>{song?.singer_name || song?.artist || 'Artista desconhecido'}</Text>
                        </View>
                        <View style={styles.infoAlbum}>
                            <View style={styles.likeWrapper}>
                                <TouchableOpacity onPress={() => toggleLike(song?.id)}>
                                    <FontAwesome
                                        name={likedSongs[song?.id] ? 'heart' : 'heart-o'}
                                        size={24}
                                        color={likedSongs[song?.id] ? 'red' : 'white'}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.durationText}>{song?.duration || ''}</Text>
                            </View>
                        </View>
                    </View>
                    <Image
                        source={require('../assets/img/player.png')}
                        style={styles.player}
                    />
                    <View style={styles.lyricsBox}>
                        <Text style={styles.titleLyrics}>LETRA</Text>
                        <Text style={styles.lyricsPreview} numberOfLines={4} ellipsizeMode="tail">
                            {song?.lyrics || 'Letra indisponível'}
                        </Text>
                        {song?.lyrics ? (
                            <TouchableOpacity style={styles.showMoreBtn} onPress={() => setLyricsVisible(true)}>
                                <Text style={styles.showMoreText}>Ver letra completa</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>

                    <Modal
                        visible={lyricsVisible}
                        animationType="slide"
                        transparent
                        onRequestClose={() => setLyricsVisible(false)}
                    >
                        <Pressable style={styles.modalBackdrop} onPress={() => setLyricsVisible(false)}>
                            <Pressable style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Letra completa</Text>
                                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                                    <Text style={styles.modalLyrics}>{song?.lyrics || 'Letra indisponível'}</Text>
                                </ScrollView>
                                <TouchableOpacity style={styles.closeBtn} onPress={() => setLyricsVisible(false)}>
                                    <Text style={styles.closeBtnText}>Fechar</Text>
                                </TouchableOpacity>
                            </Pressable>
                        </Pressable>
                    </Modal>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101027',
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
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
    likeWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    durationText: {
        color: '#b0b0c3',
        fontSize: 12,
        fontWeight: '500',
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
    lyricsPreview: {
        marginTop: 10,
        fontSize: 16,
        color: '#00003C',
        textAlign: 'left',
    },
    titleLyrics: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00003C',
        textAlign: 'left',
    },
    showMoreBtn: {
        marginTop: 12,
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#0A0835',
    },
    showMoreText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#0F1027',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '75%',
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
    },
    modalLyrics: {
        color: '#E0E0F0',
        fontSize: 15,
        lineHeight: 22,
    },
    closeBtn: {
        marginTop: 16,
        alignSelf: 'center',
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: '#7A3CF0',
    },
    closeBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
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