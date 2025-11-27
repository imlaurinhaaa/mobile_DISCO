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
    Dimensions,
    TouchableWithoutFeedback,
    StatusBar
} from "react-native";
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import AntDesign from '@expo/vector-icons/AntDesign';

import SongCard from "../components/SongCard";

export default function Playlist() {
    const [modalVisible, setModalVisible] = useState(false);
    const translateY = useRef(new Animated.Value(0)).current;
    const { height } = Dimensions.get('window');

    const closeModal = () => {
        setModalVisible(false);
        translateY.setValue(0);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                return Math.abs(gestureState.dy) > 5 && gestureState.dy > 0;
            },
            onPanResponderGrant: () => {
                translateY.stopAnimation();
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
                        closeModal();
                    });
                } else {
                    Animated.spring(translateY, {
                        toValue: 0,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    return (
        <>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent={true}
            />
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
                        <View style={styles.songsSection}>
                            <SongCard id={1} title="Song Title 1" duration="3:45" artist="Artist 1" />
                            <SongCard id={2} title="Song Title 2" duration="4:20" artist="Artist 2" />
                            <SongCard id={3} title="Song Title 3" duration="2:58" artist="Artist 3" />
                            <SongCard id={4} title="Song Title 4" duration="5:10" artist="Artist 4" />
                            <SongCard id={5} title="Song Title 5" duration="3:33" artist="Artist 5" />
                        </View>
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalOverlay}>
                            <TouchableWithoutFeedback onPress={() => { }}>
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
                                        <Image source={require('../assets/playlistImage.png')} style={styles.modalAlbumCover} />
                                        <View style={styles.modalTopSection}>
                                            <Text style={styles.modalTitle}>Sua Playlist</Text>
                                            <Text style={styles.modalSubtitle}>de User</Text>
                                        </View>
                                    </View>
                                    <View style={styles.divider} />
                                    <View style={styles.modalBody}>
                                        <TouchableOpacity style={styles.optionCard}>
                                            <AntDesign name="menu" size={24} color="#E0E0E0" />
                                            <Text style={styles.modalText}>
                                                Editar Playlist
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.optionCard}>
                                            <AntDesign name="close-circle" size={24} color="#E0E0E0" />
                                            <Text style={styles.modalText}>
                                                Apagar Playlist
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </ImageBackground>
        </>
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
        paddingTop: StatusBar.currentHeight || 40,
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
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 30,
        backgroundColor: '#D9D9D9',
        borderWidth: 1,
        borderColor: 'white',
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
        backgroundColor: '#0f0f0fff',
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
        marginBottom: 10,
    },
    dragBar: {
        width: 40,
        height: 4,
        backgroundColor: '#C0C0C0',
        borderRadius: 2,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    modalAlbumCover: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    modalTopSection: {
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#001F7D',
    },
    modalSubtitle: {
        fontSize: 16,
        color: '#C0C0C0',
        fontWeight: '500',
    },
    divider: {
        height: 2,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 25,
    },
    modalBody: {
        flex: 1,
        marginBottom: 20,
    },
    optionCard: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 15,
        gap: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#E0E0E0',
        lineHeight: 24,
    },
});