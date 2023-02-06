import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Home from './Home';
import Otp from './Otp';
import TrustedDevice from './TrustedDevice';

const Stack = createNativeStackNavigator();
export default function App(){
  React.useEffect(() => {
    // Fazpass.backgroundListener(false, true)
   
/*
    const background = tdEmitter.addListener('b-notification-listener', (data) =>{
      console.log(`bg ${data}`)
    })
    */
    return()=>{
     
      // background.remove()
    }
  }, [])
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Trusted Device" component={TrustedDevice} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




