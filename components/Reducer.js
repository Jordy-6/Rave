const initialState = {
  ip: '',
  port: '',
  recordingUri: null,
  recordings: [],
  fileName: "",
  chosenRecording: null,
    convertedAudio: [],
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
      case 'SET_IP':
          return { ...state, ip: action.payload };
      case 'SET_PORT':
          return { ...state, port: action.payload };
      case 'SET_RECORDING_URI':
          return { ...state, recordingUri: action.payload };
      case 'SET_RECORDINGS':
          return { ...state, recordings: action.payload };
      case 'SET_FILE_NAME':
          return { ...state, fileName: action.payload };
      case 'SET_CHOSEN_RECORDING':
            return { ...state, chosenRecording: action.payload };
        case 'SET_CONVERTED_AUDIO':
            return { ...state, convertedAudio: action.payload };
      
      default:
          return state;
  }
}
