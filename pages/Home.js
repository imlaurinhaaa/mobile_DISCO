import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import CirclArtist from '../components/circlArtist';
import AlbumCard from '../components/albumCard';
import Radial from '../components/radial';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || 'http://localhost:4000/uploads';
const SERVER_URL = 'http://192.168.112.1:4000';

export default function Home({ navigation }) {
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
                <View style={styles.buttonsArea}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: 'white' }}>Álbuns</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: 'white' }}>Artistas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: 'white' }}>Músicas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: 'white' }}>Playlists</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.horizontalCards}>
                    <Text style={styles.sectionTitle}>Álbums</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        {albums.map((album, index) => (
                            <AlbumCard
                                key={album.id ?? index}   // → AQUI!!!
                                title={album.title}
                                artist={album.singer_name}
                                image={album.image}
                                color="#1A3DBE"
                                liked={likedAlbums[index]}
                                onLikePress={() => toggleAlbumLike(index)}
                                onPress={() => navigation.navigate("Album", { id: album.id })}
                            />
                            
                        ))}

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
                    {songs.map((song, i) => (
                        <TouchableOpacity
                            key={i}
                            style={styles.musicCard}
                            onPress={() => navigation.navigate('SongsDetails', { id: song.id })}
                        >
                            <Image source={{ uri: song.photo_cover }} style={styles.albumCover} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ color: '#fff', fontSize: 13 }}>{song.title}</Text>
                                <Text style={{ color: '#CACACA', fontSize: 10 }}>{song.duration}</Text>
                                <Text style={{ color: '#CACACA', fontSize: 10 }}>{song.singer_name}</Text>
                            </View>
                            <View style={{ marginLeft: 'auto', marginRight: 10 }}>
                                <TouchableOpacity onPress={() => toggleRecommendedLike(i)}>
                                    <FontAwesome name={likedRecommended[i] ? 'heart' : 'heart-o'} size={24} color={likedRecommended[i] ? 'red' : 'white'} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    ))}

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
    buttonsArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'transparent',
        alignSelf: 'stretch',
        marginBottom: 30,
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
        backgroundColor: '#ffffff7e',
        marginBottom: 20,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 50,
        width: 50,
        backgroundColor: '#09054F',
        borderRadius: 10,
        marginRight: 10,
    }
})