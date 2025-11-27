import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Alert,
    ImageBackground,
    KeyboardAvoidingView,
    TouchableOpacity,
    Platform,
    Dimensions,
} from 'react-native';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SignIn({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [name, setName] = useState('');

    const handleNameChange = (text) => setName(text);

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
                setFontsLoaded(true);
            } catch (error) {
                console.log('Erro ao carregar fontes:', error);
                setFontsLoaded(true);
            }
        }
        loadFonts();
    }, []);

    const handleEmailChange = (text) => setEmail(text);
    const handlePasswordChange = (text) => setPassword(text);
    const [showPassword, setShowPassword] = useState(false);

    const isEmailValid = (emailToTest) => /\S+@\S+\.\S+/.test(emailToTest);

    const handleLogin = () => {
        if (!isEmailValid(email) || email.length === 0 || password.length === 0) {
            Alert.alert('Erro', 'Por favor, insira um e-mail e senha válidos.');
            return;
        }
        console.log('Entrando com', email);

        try {
            navigation.navigate('Home');
        } catch (error) {
            console.log('Erro na navegação para Home:', error);
        }
    };

    const handleBackPress = () => {
        try {
            navigation.navigate('Home');
        } catch (error) {
            console.log('Erro na navegação para a tela inicial:', error);
            if (navigation && navigation.goBack) navigation.goBack();
        }
    };

    const handleSignInPress = () => {
        try {
            navigation.navigate('SignIn');
        } catch (error) {
            console.log('Erro na navegação para a tela de login:', error);
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
            <ImageBackground source={require('../assets/img/fundoPage.png')} style={styles.backgroundImage} resizeMode="cover">
                <KeyboardAvoidingView style={styles.keyboardView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>

                    <View style={styles.contentContainer} importantForAutofill="noExcludeDescendants">

                        <TextInput
                            style={styles.input}
                            placeholder="Nome"
                            placeholderTextColor="rgba(0,0,0,0.6)"
                            value={name}
                            onChangeText={handleNameChange}
                            autoCapitalize="none"
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            selectionColor="#4a4a4a"
                            importantForAutofill="no"
                            autoComplete="off"
                            outlineColor="transparent"
                            activeOutlineColor="transparent"
                            mode="flat"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            placeholderTextColor="rgba(0,0,0,0.6)"
                            value={email}
                            onChangeText={handleEmailChange}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            underlineColorAndroid="transparent"
                            selectionColor="#4a4a4a"
                            importantForAutofill="no"
                            autoComplete="off"
                            outlineColor="transparent"
                            activeOutlineColor="transparent"
                            mode="flat"
                        />

                        <View style={styles.inputContainer} importantForAutofill="noExcludeDescendants">

                            <TextInput
                                style={{ flex: 1, color: '#4a4a4a', paddingHorizontal: 8 }}
                                placeholder="Senha"
                                placeholderTextColor="rgba(0,0,0,0.6)"
                                placeholderFontSize={15}
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={handlePasswordChange}
                                autoCapitalize="none"
                                underlineColorAndroid="transparent"
                                selectionColor="#4a4a4a"
                                importantForAutofill="no"
                                autoComplete="off"
                                autoCorrect={false}
                                outlineColor="transparent"
                                activeOutlineColor="transparent"
                                mode="flat"
                            />

                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.validationIcon}>
                                <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="#4a4a4a" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.orText}>or</Text>

                        <View style={styles.orRow}>
                            <View style={styles.orLineWrap}>
                                <View style={styles.line} />
                                <TouchableOpacity style={styles.link} onPress={handleSignInPress}>
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
                    <TouchableOpacity onPress={handleLogin} style={styles.button}>
                        <LinearGradient
                            colors={['#19043cff', '#310f87ff', '#19043cff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientButton}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0)']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.buttonSheen}
                            />

                            <Text style={styles.buttonText}>Entrar</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    backgroundImage: { flex: 1 },
    keyboardView: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 28,
    },

    contentContainer: {
        alignItems: 'center',
        marginTop: 310,
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

    link: {
        alignItems: 'center',
        margin: 10,
    },

    linkText: {
        color: '#ffffffff',
        fontSize: 14,

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
