#!/bin/bash
echo "Creating project without FaceDetector"

if [ -e node_modules/react-native-camera/ios/FaceDetector ] ; then
  rm -rf node_modules/react-native-camera/ios/FaceDetector
fi

cp node_modules/react-native-camera/postinstall_project/projectWithoutFaceDetection.pbxproj node_modules/react-native-camera/ios/RNCamera.xcodeproj/project.pbxproj

echo "Hacking NodeJS dependencies"

./node_modules/.bin/rn-nodeify --hack --install "assert, crypto, stream, events, vm"
