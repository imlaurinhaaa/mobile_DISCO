import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import Home from "../pages/Home.js";
import Profile from "../pages/Profile.js";
import Search from "../pages/Search.js";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,

                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 90,
                    paddingTop: 10,
                    borderTopLeftRadius: 35,
                    borderTopRightRadius: 35,
                    backgroundColor: "transparent", // necessário p/ mostrar o degradê
                    borderTopWidth: 0,
                    overflow: "hidden",
                    elevation: 0,
                },

                tabBarBackground: () => (
                    <LinearGradient
                        colors={["#0A0835", "#240F7E"]}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                            flex: 1,
                            borderTopLeftRadius: 35,
                            borderTopRightRadius: 35,
                        }}
                    />
                ),
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Octicons
                            name="home"
                            size={26}
                            color={focused ? "#FFFFFF" : "#C0C0C0"}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Octicons
                            name="search"
                            size={26}
                            color={focused ? "#FFFFFF" : "#C0C0C0"}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome6
                            name="user"
                            size={26}
                            color={focused ? "#FFFFFF" : "#C0C0C0"}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}
