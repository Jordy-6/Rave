import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Convert from '../components/Convert';
import Audios from '../components/Audios';
import ConvertedAudio from '../components/ConvertedAudio';


export default function Rave() {

    const Tab = createBottomTabNavigator();

    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator>
                <Tab.Screen name="Audios" component={Audios} />
                <Tab.Screen name="Convert" component={Convert} />
                <Tab.Screen name="ConvertedAudio" component={ConvertedAudio} />
            </Tab.Navigator>
        </NavigationContainer>
    );
    
}