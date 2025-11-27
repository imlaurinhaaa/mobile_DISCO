import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; // Adicionado MaterialCommunityIcons
import { useNavigation, useRoute } from '@react-navigation/native';

import axios from 'axios';
import Constants from 'expo-constants';

export default function SongsDetails() {
    const route = useRoute();
    const navigation = useNavigation();
    const {apiUrl} = Constants.expoConfig.extra;
    
    // Verificação de segurança: Se não houver params, define valores padrão ou retorna null
    const { song, apiImg } = route.params || {}; 

    const [songDetails, setSongDetails] = useState(null); // Estado para detalhes adicionais se necessário

    useEffect(() => {
        if (song?.id) {
            console.log("ID da música recebida:", song.id);
            a    
                .then((response) => {
                    console.log("Detalhes da música recebidos:", response.data);
                    setSongDetails(response.data);
                })
                .catch((error) => {
                    console.error("Erro ao buscar detalhes da música:", error);
                });
        }
    }, [song]);

    // Se não tiver música carregada, mostra loading ou volta
    if (!song) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center', marginTop: 50}}>Nenhuma música selecionada.</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems:'center', marginTop: 20}}>
                    <Text style={{color: 'blue'}}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* ...existing code... */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialCommunityIcons
                        name="arrow-left-circle"
                        size={36}
                        color="#8000ff"
                    />
                </TouchableOpacity>
                {/* Verificação segura para album_id */}
                <Text style={styles.headerTitle}>{song.album_id?.title || "Detalhes"}</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.imageContainer}>
                {/* Verificação segura para imagem */}
                <Image 
                    source={{ uri: song.album_id?.photo_disk ? `${apiImg}${song.album_id.photo_disk}` : 'https://placehold.co/200' }} 
                    style={styles.image} 
                />
                </View>

                <View style={styles.songHeader}>
                <View style={styles.infoContainer}>
                    <Text style={styles.title}>{song.title}</Text>
                    <Text style={styles.artist}>Artista: {song.singer_id?.name || "Desconhecido"}</Text>
                </View>

                <View style={styles.interactContainer}>
                    <TouchableOpacity style={styles.likeButton}>
                        <Ionicons name="heart-outline" size={28} color="#8000ff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle-outline" size={28} color="#8000ff" />
                    </TouchableOpacity>
                </View>
                </View>

                <View style={styles.timeContainer}>
                <View style={styles.line} />
                <Text style={styles.timeText}>{song.time}</Text>
                </View>

                <View style={styles.lyricsContainer}>
                <Text style={styles.lyricsTitle}>Letra</Text>
                <Text style={styles.lyricsText}>{song.lyrics}</Text>
                </View>

                <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Descrição</Text>
                <Text style={styles.descriptionText}>{song.description}</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8000ff',
    },
    content: {
        padding: 16,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    songHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    artist: {
        fontSize: 16,
        color: '#666',
    },
    interactContainer: {
        flexDirection: 'row',
    },
    likeButton: {
        marginRight: 16,
    },
    addButton: {},
    timeContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    line: {
        width: '100%',
        height: 1,
        backgroundColor: '#ddd',
        marginBottom: 8,
    },
    timeText: { 
        fontSize: 14, 
        color: '#666', 
        marginBottom: 8
    },
    waveform: {
        width: '100%',
        height: 50,
        resizeMode: 'contain',
    },
    lyricsContainer: {
        marginBottom: 16,
    },
    lyricsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    lyricsText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
    descriptionContainer: {
        marginBottom: 16,
    },
    descriptionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    descriptionText: {
        fontSize: 16,
        color: '#666',
        lineHeight: 22,
    },
});