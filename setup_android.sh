#!/bin/bash

# Define where to install the SDK and JDK
SDK_DIR="$HOME/android-sdk"
JDK_DIR="$SDK_DIR/jdk"
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip"
JDK_URL="https://aka.ms/download-jdk/microsoft-jdk-17.0.12-macos-aarch64.tar.gz"

echo "Setting up Android SDK at $SDK_DIR..."

mkdir -p "$SDK_DIR/cmdline-tools"
mkdir -p "$JDK_DIR"

# 1. Setup Java 17 (Standalone)
echo "Checking for Java 17..."
if [ ! -f "$JDK_DIR/jdk-17.0.12+7/Contents/Home/bin/java" ]; then
    echo "Downloading OpenJDK 17 (Microsoft Build)..."
    curl -L -o "$SDK_DIR/jdk.tar.gz" $JDK_URL
    
    echo "Unzipping JDK..."
    tar -xzf "$SDK_DIR/jdk.tar.gz" -C "$JDK_DIR"
    rm "$SDK_DIR/jdk.tar.gz"
fi

# Set JAVA_HOME to our local JDK for this script
export JAVA_HOME="$JDK_DIR/jdk-17.0.12+7/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"

echo "Using Java: $(java -version 2>&1 | head -n 1)"

# 2. Setup Command Line Tools
if [ ! -f "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" ]; then
    echo "Downloading Command Line Tools..."
    if [ ! -f "$SDK_DIR/cmdline-tools/tools.zip" ]; then
        curl -o "$SDK_DIR/cmdline-tools/tools.zip" $CMDLINE_TOOLS_URL
    fi

    echo "Unzipping Command Line Tools..."
    unzip -q -o "$SDK_DIR/cmdline-tools/tools.zip" -d "$SDK_DIR/cmdline-tools"

    # Rename to 'latest' structure required by sdkmanager
    if [ -d "$SDK_DIR/cmdline-tools/cmdline-tools" ]; then
        rm -rf "$SDK_DIR/cmdline-tools/latest"
        mv "$SDK_DIR/cmdline-tools/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
    fi
fi

# Set Environment Variables temporarily for this script
export ANDROID_HOME="$SDK_DIR"
export PATH="$PATH:$SDK_DIR/cmdline-tools/latest/bin"

# 3. Install SDK Packages
echo "Accepting licenses..."
yes | sdkmanager --licenses > /dev/null

echo "Installing SDK Platform and Build Tools..."
# Install Android 34 (UpsideDownCake) which is standard for current Expo
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo ""
echo "✅ Android SDK Setup Complete!"
echo ""
echo "⚠️  IMPORTANT: You must run the following commands manually to update your current shell:"
echo ""
echo "export ANDROID_HOME=$SDK_DIR"
echo "export JAVA_HOME=$JDK_DIR/jdk-17.0.12+7/Contents/Home"
echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
echo "export PATH=\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin"
echo "export PATH=\$JAVA_HOME/bin:\$PATH"
echo ""
echo "Copy and paste the above lines into your ~/.zshrc or ~/.bash_profile to make it permanent."
