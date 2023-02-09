import * as React from 'react';
import { Button, Image, Text, TextInput, ToastAndroid } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import { View, SafeAreaView } from 'react-native';
import { styles } from './Style';
import { checkDevice, enrollDeviceByFinger, Fazpass, removeDevice, validateCrossDevice, validateUser } from 'react-native-trusted-device';

export default function TrustedDevice({navigation}) {
  const Separator = () => <View style={styles.separator} />;
  const [isLoading, setLoading] = React.useState(false)
  const [phone, setPhone] = React.useState('');
  const [checkStatus, setCheckStatus] = React.useState('')
  const [validateStatus, setValidateStatus] = React.useState('')
  const user = {
    "email":"",
    "phone":phone,
    "name":"Andri nova riswanto",
    "id_card":"",
    "address":"Bogor"
  }
  return (
    <SafeAreaView style={styles.container}>
      <View>
      <Image
      style={styles.tinyLogo}
      source={{uri: 'https://caraguna.com/wp-content/uploads/2022/02/react-native.png'}}>
      </Image>
      </View>
      <Separator />
      <View>
      <TextInput
            placeholder='Input your phone or email'
            placeholderTextColor="#999c9e"
            style={styles.input}
            onChangeText={phone => setPhone(phone)}
            value={phone}
            keyboardType="numeric"
          />
      </View>
      <View style={styles.button}>
            <Button
              title="Check Device"
              color="#49beff"
              onPress={() => {
                setLoading(true)
                checkDevice(phone, '',
                (status:any)=>{
                  setLoading(false)
                  setCheckStatus(`Status cross device : ${status.cd} \n Status trusted device : ${status.td}`)
                },
                (err:string)=>{
                  setLoading(false)
                  ToastAndroid.show(err, 1)
                })
              }
              }
            />
      </View>

      <View style={styles.button}>
            <Button
              title="Remove Device"
              color="#49beff"
              onPress={() => {
                setLoading(true)
                removeDevice('123456',
                (status:any)=>{
                  setLoading(false)
                  ToastAndroid.show(`Remove status ${status}`, 1)
                },
                (err:string)=>{
                  setLoading(false)
                  ToastAndroid.show(err, 1)
                })
              }
              }
            />
      </View>


      <View style={styles.button}>
            <Button
              title="Cross Device"
              color="#49beff"
              onPress={() => {
                validateCrossDevice(60, (response:any)=>{
                  ToastAndroid.show(`${response.device} make a response ${response.status}`, 2)
                },
                (err:string)=>{
                  ToastAndroid.show(err, 2)
                })
              }
              }
            />
      </View>

      <View style={styles.button}>
            <Button
              title="Enroll Device By Finger"
              color="#49beff"
              onPress={() => {
                // setLoading(true)
                enrollDeviceByFinger(user, "123456", (status:boolean)=>{
                  ToastAndroid.show(`Enroll status ${status}`,1)
                },
                (err:string)=>{
                  ToastAndroid.show(err, 1)
                })
              }
              }
            />
      </View>
      
      <View style={styles.button}>
            <Button
              title="Validate Device"
              color="#49beff"
              onPress={() => {
                setLoading(true)
                validateUser("123456", (response:any)=>{
                  setLoading(false)
                  setValidateStatus(`Your confidence rate is : ${response.summary}`)
                }, (err:string)=>{
                  setLoading(false)
                  setValidateStatus(`Something went wrong cause : ${err}`)
                })
              }
              }
            />
      </View>

      <View style={styles.button}>
          <Text style={{color:'red'}}>
            {validateStatus}
          </Text>
      </View>

      <View style={styles.footer}>
      <Text style={{fontSize:12, color:'black', textAlign:'center'}}>
              {checkStatus}
      </Text>
      </View>
     
      <ProgressDialog visible={isLoading}/>
    </SafeAreaView>
  );
}