import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import WheelPickerExpo from "react-native-wheel-picker-expo";
import { Button } from "react-native";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import Icon from 'react-native-vector-icons/FontAwesome';

import { playSavedRecording, saveConvertedAudio } from "./AudiosActions";

export default function Convert() {
    const [models, setModels] = useState([]);
    const dispatch = useDispatch();
    const ip = useSelector((state) => state.ip);
    const port = useSelector((state) => state.port);
    const [chosenModel, setChosenModel] = useState("");
    const chosenRecording = useSelector((state) => state.chosenRecording);
    const [soundFile, setSoundFile] = useState(null);
    const [soundObject, setSoundObject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const convertedAudio = useSelector((state) => state.convertedAudio);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch(`http://${ip}:${port}/getmodels`);
                if (response.ok) {
                    const modelsData = await response.json();
                    setModels(modelsData.models.map((model) => ({ label: model, value: model })));
                } else {
                    console.error('Network response was not ok:', response.statusText);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchModels();
    }, [ip, port]);

    useEffect(() => {
        return soundObject ? () => { soundObject.unloadAsync(); } : undefined;
    }, [soundObject]);

    async function convertAudio() {
        if (chosenRecording.name.split('.').pop() !== 'm4a') {
            console.log('This file format is not supported.');
            return;
        }
    
        try {
            const response = await fetch(`http://${ip}:${port}/selectModel/${chosenModel}`);
            if (response.ok) {
                
            } else {
                console.error('Network response was not ok:', response.statusText);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    
        let uri = chosenRecording.uri;
    
        try {
            setIsLoading(true);
            const resp = await FileSystem.uploadAsync(`http://${ip}:${port}/upload`, uri, {
                fieldName: 'file',
                httpMethod: 'POST',
                uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                headers: { filename: uri }
            });
            setIsLoading(false);
    
        } catch (error) {
            console.error('File system error:', error);
            setIsLoading(false);
        }

        try {
            let directory = FileSystem.documentDirectory + 'converted_audio/';
            const dirInfo = await FileSystem.getInfoAsync(directory);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
            }

            const convertedFileName = chosenRecording.name.replace('.m4a', '.wav');
            await FileSystem.downloadAsync(`http://${ip}:${port}/download`, directory + convertedFileName);

            const fileInfo = await FileSystem.getInfoAsync(directory + convertedFileName);
            if (!fileInfo.exists || fileInfo.size === 0) {
                console.log("Downloaded file is missing or empty.");
                return;
            }
            setSoundFile(fileInfo);
            console.log("SoundFile: ", fileInfo);
            await saveConvertedAudio(fileInfo.uri, convertedFileName, convertedAudio, dispatch);
        } catch (error) {
            console.error('Error during conversion:', error);
        }
    }

    const playConvertedSound = async () => {
        if (soundFile && soundFile.uri) {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true,
                });
                const { sound } = await Audio.Sound.createAsync({ uri: soundFile.uri }, { shouldPlay: true });
                setSoundObject(sound);
                await sound.playAsync();
            } catch (error) {
                console.error("Error playing sound:", error);
            }
        } else {
            console.log("No sound loaded");
        }
    };

    return (
        
        <View style={styles.container}>
            {isLoading ? (<ActivityIndicator size="large" color="#0000ff" />) :(
                <View style={styles.container}>
                    <WheelPickerExpo
                items={models}
                onChange={({ item }) => setChosenModel(item.value)}
                selectedItem={chosenModel}
                selectedStyle={{ fontSize: 20, color: 'red' }}
                style={{ width: 200, height: 200 }}
            />
            <Text style={styles.selectedModelText}>Modèle choisi: {chosenModel}</Text>

            <Pressable style={styles.convertButton} onPress={convertAudio}>
                <Text style={styles.convertButtonText}>Convertir</Text>
            </Pressable>

            <View style={styles.recordingItem}>
                <Text>{chosenRecording ? chosenRecording.name : ''}</Text>
                <Icon 
                    name="play"
                    size={40}
                    color="green"
                    onPress={() => playSavedRecording(chosenRecording.uri, setSoundObject)}
                />
            </View>

            <View style={styles.recordingItem}>
                <Text>{soundFile ? soundFile.uri.split('/').pop() : ''}</Text>
                <Icon
                    name="play"
                    size={40}
                    color="green"
                    onPress={playConvertedSound}
                />
            </View>

        </View>
            )}
            

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    
    convertButton: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    convertButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    selectedModelText: {
        fontSize: 18,
        marginVertical: 10,
    },
    recordingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    playButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
    },
    playButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
