import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import CirclArtist from '../components/circlArtist';
import AlbumCard from '../components/albumCard';
import Radial from '../components/radial';

export default function Home() {
    const [likedRecommended, setLikedRecommended] = useState({});

    const toggleRecommendedLike = (i) => {
        setLikedRecommended(prev => ({ ...prev, [i]: !prev[i] }));
    };

    const recommended = new Array(6).fill(null);

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
                        <AlbumCard />
                        <AlbumCard />
                        <AlbumCard />
                        <AlbumCard />
                        <AlbumCard />
                        <AlbumCard />
                    </ScrollView>
                </View>
                <View style={styles.horizontalCards}>
                    <Text style={styles.sectionTitle}>Artistas em Destaque</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
                        <CirclArtist />
                        <CirclArtist />
                        <CirclArtist />
                        <CirclArtist />
                        <CirclArtist />
                        <CirclArtist />
                        <CirclArtist />
                    </ScrollView>
                </View>
                <View style={styles.verticalCards}>
                    <Text style={styles.sectionTitle}>Recomendados para você</Text>
                    {recommended.map((_, i) => (
                        <View key={i} style={styles.musicCard}>
                            <View style={styles.recommendedThumb} />
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={{ color: '#fff', fontSize: 13 }}>Nome da Música</Text>
                                <Text style={{ color: '#CACACA', fontSize: 10 }}>00:00</Text>
                                <Text style={{ color: '#CACACA', fontSize: 10 }}>Nome do Cantor</Text>
                            </View>
                            <View style={{ marginLeft: 'auto', marginRight: 10 }}>
                                <TouchableOpacity onPress={() => toggleRecommendedLike(i)}>
                                    <FontAwesome name={likedRecommended[i] ? 'heart' : 'heart-o'} size={24} color={likedRecommended[i] ? 'red' : 'white'} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
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
        paddingHorizontal: 20,
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