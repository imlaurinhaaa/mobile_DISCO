import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

import axios from 'axios';
import Constants from 'expo-constants';

export default function SongsDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const {apiUrl} = Constants.expoConfig.extra;
    
    const { song, apiImg } = route.params || {}; 

    const [songDetails, setSongDetails] = useState(null);

    useEffect(() => {
        if (song?.id) {
            console.log("ID da música recebida:", song.id);
            axios.get(`${apiUrl}songs/${song.id}`)
                .then((response) => {
                    console.log("Detalhes da música recebidos:", response.data);
                    setSongDetails(response.data);
                })
                .catch((error) => {
                    console.error("Erro ao buscar detalhes da música:", error);
                });
        }
    }, [song]);

    if (!song) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center', marginTop: 50, color: '#fff'}}>Nenhuma música selecionada.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems:'center', marginTop: 20}}>
                    <Text style={{color: '#8000ff'}}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name="arrow-left-circle"
                        size={40}
                        color="#fff"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{song.album_id?.title || "Álbum"}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: song.album_id?.photo_disk ? `${apiImg}${song.album_id.photo_disk}` : 'https://placehold.co/300' }} 
                        style={styles.image} 
                    />
                </View>

                <View style={styles.songHeader}>
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{song.title}</Text>
                        <Text style={styles.artist}>{song.singer_id?.name || "Artista"}</Text>
                    </View>

                    <View style={styles.interactContainer}>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="add-circle-outline" size={32} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Ionicons name="heart-outline" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={styles.progressFill} />
                    </View>
                    <Text style={styles.timeText}>{song.time || "00:00"}</Text>
                </View>

                <View style={styles.playButtonContainer}>
                    <TouchableOpacity style={styles.playButton}>
                        <Ionicons name="play" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.lyricsContainer}>
                    <Text style={styles.sectionTitle}>LETRA</Text>
                    <Text style={styles.lyricsText}>{song.lyrics || "Letra não disponível"}</Text>
                </View>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.sectionTitle}>DESCRIÇÃO</Text>
                    <Text style={styles.descriptionText}>{song.description || ""}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a2e',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '400',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
        marginRight: 40,
    },
    content: {
        paddingHorizontal: 30,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    image: {
        width: 300,
        height: 300,
        borderRadius: 16,
        backgroundColor: '#1a1a3e',
    },
    songHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#fff',
        textTransform: 'uppercase',
    },
    artist: {
        fontSize: 16,
        color: '#999',
    },
    interactContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    iconButton: {
        marginLeft: 8,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressBar: {
        width: '100%',
        height: 4,
        backgroundColor: '#1a1a3e',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressFill: {
        width: '40%',
        height: '100%',
        backgroundColor: '#8000ff',
        borderRadius: 2,
    },
    timeText: { 
        fontSize: 14, 
        color: '#999',
        textAlign: 'right',
    },
    playButtonContainer: {
        alignItems: 'center',
        marginVertical: 24,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lyricsContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#0a0a2e',
        letterSpacing: 1,
    },
    lyricsText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
    },
    descriptionContainer: {
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
    },
    descriptionText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
    },
});