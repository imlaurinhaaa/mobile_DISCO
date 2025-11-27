import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

export default function Radial() {
    return (
        <Svg
            width={220}
            height={220}
            style={styles.radial}
            viewBox="0 0 220 220"
        >
            <Defs>
                <RadialGradient id="grad" cx="0%" cy="0%" r="80%">
                    <Stop offset="0%" stopColor="#231385" />
                    <Stop offset="25%" stopColor="#120A61" />
                    <Stop offset="38%" stopColor="#09054F" />
                    <Stop offset="50%" stopColor="#00003C" />
                    <Stop offset="75%" stopColor="#080832" />
                    <Stop offset="100%" stopColor="#101027" />
                </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width="220" height="220" fill="url(#grad)" />
        </Svg>
    )
}

const styles =  StyleSheet.create({
    radial: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none' //se quiser que não capture toques
    },
});