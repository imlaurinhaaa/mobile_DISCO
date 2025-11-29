import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function AlbumCard({ albumName, artistName, isLiked, onLikeToggle }) {
    const [likedAlbums, setLikedAlbums] = useState({});
    const toggleAlbumLike = (i) => {
        setLikedAlbums(prev => ({ ...prev, [i]: !prev[i] }));
    };
    return (

        <View style={styles.card}>
            <View style={styles.textArea}>
                <Text style={{ color: 'white', fontSize: 18 }}>Nome do Álbum</Text>
                <Text style={{ color: 'white' }}>Nome da Cantora</Text>
                <View style={styles.icons}>
                    <Ionicons name="play-circle-sharp" size={24} color="#09054F" />
                    <TouchableOpacity onPress={() => toggleAlbumLike(0)}>
                        <FontAwesome name={likedAlbums[0] ? 'heart' : 'heart-o'} size={20} color={likedAlbums[0] ? 'red' : 'white'} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.imageArea}>
                <Image 
                    source={require("../assets/img/artists.png")}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#224899',
        width: 320,
        height: 130,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginRight: 12,
        gap: 10,
    },
    textArea: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    icons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
});