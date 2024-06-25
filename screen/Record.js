import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Pressable, StyleSheet, Text, View, FlatList } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Audio } from "expo-av";
import { setRecordingUri, setFileName, setRecordings } from "../components/Actions";
import {
    startRecording,
    stopRecording,
    playSound,
    deleteRecording,
    saveRecording,
    playSavedRecording,
    deleteRecordingFromList,
    loadRecordings
} from "../components/AudiosActions";

export default function Record() {
    const dispatch = useDispatch();
    const recordingUri = useSelector((state) => state.recordingUri);
    const recordings = useSelector((state) => state.recordings);
    const fileName = useSelector((state) => state.fileName);
    const [permissionResponse, requestPermission] = Audio.usePermissions();
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [sound, setSound] = useState(null);

    useEffect(() => {
        loadRecordings(dispatch);
    }, []);

    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

    return (
        <View style={styles.container}>
            <Pressable
                onPressIn={isRecording ? () => stopRecording(recording, dispatch, setRecording, setIsRecording) : () => startRecording(permissionResponse, requestPermission, setRecording, setIsRecording)}
                style={styles.record}
            >
                <Text style={styles.text}>{isRecording ? "Stop recording" : "Start recording"}</Text>
            </Pressable>
            <View style={styles.buttonContainer}>
                <Icon
                    name="play"
                    size={80}
                    color="green"
                    onPress={() => playSound(recordingUri, setSound)}
                />
                <Icon
                    name="remove"
                    size={80}
                    color="red"
                    onPress={() => deleteRecording(dispatch)}
                />
            </View>
            <View style={styles.saveContainer}>
                <TextInput
                    placeholder="Nom du fichier audio"
                    onChangeText={(value) => dispatch(setFileName(value))}
                    value={fileName}
                    style={styles.input}
                />
                <Pressable
                    onPress={() => saveRecording(recordingUri, fileName, recordings, dispatch)}
                    style={styles.save}
                >
                    <Text style={styles.text}>Enregistrer</Text>
                </Pressable>
            </View>
            <FlatList
                data={recordings}
                keyExtractor={(item) => item.uri}
                renderItem={({ item }) => (
                    item ? (
                        <View style={styles.recordingItem}>
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
                        </View>
                    ) : null
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f0f0f0',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
    },
    record: {
        backgroundColor: 'blue',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    save: {
        backgroundColor: 'green',
        padding: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    saveContainer: {
        marginVertical: 20,
    },
    recordingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 5,
    },
});
