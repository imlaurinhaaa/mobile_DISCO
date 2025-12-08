import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer, StackRouter } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomeScreen from './pages/Home';
import Album from './pages/Album';
import SongsDetails from './pages/SongsDetails';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Singer from './pages/Singer';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Singer" component={Singer} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="SongsDetails" component={SongsDetails} />
        <Stack.Screen name="Album" component={Album} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="SignIn" component={SignIn} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});