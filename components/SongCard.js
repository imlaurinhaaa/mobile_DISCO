import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SongCard({ id, title, duration, artist }) {
    const [likedSongs, setLikedSongs] = useState({});

    const toggleLike = (songId) => {
        setLikedSongs((prev) => ({
            ...prev,
            [songId]: !prev[songId],
        }));
    };

    return (
        <View style={styles.songCard}>
            <Image source={require('../assets/background.png')} style={styles.songImage} />
            <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{title}</Text>
                <Text style={styles.songDuration}>{duration}</Text>
                <Text style={styles.songArtist}>{artist}</Text>
            </View>
            <View style={styles.songOptions}>
                <TouchableOpacity onPress={() => toggleLike(id)}>
                    <FontAwesome
                        name={likedSongs[id] ? 'heart' : 'heart-o'}
                        size={24}
                        color={likedSongs[id] ? 'red' : 'white'}
                    />
                </TouchableOpacity>
                <TouchableOpacity>
                    <Feather name="more-vertical" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    songCard: {
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d9d9d9d2',
        padding: 10,
        borderRadius: 15,
    },
    songImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    songInfo: {
        flex: 1,
        marginLeft: 10,
    },
    songTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    songDuration: {
        color: 'white',
        fontSize: 14,
    },
    songArtist: {
        color: 'white',
        fontSize: 14,
    },
    songOptions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
});