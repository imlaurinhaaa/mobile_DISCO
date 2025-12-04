import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from '@expo/vector-icons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

export default function CreatePlaylist() {

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Permissão necessária para acessar imagens.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <Svg style={styles.background} pointerEvents="none" viewBox="0 0 100 100" preserveAspectRatio="none">
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
                    <Rect x="0" y="0" width="100%" height="100%" rx="0" fill="url(#radial)" />
                </Svg>
                <ScrollView>
                    <View style={styles.container}>
                        <EvilIcons name="arrow-left" size={30} color="white" style={styles.backIcon} />
                        <Text style={styles.title}>Crie uma nova playlist!</Text>
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            {image ? (
                                <Image
                                    source={{ uri: image }}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            ) : (
                                <View style={{ alignItems: 'center' }}>
                                    <Ionicons name="musical-notes" size={64} color="#C6C6C6" />
                                    <Text style={{ color: "#C6C6C6", marginTop: 8 }}>Adicione uma capa!</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Nome da Playlist..."
                            placeholderTextColor="#ccc"
                            style={styles.inputName}
                        />
                        <TextInput
                            placeholder="Adicione uma descrição..."
                            placeholderTextColor="#ccc"
                            style={styles.inputDescription}
                        />
                        <TouchableOpacity style={styles.createButton}>
                            <Ionicons name="add" size={24} color="#000000" />
                            <Text style={styles.buttonText}>Adicionar músicas</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%'
    },
    title: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        margin: 10,
    },
    imagePicker: {
        width: 160,
        height: 160,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#353535',
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        marginTop: 50,
        backgroundColor: "#353535",
    },
    inputName: {
        flex: 1,
        color: 'white',
        paddingVertical: 12,
        textAlign: 'center',
        marginTop: 20,
    },
    inputDescription: {
        width: '80%',
        borderRadius: 5,
        height: 100,
        borderRadius: 5,
        paddingHorizontal: 10,
        color: 'white',
        marginTop: 20,
        textAlign: 'center',
        backgroundColor: '#353535',
    },
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffffff',
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 30,
    },
    buttonText: {
        color: '#000000',
        fontSize: 12,
        marginLeft: 10,
    },
    backIcon: {
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
});
