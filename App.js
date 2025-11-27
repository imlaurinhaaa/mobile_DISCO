
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreatePlaylist from './pages/CreatePlaylist';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <CreatePlaylist />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
