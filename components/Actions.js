import { createAction } from "@reduxjs/toolkit";

export const setIp = (ip) => ({
    type: 'SET_IP',
    payload: ip,
});

export const setPort = (port) => ({
    type: 'SET_PORT',
    payload: port,
});

export const setRecordingUri = (uri) => ({
    type: 'SET_RECORDING_URI',
    payload: uri,
});

export const setRecordings = (recordings) => ({
    type: 'SET_RECORDINGS',
    payload: recordings,
});

export const setFileName = (fileName) => ({
    type: 'SET_FILE_NAME',
    payload: fileName,
});

export const setChosenRecording = (uri) => ({
    type: 'SET_CHOSEN_RECORDING',
    payload: uri,
});


export const setConvertedAudio = createAction('SET_CONVERTED_AUDIO');