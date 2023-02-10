import { EmitterSubscription, NativeEventEmitter, NativeModules, Permission, PermissionsAndroid, Platform } from 'react-native';
import type { Double } from 'react-native/Libraries/Types/CodegenTypes';


const LINKING_ERROR =
  `The package 'react-native-trusted-device' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

export const Fazpass = NativeModules.TrustedDevice
  ? NativeModules.TrustedDevice
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

  /*
  const tdEmitter = new NativeEventEmitter(TrustedDevice)
  const subscription = tdEmitter.addListener('otp-listener', (data) => console.log(data.otp))
*/
const tdEmitter = new NativeEventEmitter(Fazpass)
var notificationListener:EmitterSubscription;
var otpListener:EmitterSubscription;
var errorListener:EmitterSubscription;

export function streamNativeError(callback:Function){
  errorListener = tdEmitter.addListener('error',(data)=>{
  callback(data)
  })
}

export function closeStreamNativeError(){
  if(errorListener!=null){
    errorListener.remove()
  }
}

export async function requestPermission(){
  let permissions: Array<Permission> =
    ['android.permission.RECEIVE_SMS','android.permission.READ_PHONE_STATE', 'android.permission.READ_CALL_LOG',
      'android.permission.ACCESS_COARSE_LOCATION','android.permission.READ_CONTACTS'];
  try {
    await PermissionsAndroid.requestMultiple(permissions);
  } catch (err) {
    console.warn(err);
  }
}

export function streamNotification(callback:Function){
  Fazpass.foreGroundListener()
  notificationListener = tdEmitter.addListener('notification-listener', (data) =>{
    callback(data)
  })
}

export function closeStreamNotification(){
  if(notificationListener!=null){
    notificationListener.remove()
  }
}

export function streamOtp(callback:Function){
  otpListener = tdEmitter.addListener('otp-listener', (data) =>{
    callback(data.otp)
  })
}

export function closeStreamOtp(){
  if(otpListener!=null){
    otpListener.remove()
  }
}

export function initialize(merchant_key:string, callback:Function){
  Fazpass.initialize(merchant_key,
  1,(err:string)=>{
    callback(err)
  })
}

export function initializeCrossDeviceNonView(isRequiredPin:boolean, callbackBg:Function, callbackFg:Function){
  Fazpass.initializeCrossDeviceNonView(isRequiredPin, (onNotif:string)=>{
    callbackBg(onNotif)
  }, (onRunning:string)=>{
    callbackFg(onRunning)
  })
}

export function initializeCrossDevice(isRequiredPin:boolean){
  Fazpass.initializeCrossDevice(isRequiredPin)
}

export function heValidation(phone:string, gateway:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.heValidation(phone, 
    gateway,
    (status:boolean)=>{
     callbackStatus(status)
      },
      (err:string)=>{
        callbackErr(err)
      })
}

export function requestOtpByPhone(phone:string, gateway:string, callbackResponse:Function, callbackErr:Function){
  Fazpass.requestOtpByPhone(phone,gateway,
     (_response:any)=>{
      callbackResponse(_response)
     },
     (_err:string)=>{
       callbackErr(_err)
     })
}

export function validateOtp(otpId:string, otp:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.validateOtp(otpId, otp,
    (status:boolean)=>{
      callbackStatus(status)
    },
    (err:string)=>{
      callbackErr(err)
    })
}

export function checkDevice(phone:string, email:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.checkDevice(phone, email,
  (status:any)=>{
    callbackStatus(status)
  },
  (err:string)=>{
    callbackErr(err)
  })
}

export function removeDevice(pin:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.removeDevice(pin,
    (status:any)=>{
      callbackStatus(status)
    },
    (err:string)=>{
      callbackErr(err)
    })
}

export function validateCrossDevice(duration:Double, callbackResponse:Function, callbackErr:Function){
  Fazpass.validateCrossDevice(duration, (response:any)=>{
    callbackResponse(response)
  },
  (err:string)=>{
    callbackErr(err)
  })
}

export function enrollDeviceByFinger(user:any, pin:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.enrollDeviceByFinger(user, pin, (status:boolean)=>{
    callbackStatus(status)
  },
  (err:string)=>{
    callbackErr(err)
  })
}

export function enrollDeviceByPin(user:any, pin:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.enrollDeviceByPin(user, pin, (status:boolean)=>{
    callbackStatus(status)
  },
  (err:string)=>{
    callbackErr(err)
  })
}

export function validateUser(pin:string, callbackStatus:Function, callbackErr:Function){
  Fazpass.validateUser(pin, (response:any)=>{
    callbackStatus(response)
  }, (err:string)=>{
   callbackErr(err)
  })
}

export function crossDeviceConfirmWithPin(pin:string, callbackStatus:Function){
  Fazpass.crossDeviceConfirmWithPin(pin, (status:boolean)=>{
    callbackStatus(status)
  })
}

export function crossDeviceConfirm(allow:boolean){
  if(allow){
    Fazpass.crossDeviceConfirm()
  }else{
    Fazpass.crossDeviceDecline()
  }
  
}