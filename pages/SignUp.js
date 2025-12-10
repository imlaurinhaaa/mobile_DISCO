import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image, 
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    Dimensions
} from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// URL do backend
const BASE_URL = 'http://192.168.1.20:4000';

export default function SignUp({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fontsLoaded, setFontsLoaded] = useState(false);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Montserrat-MediumItalic': require('../assets/fonts/Montserrat-MediumItalic.ttf'),
                    'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
                    'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
                    'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
                    'Montserrat-Black': require('../assets/fonts/Montserrat-Black.ttf'),
                    'EmblemaOne-Regular': require('../assets/fonts/EmblemaOne-Regular.ttf'),
                    'Montserrat-SemiBoldItalic': require('../assets/fonts/Montserrat-SemiBoldItalic.ttf'),
                });
            } catch (error) {
                console.log('Erro ao carregar fontes:', error);
            } finally {
                setFontsLoaded(true);
            }
        }
        loadFonts();
    }, []);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Erro', 'Preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/users/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, photo: null })
            });

            const data = await response.json();

            if (!response.ok) {
                Alert.alert('Erro', data.error || 'Erro ao registrar usuário.');
                return;
            }

            Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
            navigation.navigate('Home');
        } catch (error) {
            console.log('Erro ao registrar usuário:', error);
            Alert.alert('Erro', 'Falha na conexão com o servidor.');
        }
    };

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/img/fundoPage.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <KeyboardAvoidingView
                    style={styles.keyboardView}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <Image source={require('../assets/img/logo.png')} style={styles.logo} />
                    <View style={styles.contentContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="rgba(0,0,0,0.6)"
                            value={name}
                            onChangeText={setName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            placeholderTextColor="rgba(0,0,0,0.6)"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={{ flex: 1, color: '#4a4a4a', paddingHorizontal: 8 }}
                                placeholder="Senha"
                                placeholderTextColor="rgba(0,0,0,0.6)"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.validationIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye' : 'eye-off'}
                                    size={20}
                                    color="#4a4a4a"
                                />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.orText}>Ou</Text>

                        <View style={styles.orRow}>
                            <View style={styles.orLineWrap}>
                                <View style={styles.line} />
                                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                    <Text style={styles.linkText}>Já possui uma conta? <Text style={{ fontWeight: 'bold' }}>Entre</Text></Text>
                                </TouchableOpacity>
                                <View style={styles.line} />
                            </View>
                        </View>

                        <View style={styles.socialRow}>
                            <TouchableOpacity style={styles.socialBtn}>
                                <FontAwesome name="google" size={18} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialBtn}>
                                <FontAwesome name="facebook" size={18} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialBtn}>
                                <FontAwesome name="apple" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity onPress={handleRegister} style={styles.button}>
                        <LinearGradient
                            colors={['#19043cff', '#310f87ff', '#19043cff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <Text style={styles.buttonText}>Cadastrar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    backgroundImage: {
        flex: 1
    },

    keyboardView: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 28,
    },

    logo: {
        width: screenWidth * 0.8,
        height: screenHeight * 0.3,
        resizeMode: 'contain',
        position: 'absolute',
        top: 60,
        left: '10%',
    },

    contentContainer: {
        alignItems: 'center',
        marginTop: 290,
    },

    input: {
        width: '86%',
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.64)',
        color: '#4a4a4a',
        borderRadius: 24,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 0,
        fontSize: 15,
        borderColor: 'transparent',
    },

    inputContainer: {
        width: '86%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.64)',
        borderRadius: 24,
        paddingRight: 12,
        paddingLeft: 8,
        height: 48,
    },

    validationIcon: {
        padding: 6,
    },

    linkText: {
        color: '#ffffffff',
        fontSize: 14,
        fontWeight: '500',
        margin: 12,
    },

    orRow: {
        width: '80%',
        alignItems: 'center',
        marginVertical: 9,
    },

    orLineWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.12)'
    },

    orText: {
        marginHorizontal: 8,
        color: 'rgba(255, 255, 255, 1)',
        fontSize: 16,
        marginTop: 20,
        fontWeight: '500',
    },

    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 14,
        marginTop: 8,
    },

    socialBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        alignItems: 'center',
        marginTop: 35,
    },

    gradientButton: {
        width: '86%',
        paddingVertical: 14,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: Platform.OS === 'ios' ? 24 : 18,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
