import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

import { playSavedRecording, deleteRecordingFromList, loadRecordings } from "./AudiosActions";
import { setChosenRecording } from "./Actions";

export default function Audios() {
    const dispatch = useDispatch();
    const recordings = useSelector((state) => state.recordings);
    const [sound, setSound] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const chosenRecording = useSelector((state) => state.chosenRecording);

    useEffect(() => {
        loadRecordings(dispatch);
    }, []);

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    useEffect(() => {
        console.log('chosenRecording state updated:', chosenRecording); // Log du composant
    }, [chosenRecording]);

    async function importAudio() {
        try {
            const file = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
            console.log('File selected:', file);
            if (file.assets[0].mimeType.includes('audio')) {
                const audioDirectory = FileSystem.documentDirectory + 'imported_audio/';
                const fileName = file.assets[0].name;
                const newFile = audioDirectory + fileName;

                const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
                if (!dirInfo.exists) {
                    await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
                }

                await FileSystem.moveAsync({ from: file.assets[0].uri, to: newFile });
                setSelectedFile(newFile);
            }
        } catch (error) {
            console.log("L'import du fichier audio n'a pas fonctionné", error);
        }
    }

    async function playSoundImported() {
        try {
            const fileExtension = selectedFile.split('.').pop();
            
            if (!['mp3', 'wav', 'aac', 'm4a'].includes(fileExtension)) {
                console.log('This file format is not supported.');
                return;
            }

            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
            });
            const { sound } = await Audio.Sound.createAsync({ uri: selectedFile });
            setSound(sound);
            await sound.playAsync();
        } catch (error) {
            console.log("La lecture n'a pas fonctionné", error);
        }
    }

    async function deleteSoundImported() {
        try {
            await FileSystem.deleteAsync(selectedFile);
            setSelectedFile(null);
            await sound.unloadAsync();
        } catch (error) {
            console.log("La suppression n'a pas fonctionné", error);
        }
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={recordings}
                keyExtractor={(item) => item.uri}
                renderItem={({ item }) => (
                    item ? (
                        <Pressable style={styles.recordingItem} onPress={() => dispatch(setChosenRecording(item))}>
                            <Text>{item.name}</Text>
                            <Icon
                                name="play"
                                size={40}
                                color="green"
                                onPress={() => playSavedRecording(item.uri, setSound)}
                            />
                            <Icon
                                name="remove"
                                size={40}
                                color="red"
                                onPress={() => deleteRecordingFromList(item.uri, recordings, dispatch)}
                            />
                        </Pressable>
                    ) : null
                )}
            />

            <Pressable style={styles.importButton} onPress={importAudio}>
                <Text style={styles.importButtonText}>Importer un fichier audio</Text>
            </Pressable>
            {selectedFile && (
                <View style={styles.recordingItem} onPress={() => dispatch(setChosenRecording(selectedFile.assets[0]))}>
                    <Text style={styles.selectedFileText}>{selectedFile.split('/').pop()}</Text>
                    <Icon
                        name="play"
                        size={40}
                        color="green"
                        onPress={playSoundImported}
                    />
                    <Icon
                        name="remove"
                        size={40}
                        color="red"
                        onPress={deleteSoundImported}
                    />
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
    importButton: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    importButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
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
    selectedFileText: {
        color: 'black',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});
