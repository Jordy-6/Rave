import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { setRecordingUri, setFileName, setRecordings, setConvertedAudio } from "./Actions";

export async function startRecording(permissionResponse, requestPermission, setRecording, setIsRecording) {
    try {
        if (permissionResponse.status !== 'granted') {
            await requestPermission();
        }

        await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );

        setRecording(recording);
        setIsRecording(true);
    } catch (error) {
        console.log("L'enregistrement n'a pas fonctionné", error);
    }
}

export async function stopRecording(recording, dispatch, setRecording, setIsRecording) {
    try {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
        });
        const uri = recording.getURI();
        dispatch(setRecordingUri(uri));
        setRecording(null);
        setIsRecording(false);
    } catch (error) {
        console.log("L'arrêt de l'enregistrement n'a pas fonctionné", error);
    }
}

export async function playSound(recordingUri, setSound) {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
        });
        const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
        setSound(sound);
        await sound.playAsync();
    } catch (error) {
        console.log("La lecture n'a pas fonctionné", error);
    }
}

export async function deleteRecording(dispatch) {
    dispatch(setRecordingUri(undefined));
}

export async function saveRecording(recordingUri, fileName, recordings, dispatch) {
    if (recordingUri && fileName) {
        const audioDirectory = FileSystem.documentDirectory + 'audio/';
        const file = audioDirectory + fileName + ".m4a";

        const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
        }

        await FileSystem.moveAsync({ from: recordingUri, to: file });
        dispatch(setRecordings([...recordings, { uri: file, name: fileName }]));
        dispatch(setFileName(""));
        dispatch(setRecordingUri(undefined));
    }
}

export async function saveConvertedAudio(audioUri, fileName) {
    if ( audioUri && fileName) {
        console.log("Attempting to save converted audio:", audioUri);
    console.log("File name:", fileName);
    console.log("Audio list:", audio);
    const audioDirectory = FileSystem.documentDirectory + 'converted_audio/';
    const file = audioDirectory + fileName ;

    const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
    console.log("Directory info:", dirInfo);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(audioDirectory, { intermediates: true });
    }

    const moveResult = await FileSystem.moveAsync({ from: audioUri, to: file });
    console.log("Move result:", moveResult);
    dispatch(setConvertedAudio([...audio, { uri: file, name: fileName }]));

    }
    
}

export async function deleteConvertedAudio(uri, audio, dispatch) {
    console.log('Attempting to delete converted audio:', uri);
    const updatedAudio = audio.filter(item => item.uri !== uri);
    console.log('Updated audio list:', updatedAudio);

    dispatch(setConvertedAudio(updatedAudio));

    try {
        await FileSystem.deleteAsync(uri);
        console.log('Converted audio deleted successfully:', uri);
    } catch (error) {
        console.log('Failed to delete converted audio:', error);
    }
}

export async function loadConvertedAudio(dispatch) {
    const audioDirectory = FileSystem.documentDirectory + 'converted_audio/';
    const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
    if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(audioDirectory);
        const loadedAudio = files.map(file => ({
            uri: audioDirectory + file,
            name: file,
        }));
        dispatch(setConvertedAudio(loadedAudio));
    }
}

export async function playSavedRecording(uri, setSound) {
    try {
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
        });
        const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
        setSound(sound);
        await sound.playAsync();
    } catch (error) {
        console.log("La lecture n'a pas fonctionné", error);
    }
}

export async function deleteRecordingFromList(uri, recordings, dispatch) {
    console.log('Attempting to delete recording:', uri);
    const updatedRecordings = recordings.filter(recording => recording.uri !== uri);
    console.log('Updated recordings list:', updatedRecordings);

    dispatch(setRecordings(updatedRecordings));

    try {
        await FileSystem.deleteAsync(uri);
        console.log('Recording deleted successfully:', uri);
    } catch (error) {
        console.log('Failed to delete recording:', error);
    }
}

export async function loadRecordings(dispatch) {
    const audioDirectory = FileSystem.documentDirectory + 'audio/';
    const dirInfo = await FileSystem.getInfoAsync(audioDirectory);
    if (dirInfo.exists) {
        const files = await FileSystem.readDirectoryAsync(audioDirectory);
        const loadedRecordings = files.map(file => ({
            uri: audioDirectory + file,
            name: file,
        }));
        dispatch(setRecordings(loadedRecordings));
    }
}
