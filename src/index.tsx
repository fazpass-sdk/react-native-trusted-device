import { EmitterSubscription, NativeEventEmitter, NativeModules, Permission, PermissionsAndroid, Platform } from 'react-native';


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
