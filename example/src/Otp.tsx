import * as React from 'react';
import { Image, TextInput } from 'react-native';
import ProgressDialog from 'react-native-progress-dialog';
import { View, Text, SafeAreaView, Button, ToastAndroid } from 'react-native';
import { closeStreamOtp, heValidation, requestOtpByPhone, requestPermission, streamOtp, validateOtp } from 'react-native-trusted-device';
import { styles } from './Style';

export default function Otp(){
      const [phone, setPhone] = React.useState('');
      const [otp, setOtp] = React.useState('')
      const [otpId, setOtpId] = React.useState('')
      const [verifyStatus, setVerifyStatus] = React.useState('Input Your OTP')
      const [message, setMessage] = React.useState('Input Your Phone')
      const [heMessage, setHeMessage] = React.useState('')
      const [isLoading, setLoading] = React.useState(false)
      const Separator = () => <View style={styles.separator} />;
      React.useEffect(() => {
        //componentwillmount
        requestPermission()
        streamOtp((otp:string)=>{
          setOtp(otp)
        })
        return()=>{
          closeStreamOtp()
        }
      }, []);
    
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
            <Text style={styles.title}>
             {message}
            </Text>
            <TextInput
            style={styles.input}
            onChangeText={phoneNumber => setPhone(phoneNumber)}
            defaultValue={phone}
            keyboardType="numeric"
          />
          </View>
          <Separator />
          
          <View>
          <ProgressDialog visible={isLoading}/>
            <Text style={styles.title}>
             {verifyStatus}
            </Text>
            <TextInput
            placeholder='It should be auto fill for misscall & sms'
            placeholderTextColor="#999c9e"
            style={styles.input}
            onChangeText={otp => setOtp(otp)}
            value={otp}
            keyboardType="numeric"
          />
          <View style={styles.button}>
            <Button
              title="Validate"
              color="#000000"
              onPress={() => {
                setLoading(true)
                validateOtp(otpId, otp,
                  (status:boolean)=>{
                    setLoading(false)
                    setVerifyStatus("Verification status is: "+ status)
                  },
                  (err:string)=>{
                    setLoading(false)
                    setVerifyStatus(err)
                  })
              }
              }
            />
          </View>
          </View>
          <Separator />
    
          <View>
            <Text style={styles.title}>
             Validate Your Phone Using :
            </Text>
          </View>
          <View style={styles.button}>
            <Button
              title="SMS"
              color="#49beff"
              onPress={() => {
                setMessage('Just wait, Fazpass will send your OTP.')
                requestOtpByPhone(phone,
                  "1e1de010-71b2-47d6-a037-254182ff3696",
                   (_response:any)=>{
                     setOtpId(_response.id)
                   },
                   (_err:string)=>{
                    ToastAndroid.show(_err, ToastAndroid.SHORT);
                   })
              }
                }
            />
          </View>
    
          <View style={styles.button}>
            <Button
            title="Misscall"
            color="#f194ff"
            onPress={() =>
             {
              setMessage('Just wait, Fazpass will send your OTP.')
              requestOtpByPhone(phone,
              "595ea55e-95d2-4ec4-969e-910de41585a0",
               (_response:string)=>{console.log(_response)},
               (_err:string)=>{ToastAndroid.show(_err, ToastAndroid.SHORT)})
             }
            }/>
          </View>
    
          <View style={styles.button}>
            <Button
              title="WhatsApp"
              color="#49be25"
              onPress={() =>
              {
                setMessage('Just wait, Fazpass will send your OTP.')
                requestOtpByPhone(phone,
                "c73fbaac-cce8-4cad-af0e-afd040a8f7e2",
                 (_response:any)=>{setOtpId(_response.id)},
                 (_err:string)=>{
                   setMessage(_err)
                 })
              }
              }
            />
          </View>
    
          <View style={styles.button}>
            <Button
              title="Header Enrichment"
              color="#be4d25"
              onPress={() => {
                setLoading(true)
                heValidation(phone, 
                "6cb0b024-9721-4243-9010-fd9e386157ec",
                (status:boolean)=>{
                  setLoading(false)
                  setHeMessage('Result of He valisation is ' + status)
                  },
                  (err:string)=>{
                    setLoading(false)
                    setHeMessage(err)
                  })}}
            />
    
            <Text style={styles.title}>
             {heMessage}
            </Text>
          </View>
          <Separator />
        </SafeAreaView>
      );


}