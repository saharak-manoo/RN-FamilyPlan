package com.familyplan;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.xmartlabs.lineloginmanager.LineLoginPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.codemotionapps.reactnativedarkmode.DarkModePackage;
import com.horcrux.svg.SvgPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.taluttasgiran.pickermodule.ReactNativePickerModulePackage;
import com.henninghall.date_picker.DatePickerPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.reactcommunity.rnlanguages.RNLanguagesPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import iyegoroff.RNTextGradient.RNTextGradientPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import java.lang.reflect.InvocationTargetException;
import java.util.List;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for
      // example:
      // packages.add(new MyReactNativePackage());
      packages.add(new RNFirebaseMessagingPackage());
      packages.add(new RNFirebaseNotificationsPackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this); // Remove this line if you don't want Flipper enabled
  }

  /**
   * Loads Flipper in React Native templates.
   *
   * @param context
   */
  private static void initializeFlipper(Context context) {
    if (BuildConfig.DEBUG) {
      try {
        /*
         * We use reflection here to pick up the class that initializes Flipper, since
         * Flipper library is not available in release mode
         */
        Class<?> aClass = Class.forName("com.facebook.flipper.ReactNativeFlipper");
        aClass.getMethod("initializeFlipper", Context.class).invoke(null, context);
      } catch (ClassNotFoundException e) {
        e.printStackTrace();
      } catch (NoSuchMethodException e) {
        e.printStackTrace();
      } catch (IllegalAccessException e) {
        e.printStackTrace();
      } catch (InvocationTargetException e) {
        e.printStackTrace();
      }
    }
  }
}
