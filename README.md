# react-native-trusted-device

Trusded device library for react native from Fazpass company

## Installation

```sh
npm install react-native-trusted-device
```

## Usage
First you should call this code in your root view. It will save that credential in then local storage of the device.

```js
import { initialize } from 'react-native-trusted-device';

// ...

Fazpass.initialize("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjo0fQ.WEV3bCizw9U_hxRC6DxHOzZthuJXRE8ziI3b6bHUpEI",
    1,(err:string)=>{
      console.log(err)
      // TODO when initialize status false & true
    })
```

## Permission
For enjoy of all feature make sue your app request this permission

```XML
  <uses-permission android:name="android.permission.READ_PHONE_STATE"/>
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />
  <uses-permission android:name="android.permission.READ_CONTACTS" />
  <uses-permission android:name="android.permission.USE_BIOMETRIC" />
  <uses-permission android:name="android.permission.RECEIVE_SMS" />
  <uses-permission android:name="android.permission.READ_CALL_LOG" />

```
If you feel lazy to take care about it you can call this method
```TypeScript
import { requestPermission } from 'react-native-trusted-device';

requestPermission()
```

## <b>OTP & HE</b>
If you want to listen incoming OTP by SMS or Misscall you need to call <code>streamOtp</code>
and close this stream on component will unmount
```TypeScript
React.useEffect(() => {
  streamOtp((otp:string)=>{
    // Your OTP come here
    })
  return()=>{
    closeStreamNotification()
  }
}, [])
```
#### <b>Request & Validate OTP</b>
Request OTP that use phone number as the parameter
```Typescript
Fazpass.requestOtpByPhone(phone,
  // This is your gateway
  "1e1de010-71b2-47d6-a037-254182ff3696",
  (_response:any)=>{
    // This otp id will be use for validate that OTP
    setOtpId(_response.id)
  },
  (_err:string)=>{
    ToastAndroid.show(_err, ToastAndroid.SHORT);
  })
```
If you want email as the parameter you can call <code>requestOtpByEmail</code>
This is example for validation OTP
```TypeScript
Fazpass.validateOtp(otpId, otp,
  (status:boolean)=>{
  // validation status
  setVerifyStatus("Verification status is: "+ status)
  },
  (err:string)=>{
    
  })
```
### <b>Header Enrichment</b>
Header enrichment only accept phone number as a parameter

```TypeScript
Fazpass.heValidation(phone, 
  "6cb0b024-9721-4243-9010-fd9e386157ec",
  (status:boolean)=>{
    setHeMessage('Result of He valisation is ' + status)
  },
  (err:string)=>{
    setHeMessage(err)
  })
```
## <b>Trusted Device</b>
Available Method: <br>
* <b>Check The device</b>

```TypeScript
// you just need to fill one of them phone/email
Fazpass.checkDevice('PHONE_NUMBER', 'EMAIL',
  (status:any)=>{
    // CD status os cross device status, and TD is trusted Device
  setCheckStatus(`Status cross device : ${status.cd} Status trusted device : ${status.td}`)
  },
  (err:string)=>{
    ToastAndroid.show(err, 1)
  })
```
<i>Note: You can't call enroll or validate if you have not call check</i> <br>
* <b>Enroll The Device</b>

```TypeScript
const user = {
    "email":"",
    "phone":phone,
    "name":"Andri nova riswanto",
    "id_card":"",
    "address":"Bogor"
}
Fazpass.enrollDeviceByFinger(user, "PIN", (status:boolean)=>{
  ToastAndroid.show(`Enroll status ${status}`,1)
  },
  (err:string)=>{
  ToastAndroid.show(err, 1)
})

// or you can enroll device by pin only
Fazpass.enrollDeviceByPin(user, "PIN", (status:boolean)=>{
  ToastAndroid.show(`Enroll status ${status}`,1)
  },
  (err:string)=>{
  ToastAndroid.show(err, 1)
})
```
<i>Note: Don't enroll device if trusted device status is false, so better you validate this user & device first using OTP or Header enrichment</i>

* <b>Check Confidence Rate</b>

```TypeScript
Fazpass.validateUser("PIN", (response:any)=>{
  ToastAndroid.show(`Your confidence rate is : ${response.summary}`,1)
  }, (err:string)=>{
    ToastAndroid.show(`Something went wrong cause : ${err}`,1)
  })
```
* <b>Remove Device</b>
```TypeScript
  Fazpass.removeDevice('PIN',
    (status:any)=>{
    ToastAndroid.show(`Remove status ${status}`, 1)
    },
    (err:string)=>{         
    ToastAndroid.show(err, 1)
  })
```
### <b>Cross Device</b><br>
When check device there are 2 status (Trusted Device & Cross Device) so it is possible when trusted device is <code>false</code> but cross device status is <code>true</code>.
You can call method cross device to send notification that will request validation, It will make you no need to validate OTP or Header Enrichment

* Initialize Cross Device Default View
```TypeScript
// make it true if you want validate cross device using pin
React.useEffect(() => {
  Fazpass.initializeCrossDevice(false)
}, [])
```
* Initialize Cross Device Modification View

```TypeScript
React.useEffect(() => {
  Fazpass.initializeCrossDeviceNonView(false, (onNotif:string)=>{
      //this is state
    setNotificated(true)
    let a = onNotif.split(',')
      //this is state
    setNotificationMessage(`There was an intruder that try to login \n from device ${a[1]}`)
    }, (onRunning:string)=>{
      console.log(onRunning)
    })
  // Call this method also to handle foreground notification  
  streamNotification((device:string)=>{
      //this is state
    setNotificated(true)
      let a = device.split(',')
    //this is state
    setNotificationMessage(`There was an intruder that try to login \n from device ${a[1]}`)
  })
    return()=>{
      // You need to close the stream
     closeStreamNotification()
    }
  }, [])
```
<i>Note: you need to call this method in the first view on your app</i>


## License

MIT

---
