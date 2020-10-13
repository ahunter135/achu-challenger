rm consumer.apk
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore /Users/austinhunter/Documents/My\ Projects/challenger-app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk consumer
~/Library/Android/sdk/build-tools/28.0.3/zipalign -v 4 /Users/austinhunter/Documents/My\ Projects/challenger-app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk consumer.apk

