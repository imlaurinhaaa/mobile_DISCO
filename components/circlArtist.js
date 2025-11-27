import { View, Image, StyleSheet } from 'react-native';

export default function CirclArtist() {
    return (
        <View style={styles.circle}>
            <Image
                source={require('../assets/img/artist.png')}
                style={{ 
                    width: 100,
                    height: 100,
                    borderRadius: 50
                }}
                resizeMode="cover"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#948DD0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
})