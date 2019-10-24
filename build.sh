#!/bin/bash

# Simple script to clean install
rm -rf node_modules
rm -rf platforms
rm -rf plugins
rm -rf www

CORDOVA_COUNTER=0
SUNBIRD_CORDOVA_COUNTER=0

# Pass build branch as input
buildBranch="release-1.14.0"

file="./build_config"
while IFS="=" read -r key value; do
  case "$key" in
    '#'*) ;;
    'cordova'*)
      CORDOVA[$CORDOVA_COUNTER]=$value
      CORDOVA_COUNTER=$((CORDOVA_COUNTER+1));;
    'sunbird-cordova'*)
      SUNBIRD_CORDOVA[$SUNBIRD_CORDOVA_COUNTER]=$value
      SUNBIRD_CORDOVA_COUNTER=$((SUNBIRD_CORDOVA_COUNTER+1));
  esac
done < "$file"

git clone -b $buildBranch https://github.com/project-sunbird/genie-sdk-wrapper.git
cd genie-sdk-wrapper
rm package-lock.json
npm install
npm run build

rm $(pwd)/dist/dependencies.json

npm pack $(pwd)/dist


cd ..
npm install
npm install $(pwd)/genie-sdk-wrapper/*.tgz --save

rm -rf genie-sdk-wrapper

for cordova_plugin in "${CORDOVA[@]}"
do
  ionic cordova plugin add $cordova_plugin
done

for cordova_plugin in "${SUNBIRD_CORDOVA[@]}"
do
  ionic cordova plugin add $cordova_plugin#$buildBranch
done

ionic cordova plugin add https://github.com/project-sunbird/cordova-plugin-geniecanvas.git#release-1.14.0.1

rm -rf platforms

#ensure that android version is kept at 8.0.0
#heap value fixed to 4K
NODE_OPTIONS=--max-old-space-size=4096 ionic cordova platforms add android@8.0.0

#for debug builds. have commented out the prod settings
NODE_OPTIONS=--max-old-space-size=4096 ionic cordova build android
#NODE_OPTIONS=--max-old-space-size=4096 ionic cordova build android --prod --release --buildConfig ./buildConfig/build.json



#ionic cordova platforms add android@8.0.0

#ionic cordova build android --prod --release --buildConfig ./buildConfig/build.json

