import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import { Path } from 'react-native-svg';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const IMAGE_BASE_URL = API_URL.replace(/\/api$/, '') + '/uploads';

function formatSongCover(s) {
    const rawCover = s.photo_cover || s.cover || s.album_cover || null;
    let coverUrl = null;
    if (rawCover && typeof rawCover === 'string') {
        if (/^https?:\/\//i.test(rawCover)) {
            coverUrl = rawCover;
        } else {
            let cleanPath = rawCover.replace(/\\/g, '/');
            if (cleanPath.includes('uploads/')) {
                cleanPath = cleanPath.substring(cleanPath.indexOf('uploads/') + 8);
            }
            coverUrl = `${IMAGE_BASE_URL}/${cleanPath}`;
        }
    }
    return coverUrl || 'https://i.imgur.com/Rz7fZkG.png';
}

const getSingerImageUrl = (path) => {
    if (!path || typeof path !== 'string') return 'https://i.imgur.com/Rz7fZkG.png';
    if (path.startsWith('http')) return path;

    let cleanPath = path.replace(/\\/g, '/');
    if (cleanPath.includes('uploads/')) {
        cleanPath = cleanPath.substring(cleanPath.indexOf('uploads/') + 8);
    }
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }
    return `${IMAGE_BASE_URL}/${cleanPath}`;
};

export default function SingerScreen({ route, navigation }) {
    const { id, name } = route.params || {};
    const [singer, setSinger] = useState(null);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedSongs, setLikedSongs] = useState({});

    useEffect(() => {
        const fetchSingerData = async () => {
            if (!id && !name) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                let singerData = null;

                if (name) {
                    const nameRes = await axios.get(`${API_URL}/singers`, { params: { name } });
                    if (nameRes.data && Array.isArray(nameRes.data) && nameRes.data.length > 0) {
                        singerData = nameRes.data[0];
                    }
                }

                if (!singerData && id) {
                    const singerRes = await axios.get(`${API_URL}/singers/${id}`);
                    if (singerRes.data) {
                        singerData = singerRes.data.singer || singerRes.data;
                    }
                }

                if (singerData) {
                    setSinger(singerData);

                    try {
                        const songsRes = await axios.get(`${API_URL}/songs/singer`, {
                            params: { name: singerData.name }
                        });

                        const formattedSongs = (songsRes.data || []).map(s => ({
                            ...s,
                            album_cover: formatSongCover(s)
                        }));
                        setSongs(formattedSongs);
                    } catch (songsError) {
                        console.error('Erro ao buscar músicas do cantor:', songsError.message);
                        setSongs([]);
                    }
                } else {
                    console.error('Cantor não encontrado');
                    setSongs([]);
                    setSinger(null);
                }
            } catch (error) {
                console.error('Erro ao buscar dados do cantor:', error.message);
                setSongs([]);
                setSinger(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSingerData();
    }, [id, name]);

    const toggleLikeSong = (songId) => {
        setLikedSongs(prev => ({
            ...prev,
            [songId]: !prev[songId]
        }));
    };

    if (loading) {
        return (
            <View style={styles.conntainer}>
                <ActivityIndicator size="large" color="#7A3CF0" style={{ marginTop: 50 }} />
            </View>
        );
    }

    if (!singer) {
        return (
            <View style={styles.container}>
                <Text style={styles.noResults}>Cantor não encontrado</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: getSingerImageUrl(singer.photo) }}
                    style={styles.headerImage}
                />

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <EvilIcons name="arrow-left" size={40} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <Text style={styles.artistName}>{singer.name || 'Artista'}</Text>
                </View>
            </View>

            <LinearGradient
                colors={['#2A0B52', '#0A0A23']}
                style={styles.gradient}
            />

            <ScrollView style={styles.content}>

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{singer.musical_genre || 'Gênero'}</Text>
                </View>

                <View style={styles.artistCard}>
                    <Text style={styles.artistTitle}>Conheça, {singer.name || 'Artista'}</Text>
                    <Text style={styles.artistDescription}>{singer.about || singer.description || 'Descrição do artista não disponível.'}</Text>
                </View>

                {singer.popular_song && (
                    <View style={styles.popularSongSection}>
                        <Text style={styles.sectionTitle}>Música Popular</Text>
                        <View style={styles.popularSongCard}>
                            <Text style={styles.popularSongText}>{singer.popular_song}</Text>
                        </View>
                    </View>
                )}

                <View style={styles.moreMusicsSection}>
                    <Text style={styles.sectionTitle}>Outras Músicas</Text>
                    {songs.length > 0 ? (
                        songs.map((song, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.musicListItem}
                                onPress={() => navigation.navigate('SongsDetails', { id: song.id })}
                            >

                                <View style={styles.musicListInfoGroup}>
                                    <Image
                                        source={{ uri: song.album_cover }}
                                        style={styles.albumCover}
                                    />
                                    <View style={styles.musicListInfo}>
                                        <Text style={styles.musicListTitle} numberOfLines={1}>{song.title}</Text>
                                        <Text style={styles.musicListArtist} numberOfLines={1}>{song.singer_name || singer.name}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => toggleLike(song.id)}>
                                    <FontAwesome
                                        name={likedSongs[song.id] ? 'heart' : 'heart-o'}
                                        size={18}
                                        color={likedSongs[song.id] ? 'red' : '#fff'}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <Text style={styles.noSongs}>Nenhuma música encontrada para este artista.</Text>
                    )}
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0A0A23',
    },
    header: {
        height: 260,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: 260,
        position: 'absolute',
    },
    back: {
        position: 'absolute',
        top: 40,
        left: 16,
        zIndex: 10,
    },
    headerContent: {
        position: 'absolute',
        bottom: 20,
        left: 20,
    },
    artistName: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 5,
    },
    badgeText: {
        color: '#fff',
        fontSize: 18,
    },
    gradient: {
        height: 80,
        marginTop: -20,
    },
    content: {
        paddingHorizontal: 20,
        marginTop: -40,
        flex: 1,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    artistCard: {
        backgroundColor: '#d1b8ffff',
        height: 'auto',
        borderRadius: 20,
        marginTop: 20,
        padding: 20,
    },
    artistTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1A1A3C',
    },
    artistDescription: {
        fontSize: 14,
        color: '#1A1A3C',
        marginTop: 10,
        lineHeight: 20,
    },
    popularSongSection: {
        marginTop: 20,
        marginBottom: 30,
    },
    popularSongCard: {
        backgroundColor: '#2A0B52',
        borderRadius: 12,
        padding: 16,
        marginTop: 10,
    },
    popularSongText: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500',
    },
    moreMusicsSection: {
        marginTop: 30,
        marginBottom: 30,
    },
    musicListItem: {
        backgroundColor: '#1A1A3C',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    musicListInfoGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    albumCover: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 15,
        backgroundColor: '#2A2A4A',
    },
    musicListInfo: {
        flex: 1,
    },
    musicListTitle: {
        color: '#F5F7FF',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 4,
    },
    musicListArtist: {
        color: '#AAAAAA',
        fontSize: 13,
    },
    noSongs: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 40,
    },
    noResults: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
    },
    backButton: {
        marginTop: 20,
        alignSelf: 'center',
        padding: 10,
        backgroundColor: '#7A3CF0',
        borderRadius: 10,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
    }
});