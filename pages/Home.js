import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import CirclArtist from '../components/circlArtist';
import AlbumCard from '../components/albumCard';
import Radial from '../components/radial';
import axios from 'axios';

const API_URL_SINGERS = 'http://192.168.112.1:4000/api/singers';
const API_URL_SONGS = 'http://192.168.112.1:4000/api/songs';
const API_URL_ALBUMS = 'http://192.168.112.1:4000/api/albums';

export default function Home() {
    const [singers, setSingers] = useState([]);
    const [failedImages, setFailedImages] = useState({});
    const [songs, setSongs] = useState([]);
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        const fetchSingers = async () => {
            try {
                const response = await axios.get(API_URL_SINGERS);
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
                const response = await axios.get(API_URL_SONGS);
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
                const response = await axios.get(API_URL_ALBUMS);
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        {albums.map((album, index) => (
                            <View
                                key={album.id ?? index}
                                style={{
                                    backgroundColor: '#224899',
                                    width: 320,
                                    height: 130,
                                    padding: 20,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexDirection: 'row',
                                    marginRight: 12,
                                    gap: 10
                                }}
                            >
                                <View style={{
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'flex-start'
                                }}>
                                    <Text style={{ color: 'white', fontSize: 18 }}>{album.title}</Text>
                                    <Text style={{ color: 'white' }}>{album.singer_name || album.artist || 'Nome da Cantora'}</Text>
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: 10,
                                        marginTop: 15,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Ionicons name="play-circle-sharp" size={24} color="#09054F" />
                                        <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => toggleAlbumLike(index)}>
                                            <FontAwesome name={likedAlbums[index] ? 'heart' : 'heart-o'} size={20} color={likedAlbums[index] ? 'red' : 'white'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={{ width: 80, height: 80 }}>
                                    <Image
                                        source={album.image ? { uri: album.image } : require("../assets/img/artists.png")}
                                        style={{ width: 80, height: 80, borderRadius: 8 }}
                                    />
                                </View>
                            </View>
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
                                        ? `http://192.168.112.1:4000/uploads/${singer.photo}`
                                        : `http://192.168.112.1:4000/uploads/${singer.photo}.jpg`)
                                : null;

                            const showRemote = imageUrl && !failedImages[index];

                            return (
                                <View
                                    style={{ width: 100, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}
                                    key={singer.id ?? index}
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
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={styles.verticalCards}>
                    <Text style={styles.sectionTitle}>Recomendados para você</Text>
                    {songs.map((song, i) => (
                        <View key={i} style={styles.musicCard}>
                            <View style={styles.recommendedThumb} />
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
                        </View>
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
    recommendedThumb: {
        height: 50,
        width: 50,
        backgroundColor: '#09054F',
        borderRadius: 10,
        marginRight: 10,
    }
})