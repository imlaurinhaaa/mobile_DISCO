import React, { useState, useEffect, use } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.243:4000/api";
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || "http://192.168.0.243:4000/uploads";

const getImageUrl = (path) => {
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

    return `${IMAGE_URL}/${cleanPath}`;
};


import { Ionicons } from '@expo/vector-icons';

export default function Profile({ navigation }) {
    const user = {
        id: 1,
        name: 'Ana Carolina',
        email: 'ana.carolina@example.com',
        photo: 'https://avatars.githubusercontent.com/u/158210617?v=4'
    };

    const [favorites, setFavorites] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albuns, setAlbuns] = useState([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favoriteIds = [5, 119, 138, 295, 412];
            try {
                const response = await axios.get(`${API_URL}/songs`);
                const allSongs = response.data || [];
                const myFavorites = allSongs.filter(song => favoriteIds.includes(song.id));
                setFavorites(myFavorites);
            } catch (error) {
                console.error("Erro ao buscar músicas favoritas:", error);
            }
        };

        fetchFavorites();
    }, []);

    useEffect(() => {
        const fetchArtists = async () => {
            const favoriteArtistIds = [1, 3, 7, 10];
            try {
                const response = await axios.get(`${API_URL}/singers`);
                const allArtists = response.data || [];
                const myFavoriteArtists = allArtists.filter(artist => favoriteArtistIds.includes(artist.id));
                setArtists(myFavoriteArtists);
            } catch (error) {
                console.error("Erro ao buscar artistas favoritos:", error);
            }
        };

        fetchArtists();
    }, []);

    useEffect(() => {
        const fetchAlbuns = async () => {
            const favoriteAlbumIds = [2, 4, 5, 7];
            try {
                const response = await axios.get(`${API_URL}/albums`);
                const allAlbuns = response.data || [];
                const myFavoriteAlbuns = allAlbuns.filter(album => favoriteAlbumIds.includes(album.id));
                setAlbuns(myFavoriteAlbuns);
            }
            catch (error) {
                console.error("Erro ao buscar álbuns favoritos:", error);
            }
        };

        fetchAlbuns();
    }, []);

    const playlists = [
        { id: '1', title: 'The best of the bests', photo: 'https://i.pinimg.com/736x/f2/8b/13/f28b1349987d7717a82b6894fe01ed1c.jpg' },
        { id: '2', title: 'Karaoke Vibes', photo: 'https://i.pinimg.com/1200x/c4/ae/3e/c4ae3ecfad0a478cef7464054f6323da.jpg' },
        { id: '3', title: 'Nostalgia', photo: 'https://i.pinimg.com/736x/a5/22/ae/a522aedbcc735e48f8d3606bfeb6df2a.jpg' },
        { id: '4', title: 'Walking in the wind', photo: 'https://i.pinimg.com/736x/a0/74/67/a07467a9c9a8b934079fffd5169162cb.jpg' },
    ];

    const renderFavorite = ({ item }) => (
        <TouchableOpacity style={styles.songRow} onPress={() => navigation.navigate('SongsDetails', { song: item })}>
            <View style={styles.songMeta}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songArtist}>{item.singer_name || item.artist || 'Artista Desconhecido'}</Text>
            </View>
            <Text style={styles.songDuration}>{item.duration}</Text>
            <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart-outline" size={16} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const renderPlaylist = ({ item }) => (
        <View style={styles.playlistCard}>
            {item.photo ? (
                <Image source={{ uri: getImageUrl(item.photo) }} style={styles.playlistImage} />
            ) : (
                <View style={styles.playlistPlaceholder}>
                    <Ionicons name="add" size={34} color="#333" />
                </View>
            )}
        </View>
    );

    const renderArtist = ({ item }) => (
        <TouchableOpacity style={styles.artistRow} onPress={() => navigation.navigate('Singer', { name: item.name, id: item.id })}>
            <Image source={{ uri: getImageUrl(item.photo) }} style={styles.artistImage} />
            <Text style={styles.artistName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderAlbum = ({ item }) => (
        <TouchableOpacity style={styles.playlistCard} onPress={() => navigation.navigate('Album', { album: item })}>
            <Image source={{ uri: getImageUrl(item.photo_cover) }} style={styles.playlistImage} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.contentWrapper}>
                    <Svg style={[styles.blur, { pointerEvents: 'none' }]} viewBox="0 0 420 420" preserveAspectRatio="xMidYMid slice">
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
                        <Rect x="0" y="0" width="420" height="420" rx="210" fill="url(#radial)" />
                    </Svg>
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.profileHeader}>
                            <Image source={{ uri: user.photo }} style={styles.profileImage} />
                            <Text style={styles.profileName}>Hi, <Text style={styles.profileNameBold}>{user.name}</Text></Text>
                        </View>

                        <View style={styles.Favssection}>
                            <Text style={styles.sectionTitle}>Suas favoritas</Text>
                            <FlatList
                                data={favorites}
                                renderItem={renderFavorite}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                            />
                        </View>

                        <View style={styles.playlistsSection}>
                            <Text style={styles.sectionTitle}>Suas playlists</Text>
                            <FlatList
                                data={playlists}
                                renderItem={renderPlaylist}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                numColumns={2}
                                columnWrapperStyle={{ gap: 12 }}
                                style={styles.playlistsList}
                            />
                        </View>

                        <View style={styles.artistsSection}>
                            <Text style={styles.sectionTitle}>Seus artistas favoritos</Text>
                            <FlatList
                                data={artists}
                                renderItem={renderArtist}
                                keyExtractor={(artist) => artist.name}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.artistsList}
                            />
                        </View>

                        <View style={styles.albunsSection}>
                            <Text style={styles.sectionTitle}>Seus álbuns favoritos</Text>
                            <FlatList
                                data={albuns}
                                renderItem={renderAlbum}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                numColumns={2}
                                columnWrapperStyle={{ gap: 12 }}
                                style={styles.albunsList}
                            />
                            </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101027',
    },
    contentWrapper: {
        flex: 1,
        overflow: 'hidden',
    },
    blur: {
        position: 'absolute',
        width: 420,
        height: 420,
        borderRadius: 210,
        top: -100,
        left: -80,
        opacity: 0.5,
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    profileHeader: {
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 100,
        marginBottom: 12,
    },
    profileName: {
        color: '#fff',
    },
    profileNameBold: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    Favssection: {
        marginBottom: 24,
    },
    playlistsSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 16,
    },
    songRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    songMeta: {
        flex: 1,
        justifyContent: 'center',
    },
    songTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    songArtist: {
        color: '#aaa',
        fontSize: 14,
    },
    songDuration: {
        color: '#aaa',
        fontSize: 14,
        marginRight: 12,
    },
    heartButton: {
        padding: 4,
    },
    
    playlistCard: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 16,
    },
    playlistImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginBottom: 8,
    },
    playlistPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#2a2a40',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    playlistsList: {
        alignContent:'center'
},
artistsList: {
    paddingLeft: 0,
},
    artistRow: {
        alignItems: 'center',
        marginRight: 16,
    },
    artistImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#333',
        marginBottom: 8,
    },
    artistName: {
        color: '#fff',
        fontSize: 14,
    },
    albunsSection: {
        marginTop: 24,
    },
    albunsList: {
        alignContent:'center'
    },
    songCover: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#2a2a40',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
});
