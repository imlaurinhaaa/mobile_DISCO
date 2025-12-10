import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';
const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:4000';
const IMAGE_URL = process.env.EXPO_PUBLIC_IMAGE_URL || 'http://localhost:4000/uploads';

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

export default function Search({ navigation }) {
    const [songs, setSongs] = useState([]);
    const [genres, setGenres] = useState([]);

    const [searchedSingers, setSearchedSingers] = useState([]);
    const [searchedAlbums, setSearchedAlbums] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedSinger, setSelectedSinger] = useState(null);
    const [singersByGenre, setSingersByGenre] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const debounceTimeout = useRef(null);

    useEffect(() => {
        loadAllSongs();
        loadGenres();
    }, []);

    useEffect(() => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (!search.trim()) {
            loadAllSongs();
            return;
        }

        debounceTimeout.current = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => {
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
        };
    }, [search]);

    const loadAllSongs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/songs`);
            setSongs(formatSongs(response.data || []));
            setSelectedGenre(null);
            setSelectedSinger(null);
            setSearchedSingers([]);
            setSearchedAlbums([]);
            setSingersByGenre([]);
        } catch (error) {
            console.error("Error loading all songs:", error);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    const loadGenres = async () => {
        try {
            const response = await axios.get(`${API_URL}/genres`);
            setGenres((response.data || []).map((g) => g.musical_genre));
        } catch (error) {
            console.error("Error loading genres:", error);
            setGenres([]);
        }
    };

    const loadSingersByGenre = async (genreName) => {
        try {
            const response = await axios.get(`${API_URL}/singers`, {
                params: { musical_genre: genreName },
            });
            setSingersByGenre(response.data || []);
        } catch (error) {
            console.error("Error loading singers by genre:", error);
            setSingersByGenre([]);
        }
    };

    const loadSongsBySinger = async (name) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/songs/singer`, {
                params: { name },
            });
            setSongs(formatSongs(response.data || []));
        } catch (error) {
            console.error("Error loading songs by singer:", error);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    const loadSongsByGenre = async (genreName) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/songs`, {
                params: { musical_genre: genreName },
            });
            setSongs(formatSongs(response.data || []));
        } catch (error) {
            console.error("Error loading songs by genre:", error);
            setSongs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectGenre = (genre) => {
        if (selectedGenre === genre) {
            setSelectedGenre(null);
            setSelectedSinger(null);
            setSingersByGenre([]);
            setSearchedSingers([]);
            setSearchedAlbums([]);
            loadAllSongs();
        } else {
            setSelectedGenre(genre);
            setSelectedSinger(null);
            setSearch("");
            setSearchedSingers([]);
            setSearchedAlbums([]);
            loadSingersByGenre(genre);
            loadSongsByGenre(genre);
        }
    };

    const handleSelectSinger = (singerName) => {
        if (selectedSinger === singerName) {
            setSelectedSinger(null);
            loadSongsByGenre(selectedGenre);
        } else {
            setSelectedSinger(singerName);
            loadSongsBySinger(singerName);
        }
    };

    const handleSearch = async () => {
        if (!search.trim()) return;

        setSelectedGenre(null);
        setSelectedSinger(null);
        setSingersByGenre([]);
        setLoading(true);

        try {
            const [respSongs, respSingers, respAlbums] = await Promise.all([
                axios.get(`${API_URL}/songs`, { params: { title: search } }),
                axios.get(`${API_URL}/singers`, { params: { name: search } }),
                axios.get(`${API_URL}/albums`, { params: { title: search } }),
            ]);
            setSongs(formatSongs(respSongs.data || []));
            setSearchedSingers(respSingers.data || []);
            setSearchedAlbums(respAlbums.data || []);
        } catch (error) {
            console.error("Error during search:", error);
            setSongs([]);
            setSearchedSingers([]);
            setSearchedAlbums([]);
        } finally {
            setLoading(false);
        }
    };

    const isSearching = !!search.trim();
    const showSearchResults = isSearching && (songs.length > 0 || searchedSingers.length > 0 || searchedAlbums.length > 0);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
            />

            <ScrollView horizontal style={styles.genreList} showsHorizontalScrollIndicator={false}>
                {Array.isArray(genres) && genres.map((genre, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.genreItem, selectedGenre === genre && styles.selectedGenre]}
                        onPress={() => handleSelectGenre(genre)}
                    >
                        <Text style={styles.genreText}>{genre}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {isSearching && !loading && (
                <ScrollView style={styles.searchResultsContainer}>
                    {searchedSingers.length > 0 && (
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionHeader}>Artistas</Text>
                            {searchedSingers.map((singer, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.resultCard}
                                    onPress={() => navigation.navigate('Singer', { id: singer.id, name: singer.name })}
                                >
                                    <Image 
                                        source={singer.photo ? { uri: getImageUrl(singer.photo) } : { uri: 'https://i.imgur.com/Rz7fZkG.png' }} 
                                        style={styles.resultImage} 
                                    />
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultTitle}>{singer.name}</Text>
                                        <Text style={styles.resultSubtitle}>{singer.musical_genre || 'Artista'}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {searchedAlbums.length > 0 && (
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionHeader}>Álbuns</Text>
                            {searchedAlbums.map((album, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.resultCard}
                                    onPress={() => navigation.navigate('Album', { id: album.id })}
                                >
                                    <Image 
                                        source={album.photo_cover ? { uri: getImageUrl(album.photo_cover) } : { uri: 'https://i.imgur.com/Rz7fZkG.png' }} 
                                        style={styles.resultImage} 
                                    />
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultTitle}>{album.title}</Text>
                                        <Text style={styles.resultSubtitle}>{album.artist}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {songs.length > 0 && (
                        <View style={styles.resultSection}>
                            <Text style={styles.sectionHeader}>Músicas</Text>
                            {songs.map((song, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.resultCard}
                                    onPress={() => navigation.navigate('SongsDetails', { id: song.id })}
                                >
                                    <Image 
                                        source={song.photo_cover ? { uri: song.photo_cover } : { uri: 'https://i.imgur.com/Rz7fZkG.png' }} 
                                        style={styles.resultImage} 
                                    />
                                    <View style={styles.resultTextContainer}>
                                        <Text style={styles.resultTitle}>{song.title}</Text>
                                        <Text style={styles.resultSubtitle}>{song.artist}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {!showSearchResults && search.length > 0 && (
                        <Text style={styles.noResults}>Nenhum resultado encontrado para "{search}"</Text>
                    )}
                </ScrollView>
            )}

            {!isSearching && (
                <View style={styles.filterSection}>
                    {selectedGenre && Array.isArray(singersByGenre) && singersByGenre.length > 0 && (
                        <ScrollView horizontal style={styles.singerList} showsHorizontalScrollIndicator={false}>
                            {singersByGenre.map((singer, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => navigation.navigate('Singer', { id: singer.id, name: singer.name })}
                                    style={[styles.singerItem, selectedSinger === singer.name && styles.selectedSinger]}>
                                    <Text style={styles.singerText}>{singer.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.songListContainer}>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />
                        ) : (
                            <>

                                <ScrollView style={styles.songList} contentContainerStyle={styles.songListContent}>
                                    {Array.isArray(songs) && songs.length > 0 ? (
                                        songs.map((song, index) => {
                                            const key = song.id ? song.id.toString() : song.title || index.toString();
                                            return (
                                                <TouchableOpacity
                                                    key={key}
                                                    style={styles.songCard}
                                                    onPress={() => navigation.navigate('SongsDetails', { id: song.id })}
                                                >
                                                    <View style={styles.songInfo}>
                                                        {song.photo_cover ? (
                                                            <Image source={{ uri: song.photo_cover }} style={styles.albumCover} />
                                                        ) : (
                                                            <View style={styles.albumCoverPlaceholder} />
                                                        )}
                                                        <View style={styles.textContainer}>
                                                            <Text style={styles.songTitle} numberOfLines={1}>{song.title || 'Sem título'}</Text>
                                                            <Text style={styles.duration} numberOfLines={1}>
                                                                {song.singer_name || song.musical_genre || 'Detalhe não disponível'}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            );
                                        })
                                    ) : (
                                        <Text style={styles.noResults}>Nenhuma música encontrada</Text>
                                    )}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

function formatSongs(arr) {
    return arr.map((s) => {
        // Tenta pegar a capa de várias propriedades possíveis
        const rawCover = s.photo_cover || s.cover || s.album_cover || s.photo_disk || null;
        return {
            ...s,
            photo_cover: getImageUrl(rawCover),
        };
    });
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#09054F',
    },
    searchInput: {
        borderWidth: 2,
        borderColor: '#a884f6ff',
        borderRadius: 25,
        padding: 12,
        marginTop: 50,
        marginBottom: 15,
        backgroundColor: '#5e5e686f',
        color: '#fff',
    },
    genreList: {
        marginBottom: 10,
        maxHeight: 50,
        color: '#fff',
    },
    genreItem: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedGenre: {
        borderWidth: 2,
        borderColor: '#a884f6ff',
        borderRadius: 20,
    },
    singerList: {
        marginBottom: 10,
        maxHeight: 50,
    },
    singerItem: {
        paddingVertical: 8,
        paddingHorizontal: 25,
        marginRight: 8,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSinger: {
        borderWidth: 2,
        borderColor: '#a884f6ff',
    },
    searchResultsContainer: {
        flex: 1,
        marginTop: 10,
    },
    resultSection: {
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 18,
        marginBottom: 10,
        color: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    resultCard: {
        padding: 10,
        backgroundColor: '#FFFFFF25',
        borderRadius: 8,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    resultImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: '#333',
    },
    resultTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    resultTitle: {
        color: '#fff',
        flexShrink: 1,
        fontWeight: 'bold',
    },
    resultSubtitle: {
        fontSize: 12,
        color: '#701010ff',
        marginLeft: 10,
    },
    filterSection: {
        flex: 1,
        marginTop: 10,
    },
    songListContainer: {
        flex: 1,
        marginTop: 10,
    },
    songList: {
        flex: 1,
    },
    songListContent: {
        paddingBottom: 20,
    },
    songCard: {
        padding: 12,
        marginBottom: 10,
        backgroundColor: '#FFFFFF25',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
    },
    songInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 4,
    },
    songTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    duration: {
        fontSize: 13,
        color: '#B0B0B0',
    },
    albumCover: {
        width: 54,
        height: 54,
        borderRadius: 10,
    },
    albumCoverPlaceholder: {
        width: 54,
        height: 54,
        borderRadius: 10,
        backgroundColor: '#2A2A4A',
    },
    genreText: {
        color: '#fff',
        textAlign: 'center',
    },
    singerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#fff',
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 10,
    },
});