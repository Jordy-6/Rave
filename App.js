import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import Connection from './components/Connection';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Main from './screen/Main';
import { Provider } from 'react-redux';
import store from './store/Store';

export default function App() {
  
  const Stack = createNativeStackNavigator();
  
  return (
  
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Connection'>
          <Stack.Screen name="Connection" component={Connection} options={{ title: 'Connexion' }} />
          <Stack.Screen name="Main" component={Main} options={{ title: 'Home' }} />
        </Stack.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
        <StatusBar style="auto" />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
