# Shared settings for Unity builds on macOS

# Note: folder layout verified on 2021+, may differ on legacy versions.
MONO_DIR    = $(EDITOR_DIR)/Contents/Frameworks/Mono
MONOBL_DIR  = $(EDITOR_DIR)/Contents/MonoBleedingEdge
IL2CPP_DIR  = $(EDITOR_DIR)/Contents/il2cpp
DYNAMIC_LIB_EXT = dylib

PLATFORM := MacOS
DOTNET_PROFILE := unityaot-macos

# Use safe strip that keeps indirect symbol table
STRIP ?= strip -x

# macOS: we only support Apple-silicon arm64 for now
ifeq ($(ARCH), arm64)
    EDITOR_SUFFIX := Arm64
else
    $(error "Only ARM64 is currently supported for macOS")
endif

ifdef UNITY_CHANGESET
$(EDITOR_DIR):
	@ $(ECHO) downloading editor...
	@ $(CURL) https://netstorage.unity3d.com/unity/$(UNITY_CHANGESET)/MacEditorInstaller$(EDITOR_SUFFIX)/Unity.pkg -O

	@ $(ECHO) extracting editor...
	@ pkgutil --expand Unity.pkg tmp
	@ cd tmp && cat Unity.pkg.tmp/Payload | gunzip -dc | cpio -i && cd ..
	@ mv tmp/Unity/Unity.app Editor && rm -rf tmp
	@ touch -m Editor

	@ rm Unity.pkg

ifeq "$(call VER_GTE,$(UNITY_VERSION),2019.4.0f1)" "YES"
	@ $(ECHO) downloading editor support...
	@ $(CURL) https://download.unity3d.com/download_unity/$(UNITY_CHANGESET)/MacEditorTargetInstaller/UnitySetup-Mac-IL2CPP-Support-for-Editor-$(UNITY_VERSION).pkg -o Support.pkg

	@ $(ECHO) extracting editor support...
	@ pkgutil --expand Support.pkg tmp
	@ mkdir -p tmp/TargetSupport && cd tmp/TargetSupport && cat ../TargetSupport.pkg.tmp/Payload | gunzip -dc | cpio -i && cd ../..
	@ cp -r tmp/TargetSupport/* Editor/Contents/PlaybackEngines/MacStandaloneSupport && rm -rf tmp
	@ touch -m Editor

	@ rm Support.pkg
endif
endif
