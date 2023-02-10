package com.fazpass.react_native;

import android.os.Bundle;
import android.telecom.Call;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.fazpass.trusted_device.CROSS_DEVICE;
import com.fazpass.trusted_device.CrossDeviceListener;
import com.fazpass.trusted_device.EnrollStatus;
import com.fazpass.trusted_device.Fazpass;
import com.fazpass.trusted_device.FazpassCd;
import com.fazpass.trusted_device.FazpassTd;
import com.fazpass.trusted_device.HeaderEnrichment;
import com.fazpass.trusted_device.MODE;
import com.fazpass.trusted_device.Otp;
import com.fazpass.trusted_device.OtpResponse;
import com.fazpass.trusted_device.TRUSTED_DEVICE;
import com.fazpass.trusted_device.TrustedDeviceListener;
import com.fazpass.trusted_device.User;
import com.fazpass.trusted_device.ValidateStatus;

import java.util.function.Function;

@ReactModule(name = "TrustedDeviceModule")
public class TrustedDeviceModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TrustedDevice";
    private ReactContext mReactContext;
    private FazpassTd ftd;

    private static Bundle _bundle;
    public TrustedDeviceModule( ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

  private void sendEvent(ReactContext reactContext,
                         String eventName,
                         @Nullable WritableMap params) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private void sendErrorEvent(ReactContext reactContext,
                         @Nullable String message) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit("error", message);
  }
    @ReactMethod
    public void addListener(String eventName) {}

    @ReactMethod
    public void removeListeners(Integer count) {}


/*    // Example method
    // See https://reactnative.dev/docs/native-modules-android
    @ReactMethod
    public void multiply(double a, double b, Promise promise) {
        promise.resolve(a * b);
    }*/

    @ReactMethod
    public void initialize(String key, int mode, Callback e){
      try{
        switch (mode){
          case 0:
            Fazpass.initialize(mReactContext, key, MODE.DEBUG);
            break;
          case 1:
            Fazpass.initialize(mReactContext, key, MODE.STAGING);
            break;
          case 2:
            Fazpass.initialize(mReactContext, key, MODE.PRODUCTION);
            break;
        }
      }catch (Exception ex){
        e.invoke(ex.getMessage());
      }

    }

    @ReactMethod
    public void requestOtpByEmail(String email, String gateway, Callback s, Callback e){
      try{
        Fazpass.requestOtpByEmail(mReactContext, email, gateway, new Otp.Request() {
          @Override
          public void onComplete(OtpResponse response) {
            s.invoke(response);
          }

          @Override
          public void onIncomingMessage(String otp) {

          }

          @Override
          public void onError(Throwable err) {
            e.invoke(err.getMessage());
          }
        });
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }

    }

    @ReactMethod
    public void requestOtpByPhone(String phone, String gateway, Callback s, Callback e){
       try{
         Fazpass.requestOtpByPhone(mReactContext, phone, gateway, new Otp.Request() {
           @Override
           public void onComplete(OtpResponse response) {
             WritableMap map = new WritableNativeMap();
             map.putString("id",response.getOtpId() );
             map.putBoolean("status", response.isStatus());
             s.invoke(map);
           }
           @Override
           public void onIncomingMessage(String otp) {
             WritableMap map = new WritableNativeMap();
             map.putString("otp", otp);
             mReactContext
               .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
               .emit("otp-listener", map);
           }
           @Override
           public void onError(Throwable err) {
             e.invoke(err.getMessage());
           }
         });
       }catch (Exception ex){
         sendErrorEvent(mReactContext, ex.getMessage());
       }
    }

    @ReactMethod
    public void validateOtp(String id, String otp, Callback s, Callback e){
      try{
        Fazpass.validateOtp(mReactContext, id, otp, new Otp.Validate() {
          @Override
          public void onComplete(boolean status) {
            s.invoke(status);
          }

          @Override
          public void onError(Throwable err) {
            Log.e("FAZPASS",err.getMessage());
            e.invoke(err.getMessage());
          }
        });
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

    @ReactMethod
    public void heValidation(String phone, String gateway, Callback s, Callback e){
      try{
        Fazpass.heValidation(mReactContext, phone, gateway, new HeaderEnrichment.Request() {
          @Override
          public void onComplete(boolean status) {
            s.invoke(status);
          }

          @Override
          public void onError(Throwable err) {
            e.invoke(err.getMessage());
          }
        });
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

    @ReactMethod
    public void checkDevice(String phone, String email,  Callback s, Callback e){
        try{
          Fazpass.check(mReactContext, email, phone, new TrustedDeviceListener<FazpassTd>() {
            @Override
            public void onSuccess(FazpassTd o) {
              WritableMap map = new WritableNativeMap();
              ftd = o;
              map.putBoolean("cd", o.cd_status.equals(CROSS_DEVICE.AVAILABLE));
              map.putBoolean("td", o.td_status.equals(TRUSTED_DEVICE.TRUSTED));
              s.invoke(map);
            }
            @Override
            public void onFailure(Throwable err) {
              e.invoke(err.getMessage());
            }
          });
        }catch (Exception ex){
          sendErrorEvent(mReactContext, ex.getMessage());
        }
    }

    @ReactMethod
    public void enrollDeviceByPin(ReadableMap map, String pin, Callback s, Callback e){
      try{
        if(ftd==null){
          e.invoke(new String("Method check have not been call"));
        }else{
          User u = new User(map.getString("email"),map.getString("phone"),map.getString("name"),map.getString("id_card"),map.getString("address"));
          ftd.enrollDeviceByPin(mReactContext, u, pin, new TrustedDeviceListener<EnrollStatus>() {
            @Override
            public void onSuccess(EnrollStatus o) {
              WritableMap map = new WritableNativeMap();
              map.putBoolean("status", o.getStatus());
              map.putString("message", o.getMessage());
              s.invoke();
            }

            @Override
            public void onFailure(Throwable err) {
              e.invoke(err.getMessage());
            }
          });
        }
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }

    }

    @ReactMethod
    public void enrollDeviceByFinger(ReadableMap map, String pin, Callback s, Callback e){
     try{
       if(ftd==null){
         e.invoke("Method check have not been call");
       }else{
         UiThreadUtil.runOnUiThread(() -> {
           User u = new User(map.getString("email"),map.getString("phone"),map.getString("name"),map.getString("id_card"),map.getString("address"));
           ftd.enrollDeviceByFinger(getCurrentActivity(), u, pin, new TrustedDeviceListener<Boolean>() {
             @Override
             public void onSuccess(Boolean o) {
               s.invoke(o);
             }

             @Override
             public void onFailure(Throwable err) {

             }
           });
         });
       }
     }catch (Exception ex){
       sendErrorEvent(mReactContext, ex.getMessage());
     }
    }

    @ReactMethod
    public void validateUser(String pin, Callback s, Callback e){
      try{
        if(ftd==null){
          e.invoke("Method check have not been call");
        }else{
          WritableMap map = new WritableNativeMap();
          UiThreadUtil.runOnUiThread(() -> {
            ftd.validateUser(getCurrentActivity(), pin, new TrustedDeviceListener<ValidateStatus>() {
              @Override
              public void onSuccess(ValidateStatus o) {
                map.putDouble("summary", o.getConfidenceRate().getSummary());
                map.putBoolean("status", o.isStatus());
                s.invoke(map);
              }

              @Override
              public void onFailure(Throwable err) {
                e.invoke(err.getMessage());
              }
            });
          });
        }
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

    @ReactMethod
    public void validateCrossDevice(int timeOut, Callback s, Callback e){
      try{
        if(ftd==null){
          e.invoke("Method check have not been call");
        }else{
          WritableMap map = new WritableNativeMap();
          UiThreadUtil.runOnUiThread(() -> {
            ftd.validateCrossDevice(getCurrentActivity(), timeOut, new CrossDeviceListener() {
              @Override
              public void onResponse(String device, boolean status) {
                map.putString("device", device);
                map.putBoolean("status", status);
                s.invoke(map);
              }

              @Override
              public void onExpired() {
                e.invoke("Expired");
              }
            });
          });
        }
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

    @ReactMethod
    public void removeDevice(String pin, Callback s, Callback e){
      try{
        Fazpass.removeDevice(mReactContext, pin, new TrustedDeviceListener<Boolean>() {
          @Override
          public void onSuccess(Boolean o) {
            s.invoke(o);
          }

          @Override
          public void onFailure(Throwable err) {
            e.invoke(err.getMessage());
          }
        });
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

    @ReactMethod
    public void initializeCrossDevice(boolean isRequiredPin){
      FazpassCd.initialize(getCurrentActivity(), isRequiredPin, (Class<?>) null);
    }

    @ReactMethod
    public void initializeCrossDeviceNonView(boolean isRequiredPin, Callback s, Callback e){
      try{
        FazpassCd.initialize(getCurrentActivity(), isRequiredPin, (bundle) ->{
          if(bundle!=null && bundle.getString("device")!=null){
            s.invoke(bundle.getString("device"));
          }else{
            e.invoke("");
          }
          return null;
        });
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

    @ReactMethod
    public void crossDeviceConfirmWithPin(String pin, Callback s){
      try{
        if(_bundle!=null){
          FazpassCd.onConfirmRequirePin(getCurrentActivity(), pin, (b)->{
            s.invoke(Boolean.valueOf(b));
            return null;
          }, _bundle);
        }else{
          FazpassCd.onConfirmRequirePin(getCurrentActivity(), pin, (b)->{
            s.invoke(Boolean.valueOf(b));
            return null;
          });
        }
      }catch (Exception ex){
        sendErrorEvent(mReactContext, ex.getMessage());
      }
    }

  @ReactMethod
  public void crossDeviceConfirm(){
      if(_bundle!=null){
        FazpassCd.onConfirm(getCurrentActivity(), _bundle);
      }else{
        FazpassCd.onConfirm(getCurrentActivity());
      }

  }

  @ReactMethod
  public void crossDeviceDecline(){
      if(_bundle!=null){
        FazpassCd.onDecline(getCurrentActivity(), _bundle);
      }else{
        FazpassCd.onDecline(getCurrentActivity());
      }

  }

  @ReactMethod
  public void foreGroundListener(){
      FazpassCd.foreGroundListener(getCurrentActivity(), (b)->{
        _bundle = b;
        mReactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit("notification-listener", b.getString("device"));
      return null;
      });
  }
}

