import React, { useState, useRef } from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Modal,
    PanResponder,
    Animated,
    Dimensions
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import SongCard from "../components/SongCard";

export default function Playlist() {
    const [modalVisible, setModalVisible] = useState(false);
    const translateY = useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > 5;
            },
            onPanResponderMove: (evt, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    Animated.timing(translateY, {
                        toValue: height,
                        duration: 300,
                        useNativeDriver: true,
                    }).start(() => {
                        setModalVisible(false);
                        translateY.setValue(0);
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <ImageBackground source={require("../assets/background.png")} style={styles.background}>
            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.topSection}>
                    <TouchableOpacity style={styles.backButton}>
                        <Feather name="arrow-left-circle" size={30} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.albumCoverSection}>
                    <Image source={require('../assets/playlistImage.png')} style={styles.albumCover} />
                </View>
                <View style={styles.middleSection}>
                    <View style={styles.leftSection}>
                        <Text style={styles.playlistName}>
                            Sua Playlist
                        </Text>
                        <TouchableOpacity 
                            style={styles.descriptionButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Text style={styles.text}>Descrição</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rightSection}>
                        <FontAwesome6 name="play-circle" size={50} color="white" />
                    </View>
                </View>
                <View style={styles.songsSection}>
                    <SongCard title="Song Title 1" duration="3:45" artist="Artist 1" />
                    <SongCard title="Song Title 2" duration="4:20" artist="Artist 2" />
                    <SongCard title="Song Title 3" duration="2:58" artist="Artist 3" />
                    <SongCard title="Song Title 4" duration="5:10" artist="Artist 4" />
                    <SongCard title="Song Title 5" duration="3:33" artist="Artist 5" />
                </View>
            </ScrollView>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View 
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ translateY }],
                            },
                        ]}
                    >
                        <View 
                            style={styles.dragHandle}
                            {...panResponder.panHandlers}
                        >
                            <View style={styles.dragBar} />
                        </View>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Descrição da Playlist</Text>
                        </View>
                        <View style={styles.modalBody}>
                            <Text style={styles.modalText}>
                                Esta é sua playlist personalizada com suas músicas favoritas. 
                                Aqui você pode encontrar uma seleção cuidadosa de faixas que 
                                combinam com seu gosto musical.
                            </Text>
                            <Text style={styles.modalText}>
                                Criada em: November 27, 2024
                            </Text>
                            <Text style={styles.modalText}>
                                Total de músicas: 5
                            </Text>
                        </View>
                    </Animated.View>
                </View>
            </Modal>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        flexGrow: 1,
    },
    topSection: {
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
    },
    albumCoverSection: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    albumCover: {
        width: 250,
        height: 250,
    },
    middleSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 50,
    },
    leftSection: {
        flexDirection: 'column',
    },
    playlistName: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    descriptionButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 25,
        backgroundColor: '#D9D9D9',
        borderWidth: 1,
        borderColor: 'white',
        borderStyle: 'solid',
        borderRadius: 20,
    },
    text: {
        color: '#001F7D',
        fontSize: 14,
        fontWeight: 'bold',
    },
    rightSection: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    songsSection: {
        paddingBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        width: '100%',
        height: 400,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    dragHandle: {
        width: '100%',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
    },
    dragBar: {
        width: 40,
        height: 4,
        backgroundColor: '#C0C0C0',
        borderRadius: 2,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#001F7D',
    },
    modalBody: {
        flex: 1,
        marginBottom: 20,
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 15,
    },
});