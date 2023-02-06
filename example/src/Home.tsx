import * as React from 'react';
import { Button, Image } from 'react-native';
import { View, SafeAreaView } from 'react-native';
import { closeStreamNotification, Fazpass, streamNotification } from 'react-native-trusted-device';
import { styles } from './Style';
import * as material from "react-native-paper";
// import { HStack, Banner } from "@react-native-material/core";
// import Button as materialButton from '@react-native-material/core';

export default function Home({navigation}) {
  const [isNotificated, setNotificated] = React.useState(false)
  const [notificationMessage, setNotificationMessage] = React.useState('')
  React.useEffect(() => {
    Fazpass.initialize("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjo0fQ.WEV3bCizw9U_hxRC6DxHOzZthuJXRE8ziI3b6bHUpEI",
    1,(err:string)=>{
      console.log(err)
    })
    // Fazpass.initializeCrossDevice(false)
   
    Fazpass.initializeCrossDeviceNonView(false, (onNotif:string)=>{
      setNotificated(true)
      let a = onNotif.split(',')
      console.log(a)
      setNotificationMessage(`There was an intruder that try to login \n from device ${a[1]}`)
    }, (onRunning:string)=>{
      console.log(onRunning)
    })
    streamNotification((device:string)=>{
      setNotificated(true)
      let a = device.split(',')
      console.log(a)
      setNotificationMessage(`There was an intruder that try to login \n from device ${a[1]}`)
    })
    return()=>{
     closeStreamNotification()
    }
  }, [])
  const Separator = () => <View style={styles.separator} />;
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <material.Banner
        visible={isNotificated}
        actions={[
          {label:'That\'s Me',
            onPress:()=>{
              Fazpass.crossDeviceConfirm()
              setNotificated(false)
            }
        },{label:'Not Me',
          onPress:()=>{
              Fazpass.crossDeviceDecline()
              setNotificated(false)
          }}
        ]}
        icon={() => (
          <Image
            source={{
              uri: 'https://w7.pngwing.com/pngs/863/863/png-transparent-high-stop-signal-alert-icon-hand-thumbnail.png',
            }}
            style={{
              width: 25,
              height: 25,
            }}
          />
        )}
        >

          {/* <SafeAreaView>
              <View>
                  <material.Text style={styles.title}>
                    Alert
                  </material.Text>
                  <material.Text style={styles.text_banner}>
                    {notificationMessage}
                  </material.Text>
              </View>
          </SafeAreaView> */}

        {notificationMessage}
        </material.Banner>
      </View>
      
      <View>
      <Image
      style={styles.tinyLogo}
      source={{uri: 'https://caraguna.com/wp-content/uploads/2022/02/react-native.png'}}>
      </Image>
      </View>
      <Separator />
      
      <View style={styles.button}>
            <Button
              title="OTP"
              color="#49beff"
              onPress={() => {
                navigation.navigate('Otp')
              }
                }
            />
      </View>
    
          <View style={styles.button}>
            <Button
            title="Trusted Device"
            color="#f194ff"
            onPress={() =>
             {
              navigation.navigate('Trusted Device')
             }
            }/>
          </View>
    </SafeAreaView>
  );
}