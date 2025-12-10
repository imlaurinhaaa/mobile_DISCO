import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function AlbumCard({
    title,
    artist,
    image,
    photo_cover,
    color = "#224899",
    onPress,
    liked = false,
    onLikePress,
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, { backgroundColor: color }]}
        >
            <View style={styles.contentWrapper}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.artist}>{artist}</Text>

                <View style={styles.controlsContainer}>
                    <Ionicons name="play-circle-sharp" size={24} color="#ffffffff" />

                    <TouchableOpacity onPress={onLikePress}>
                        <FontAwesome
                            name={liked ? "heart" : "heart-o"}
                            size={20}
                            color={liked ? "red" : "white"}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.imageWrapper}>
                <Image
                    source={(photo_cover || image) ? { uri: photo_cover || image } : require("../assets/img/logo.png")}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 320,
        height: 130,
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-between",
        flexDirection: "row",
        marginRight: 12,
        gap: 10,
    },
    contentWrapper: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
    },
    title: {
        color: "white",
        fontSize: 18,
        fontWeight: "500",
    },
    artist: {
        color: "white",
        opacity: 0.8,
    },
    controlsContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 15,
        alignItems: "center",
    },
    imageWrapper: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
});
