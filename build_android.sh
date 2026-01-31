#!/bin/bash

# 1. Set Environment Variables
export ANDROID_HOME="$HOME/android-sdk"
export JAVA_HOME="$ANDROID_HOME/jdk/jdk-17.0.12+7/Contents/Home"
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$JAVA_HOME/bin:$PATH

echo "Using Android SDK at: $ANDROID_HOME"

# 2. Ask user for mode
echo ""
echo "----------------------------------------"
echo "  Android Build Helper"
echo "----------------------------------------"
echo "1. Build & Install (Requires Device via USB/WiFi)"
echo "2. Build Debug APK (Requires Metro)"
echo "3. Build Release APK (Standalone)"
echo "----------------------------------------"
read -p "Select option (1/2/3): " choice

if [ "$choice" == "2" ]; then
    echo "Starting Build (APK Only)..."
    # Ensure android dir exists
    if [ ! -d "android" ]; then
        echo "Generating Android project..."
        npx expo prebuild --platform android
    fi
    
    cd android
    chmod +x gradlew
    ./gradlew assembleDebug
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Build Success!"
        echo "📂 APK Location: $(pwd)/app/build/outputs/apk/debug/app-debug.apk"
        # Try to open the folder in Finder
        open "$(pwd)/app/build/outputs/apk/debug/" 2>/dev/null
    else
        echo "❌ Build Failed"
    fi
    exit 0
fi

if [ "$choice" == "3" ]; then
    echo "Starting Release Build (Standalone)..."
    # Ensure android dir exists
    if [ ! -d "android" ]; then
        echo "Generating Android project..."
        npx expo prebuild --platform android
    fi
    
    cd android
    chmod +x gradlew
    ./gradlew assembleRelease
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Release Build Success!"
        echo "📂 APK Location: $(pwd)/app/build/outputs/apk/release/app-release.apk"
        # Try to open the folder in Finder
        open "$(pwd)/app/build/outputs/apk/release/" 2>/dev/null
    else
        echo "❌ Build Failed"
    fi
    exit 0
fi

# Mode 1: Build & Install
echo "Checking for connected Android devices..."
# Try to auto-connect if previous IP is known or common
# adb connect 192.168.1.6:5555 2>/dev/null

device_count=$(adb devices | grep -v "List of devices attached" | grep -v "^$" | wc -l)

if [ "$device_count" -eq 0 ]; then
    echo "❌ No Android devices found!"
    echo ""
    echo "troubleshooting Connection:"
    echo "   1. USB CABLE: This is the easiest way. Plug it in!"
    echo "   2. Wireless (Android 11+):"
    echo "      - Go to Developer Options > Wireless Debugging"
    echo "      - Select 'Pair device with pairing code'"
    echo "      - Run: adb pair <IP_ADDRESS>:<PORT> (Use the port shown on pairing screen)"
    echo "      - Then run: adb connect <IP_ADDRESS>:<PORT> (Use the port shown on main screen)"
    echo "   3. Wireless (Android 10 or lower):"
    echo "      - Plug in USB cable first."
    echo "      - Run: adb tcpip 5555"
    echo "      - Unplug USB."
    echo "      - Run: adb connect <DEVICE_IP>:5555"
    exit 1
else
    echo "✅ Found connected device(s)."
fi

echo "Starting Build & Install..."
npm run android
