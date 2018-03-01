package tech.eltcoin.eltwallet;

import com.reactnativenavigation.NavigationApplication;
import com.BV.LinearGradient.LinearGradientPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import org.reactnative.camera.RNCameraPackage;
import br.com.classapp.RNSensitiveInfo.RNSensitiveInfoPackage;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import com.facebook.react.ReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new LinearGradientPackage(),
      new RandomBytesPackage(),
      new RNCameraPackage(),
      new RNSensitiveInfoPackage(),
      new ReactNativeDialogsPackage(),
      new ReactNativeFingerprintScannerPackage()
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }
}
