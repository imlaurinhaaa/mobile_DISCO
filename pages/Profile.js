import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

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
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [artists, setArtists] = useState([]);
    const [albuns, setAlbuns] = useState([]);

    const fetchUserData = async () => {
        try {
            // Buscar dados do usuário logado do AsyncStorage
            const userDataStr = await AsyncStorage.getItem('userData');
            console.log('Dados do AsyncStorage:', userDataStr);

            if (userDataStr) {
                const userData = JSON.parse(userDataStr);
                console.log('Usuário recuperado:', userData);
                setUser(userData);
            } else {
                // Fallback se não houver dados salvos
                console.log('Nenhum usuário logado');
                setUser({
                    id: 1,
                    name: 'Usuário',
                    email: 'user@example.com',
                    photo: null
                });
            }
        } catch (error) {
            console.error('Erro ao buscar dados do usuário:', error);
            setUser({
                id: 1,
                name: 'Usuário',
                email: 'user@example.com',
                photo: null
            });
        }
    };

    // Atualizar dados quando a tela ganhar foco
    useFocusEffect(
        React.useCallback(() => {
            fetchUserData();
        }, [])
    );

    useEffect(() => {
        fetchUserData();
    }, []);

    const pickImage = async () => {
        // Pedir permissão para acessar a galeria
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos!');
            return;
        }

        // Abrir seletor de imagem
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const imageUri = result.assets[0].uri;

            // Atualizar foto do usuário localmente
            setUser(prev => ({ ...prev, photo: imageUri }));

            // TODO: Fazer upload da imagem para o servidor
            // uploadProfilePhoto(imageUri);
        }
    };

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


    const renderArtist = ({ item }) => (
        <TouchableOpacity style={styles.artistRow} onPress={() => navigation.navigate('Singer', { name: item.name, id: item.id })}>
            <Image source={{ uri: getImageUrl(item.photo) }} style={styles.artistImage} />
            <Text style={styles.artistName}>{item.name}</Text>
        </TouchableOpacity>
    );

    const renderAlbum = ({ item }) => (
        <TouchableOpacity style={styles.albumCard} onPress={() => navigation.navigate('Album', { id: item.id })}>
            <Image source={{ uri: getImageUrl(item.photo_cover) }} style={styles.albumImage} />
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
                            <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                                {user?.photo ? (
                                    <Image source={{ uri: user.photo.startsWith('file://') || user.photo.startsWith('http') ? user.photo : getImageUrl(user.photo) }} style={styles.profileImage} />
                                ) : (
                                    <View style={styles.profileImagePlaceholder}>
                                        <Ionicons name="person" size={50} color="#b0b0c3" />
                                    </View>
                                )}
                                <View style={styles.editPhotoButton}>
                                    <Ionicons name="camera" size={16} color="#fff" />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.profileName}>Olá, <Text style={styles.profileNameBold}>{user?.name || 'Usuário'}</Text></Text>
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
    profileImageContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    profileImagePlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#2A2A4A',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#7A3CF0',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#101027',
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

    albumCard: {
        width: '48%',
        alignItems: 'center',
        marginBottom: 16,
    },
    albumImage: {
        width: 100,
        height: 100,
        borderRadius: 12,
        marginBottom: 8,
    },
    albumPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 12,
        backgroundColor: '#2a2a40',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    albumsList: {
        alignContent: 'center'
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
        alignContent: 'center'
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
