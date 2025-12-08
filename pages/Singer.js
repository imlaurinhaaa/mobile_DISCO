import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:4000';
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || 'http://localhost:4000/uploads';

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

                // Se temos o nome, usa ele diretamente
                if (name) {
                    try {
                        const nameRes = await axios.get(`${API_URL}/singers`, { params: { name } });
                        if (nameRes.data && Array.isArray(nameRes.data) && nameRes.data.length > 0) {
                            singerData = nameRes.data[0];
                            console.log('Artista encontrado por nome:', singerData);
                        }
                    } catch (err) {
                        console.log('Falha ao buscar por nome:', err.message);
                    }
                }

                // Se não achou por nome, tenta por ID
                if (!singerData && id) {
                    try {
                        const singerRes = await axios.get(`${API_URL}/singers/${id}`);
                        if (singerRes.data) {
                            singerData = singerRes.data;
                            console.log('Artista encontrado por ID:', singerData);
                        }
                    } catch (err) {
                        console.log('Falha ao buscar por ID:', err.message);
                    }
                }

                if (singerData) {
                    setSinger(singerData);
                    console.log('Foto do artista:', singerData.photo);
                    console.log('Foto URL completa:', getImageUrl(singerData.photo));

                    // Busca as músicas do artista
                    try {
                        const songsRes = await axios.get(`${API_URL}/songs/singer`, {
                            params: { name: singerData.name }
                        });
                        setSongs(songsRes.data || []);
                        console.log('Músicas encontradas:', songsRes.data?.length);
                    } catch (songsErr) {
                        console.error('Erro ao buscar músicas:', songsErr.message);
                        setSongs([]);
                    }
                } else {
                    console.error('Nenhum artista encontrado');
                    setSinger(null);
                    setSongs([]);
                }
            } catch (error) {
                console.error('Erro geral ao buscar dados do artista:', error);
                setSinger(null);
                setSongs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSingerData();
    }, [id, name]);

    const getImageUrl = (path) => {
        console.log('getImageUrl chamado com:', path);

        if (!path) {
            console.log('Caminho vazio, retornando null');
            return null;
        }

        if (path.startsWith('http')) {
            console.log('Já é URL, retornando como está:', path);
            return path;
        }

        // Remove "uploads/" se existir no caminho
        let cleanPath = path.replace(/\\/g, '/');
        if (cleanPath.includes('uploads/')) {
            cleanPath = cleanPath.substring(cleanPath.indexOf('uploads/') + 8);
        }
        if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
        }

        const finalUrl = `${IMAGE_URL}/${cleanPath}`;
        console.log('URL final da imagem:', finalUrl);
        return finalUrl;
    };

    const toggleLike = (songId) => {
        setLikedSongs(prev => ({
            ...prev,
            [songId]: !prev[songId],
        }));
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#7A3CF0" style={{ marginTop: 50 }} />
            </View>
        );
    }

    const topSong = songs.length > 0 ? songs[0] : null;
    return (
        <View style={styles.container}>

            {/* TOPO COM IMAGEM */}
            <View style={styles.header}>
                <Image
                    source={singer?.photo ? { uri: getImageUrl(singer.photo) } : { uri: 'https://i.imgur.com/Rz7fZkG.png' }}
                    style={styles.headerImage}
                />

                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <EvilIcons name="arrow-left" size={32} color="#fff" />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <Text style={styles.artistName}>{singer?.name || 'Artista'}</Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{singer?.musical_genre || 'Gênero'}</Text>
                    </View>
                </View>
            </View>

            {/* FUNDO COM GRADIENTE */}
            <LinearGradient
                colors={['#2A0B52', '#0A0A23']}
                style={styles.gradient}
            />

            <ScrollView style={styles.content}>

                {/* CARD CONHEÇA O ARTISTA */}
                <View style={styles.artistCard}>
                    <Text style={styles.artistTitle}>Conheça, {singer?.name || 'Artista'}</Text>
                    <Text style={styles.artistDescription}>{singer?.about || singer?.description || 'Descrição do artista indisponível'}</Text>
                </View>

                {/* MÚSICA POPULAR */}
                {singer?.popular_song && (
                    <View style={styles.popularSongSection}>
                        <Text style={styles.sectionTitle}>Música Popular</Text>
                        <View style={styles.popularSongCard}>
                            <Text style={styles.popularSongText}>{singer.popular_song}</Text>
                        </View>
                    </View>
                )}

                {/* MAIS MÚSICAS */}
                {songs.length > 1 && (
                    <View style={styles.moreMusicsSection}>
                        <Text style={styles.sectionTitle}>Outras Músicas</Text>
                        {songs.slice(1).map((song, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.musicListItem}
                                onPress={() => navigation.navigate('SongsDetails', { id: song.id })}
                            >
                                <View style={styles.musicListInfo}>
                                    <Text style={styles.musicListTitle}>{song.title}</Text>
                                    <Text style={styles.musicListArtist}>{song.singer_name || singer?.name}</Text>
                                </View>
                                <TouchableOpacity onPress={() => toggleLike(song.id)}>
                                    <FontAwesome
                                        name={likedSongs[song.id] ? 'heart' : 'heart-o'}
                                        size={18}
                                        color={likedSongs[song.id] ? 'red' : '#fff'}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}



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
        backgroundColor: '#7A3CF0',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginTop: 8,
    },

    badgeText: {
        color: '#fff',
        fontSize: 12,
    },

    gradient: {
        height: 80,
        marginTop: -20,
    },

    content: {
        paddingHorizontal: 20,
        marginTop: -40,
    },

    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 10,
    },

    musicCard: {
        backgroundColor: '#5E5A86',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    musicInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    thumb: {
        width: 44,
        height: 44,
        backgroundColor: '#888',
        borderRadius: 8,
    },

    musicTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

    musicArtist: {
        color: '#ddd',
        fontSize: 12,
    },

    actions: {
        flexDirection: 'row',
        gap: 14,
    },

    artistCard: {
        backgroundColor: '#F5F7FF',
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
        color: '#666',
        marginTop: 10,
        lineHeight: 20,
    },

    noSongs: {
        color: '#888',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 20,
    },

    moreMusicsSection: {
        marginTop: 30,
        marginBottom: 30,
    },

    musicListItem: {
        backgroundColor: '#5E5A86',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    musicListInfo: {
        flex: 1,
        marginRight: 10,
    },

    musicListTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },

    musicListArtist: {
        color: '#ddd',
        fontSize: 12,
    },

    popularSongSection: {
        marginTop: 20,
        marginBottom: 30,
    },

    popularSongCard: {
        backgroundColor: '#7A3CF0',
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
});
