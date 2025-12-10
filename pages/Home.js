import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import CirclArtist from '../components/circlArtist';
import AlbumCard from '../components/albumCard';
import Radial from '../components/radial';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || 'http://localhost:4000/uploads';
const SERVER_URL = 'http://192.168.112.1:4000';

const getImageUrl = (path) => {
    if (!path) return null;
    if (typeof path === 'string' && (path.startsWith('http://') || path.startsWith('https://'))) {
        return path;
    }
    return `${IMAGE_URL}/${path}`;
};

export default function Home() {
    const navigation = useNavigation();
    const [singers, setSingers] = useState([]);
    const [failedImages, setFailedImages] = useState({});
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchSingers = async () => {
            try {
                const response = await axios.get(`${API_URL}/singers`);
                setSingers(response.data);
            } catch (error) {
                console.log('Erro ao buscar cantores: ', error);
            }
        }
        fetchSingers();
    }, []);

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get(`${API_URL}/songs`);
                console.log('Songs recebidas:', response.data.length, 'Primeira música:', response.data[0]);
                setSongs(response.data);
            } catch (error) {
                console.log('Erro ao buscar músicas: ', error);
            }
        }
        fetchSongs();
    }, []);

    useEffect(() => {
        const fetchAlbums = async () => {
            try {
                const response = await axios.get(`${API_URL}/albums`);
                setAlbums(response.data);
            } catch (error) {
                console.log('Erro ao buscar álbuns: ', error);
            }
        };
        fetchAlbums();
    }, []);

    const [likedRecommended, setLikedRecommended] = useState({});
    const [likedAlbums, setLikedAlbums] = useState({});

    const toggleRecommendedLike = (i) => {
        setLikedRecommended(prev => ({ ...prev, [i]: !prev[i] }));
    };

    const toggleAlbumLike = (i) => {
        setLikedAlbums(prev => ({ ...prev, [i]: !prev[i] }));
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Radial />
                <View style={styles.logoArea}>
                    <Image source={require('../assets/img/logo.png')} style={{ width: 200, height: 70 }} resizeMode="contain" />
                </View>
                <View style={styles.horizontalCards}>
                    <Text style={styles.sectionTitle}>Álbums</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {albums.map((album, index) => {
                            console.log('Album:', album.title, '| photo_cover:', album.photo_cover, '| URL:', getImageUrl(album.photo_cover));
                            return (
                                <AlbumCard
                                    key={album.id ?? index}
                                    title={album.title}
                                    artist={album.singer_name}
                                    photo_cover={getImageUrl(album.photo_cover)}
                                    image={getImageUrl(album.image)}
                                    color="#1A3DBE"
                                    liked={likedAlbums[index]}
                                    onLikePress={() => toggleAlbumLike(index)}
                                    onPress={() => navigation.navigate("Album", { id: album.id })}
                                />
                            );
                        })}

                    </ScrollView>
                </View>

                <View style={styles.horizontalCards}>
                    <Text style={styles.sectionTitle}>Artistas em Destaque</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        {singers.map((singer, index) => {
                            const imageUrl = singer.photo
                                ? (typeof singer.photo === 'string' && (singer.photo.startsWith('http://') || singer.photo.startsWith('https://'))
                                    ? singer.photo
                                    : singer.photo.includes('.')
                                        ? `${IMAGE_URL}/${singer.photo}`
                                        : `${IMAGE_URL}/${singer.photo}.jpg`)
                                : null;

                            const showRemote = imageUrl && !failedImages[index];

                            return (
                                <TouchableOpacity
                                    style={{ width: 100, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
                                    key={singer.id ?? index}
                                    onPress={() => navigation.navigate('Singer', { id: singer.id, name: singer.name })}
                                >
                                    <Image
                                        source={showRemote ? { uri: imageUrl } : require('../assets/img/artist.png')}
                                        style={{ width: 100, height: 100, borderRadius: 50 }}
                                        resizeMode="cover"
                                        onError={(e) => {
                                            console.warn('Erro ao carregar imagem:', imageUrl, e.nativeEvent);
                                            setFailedImages(prev => ({ ...prev, [index]: true }));
                                        }}
                                    />
                                    <Text style={{ color: '#fff', marginTop: 6, width: 100, textAlign: 'center' }}>{singer.name}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={styles.verticalCards}>
                    <Text style={styles.sectionTitle}>Recomendados para você</Text>
                    {songs.map((song, i) => {
                        if (i === 0) console.log('Dados da primeira música:', song);
                        return (
                            <TouchableOpacity
                                key={i}
                                style={styles.musicCard}
                                onPress={() => {
                                    console.log('Clicou na música:', song.title, 'ID:', song.id);
                                    try {
                                        navigation.navigate('SongsDetails', { id: song.id });
                                    } catch (error) {
                                        console.error('Erro ao navegar:', error);
                                    }
                                }}
                            >
                                {getImageUrl(song.album_cover) ? (
                                    <Image source={{ uri: getImageUrl(song.album_cover) }} style={styles.songCover} />
                                ) : (
                                    <View style={styles.songCoverPlaceholder} />
                                )}
                                <View style={styles.songMeta}>
                                    <Text style={styles.songTitle}>{song.title}</Text>
                                    <Text style={styles.songArtist}>{song.singer_name || 'Artista desconhecido'}</Text>
                                </View>
                                <Text style={styles.songDuration}>{song.duration || ''}</Text>
                                <TouchableOpacity onPress={() => toggleRecommendedLike(i)}>
                                    <FontAwesome
                                        name={likedRecommended[i] ? 'heart' : 'heart-o'}
                                        size={20}
                                        color={likedRecommended[i] ? 'red' : '#fff'}
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    })}

                    {/* {recommended.map((_, i) => (
                        
                    ))} */}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        flexDirection: 'column',
        backgroundColor: '#101027',
        // padding: 20,
    },
    logoArea: {
        alignItems: 'center',
        marginTop: 50,
    },
    button: {
        backgroundColor: 'transparent',
        paddingHorizontal: 13,
        height: 32,
        justifyContent: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'white',
    },
    horizontalCards: {
        width: '100%',
        alignSelf: 'stretch',
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        color: 'white',
        fontSize: 20,
        marginBottom: 10,
        alignSelf: 'flex-start',
        marginLeft: 0,
    },
    verticalCards: {
        width: '100%',
        alignSelf: 'stretch',
        paddingHorizontal: 20,
    }
    ,
    musicCard: {
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
})