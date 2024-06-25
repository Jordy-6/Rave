import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { playSavedRecording, deleteConvertedAudio, loadConvertedAudio } from './AudiosActions';


export default function ConvertedAudio() {

    const dispatch = useDispatch();
    const convertedAudio = useSelector((state) => state.convertedAudio);
    const [sound, setSound] = useState(null);
   
    useEffect(() => {
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }
    , [sound]);

    useEffect(() => {
        loadConvertedAudio(dispatch);
    }, []);

    useEffect(() => {
    }, [convertedAudio]);


    return (
        <View style={styles.container}>
            <Text style={styles.text}>Converted audio</Text>
            <FlatList
                data={convertedAudio}
                keyExtractor={(item) => item.uri}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemText}>{item.name}</Text>
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
                            onPress={() => deleteConvertedAudio(item.uri, convertedAudio, dispatch)}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 5,
    },
    itemText: {
        fontSize: 18,
        flex: 1,
        margin: 5,
    },
};

