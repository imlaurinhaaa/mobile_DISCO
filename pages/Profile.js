import React from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
    // Hardcoded user so you can style the profile page without DB inserts
    const user = {
        id: 1,
        name: 'Joana Silva',
        email: 'joana.silva@example.com',
        photo: 'https://i.pravatar.cc/300?img=47'
    };

    // Sample favorite songs (hardcoded for styling)
    const favorites = [
        { id: '1', title: 'Blue', artist: 'Billie Eilish', duration: '05:43', cover: 'https://williamdrumm.com/wp-content/uploads/2024/11/billie-eilish-album-cover.jpg' },
        { id: '2', title: 'Folklore', artist: 'Taylor Swift', duration: '00:00', cover: 'https://m.media-amazon.com/images/I/A1Q6XGXmIFL.jpg' },
        { id: '3', title: 'Harry\'s House', artist: 'Harry Styles', duration: '00:00', cover: 'https://upload.wikimedia.org/wikipedia/pt/d/d5/Harry_Styles_-_Harry%27s_House.png' },
        { id: '4', title: 'Made in AM', artist: 'One Direction', duration: '00:00', cover: 'https://cdn-images.dzcdn.net/images/cover/433ce4072595090a6b2add706416d311/0x1900-000000-80-0-0.jpg' },
        { id: '5', title: 'Nome da Música', artist: 'Artista', duration: '00:00', cover: 'https://picsum.photos/seed/song5/80' },
    ];

    // Sample playlists
    const playlists = [
        { id: 'p1', title: 'Minha Playlist', photo: 'https://picsum.photos/seed/playlist1/240' },
        { id: 'p2', title: 'Playlist 2', photo: 'https://picsum.photos/seed/playlist1/230' },
        { id: 'p3', title: 'Playlist 3', photo: 'https://picsum.photos/seed/playlist1/220' },
        { id: 'p4', title: 'Playlist 4', photo: 'https://picsum.photos/seed/playlist1/210' },
    ];

    const renderFavorite = ({ item }) => (
        <View style={styles.songRow}>
            <Image source={{ uri: item.cover }} style={styles.songCover} />
            <View style={styles.songMeta}>
                <Text style={styles.songTitle}>{item.title}</Text>
                <Text style={styles.songArtist}>{item.artist}</Text>
            </View>
            <Text style={styles.songDuration}>{item.duration}</Text>
            <TouchableOpacity style={styles.heartButton}>
                <Ionicons name="heart-outline" size={16} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    const renderPlaylist = ({ item }) => (
        <View style={styles.playlistCard}>
            {item.photo ? (
                <Image source={{ uri: item.photo }} style={styles.playlistImage} />
            ) : (
                <View style={styles.playlistPlaceholder}>
                    <Ionicons name="add" size={34} color="#333" />
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Svg style={styles.blur} pointerEvents="none" viewBox="0 0 420 420" preserveAspectRatio="xMidYMid slice">
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
                <ScrollView>
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
                        />
                    </View>

                    <View style={styles.playlistsSection}>
                        <Text style={styles.sectionTitle}>Suas playlists</Text>
                        <FlatList
                            data={playlists}
                            renderItem={renderPlaylist}
                            keyExtractor={(item) => item.id}
                        />
                        <TouchableOpacity style={styles.createPlaylistButton} onPress={() => console.log('Criar playlist')}>
                            <Ionicons name="add" size={24} color="#000000ff" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#101027',
        padding: 16,

    },
    blur: {
        position: 'absolute',
        // make the gradient a rounded blob
        width: 420,
        height: 420,
        borderRadius: 210,
        // shift it so it peeks from the top-left
        top: -100,
        left: -80,
        opacity: 0.5,
    },
    profileHeader: {
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    profileImage: {
        width: 70,
        height: 70,
        borderRadius: 100,
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
    createPlaylistButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
    },
});
