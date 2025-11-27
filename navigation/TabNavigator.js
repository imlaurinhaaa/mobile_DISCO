import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Octicons from '@expo/vector-icons/Octicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import Home from "../pages/Home.js";
import Profile from "../pages/Profile.js";

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
                    height: 80,
                    paddingTop: 15,
                    paddingHorizontal: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    backgroundColor: '#1C1C1C',
                    borderTopWidth: 0,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Octicons
                            name="home"
                            size={24}
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
                            size={24}
                            color={focused ? "#FFFFFF" : "#C0C0C0"}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}