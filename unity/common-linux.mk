# Shared settings for Unity builds on Linux

MONO_DIR = $(EDITOR_DIR)/Data/Mono
MONOBL_DIR = $(EDITOR_DIR)/Data/MonoBleedingEdge
IL2CPP_DIR = $(EDITOR_DIR)/Data/il2cpp
DYNAMIC_LIB_EXT = so

PLATFORM := Linux
DOTNET_PROFILE := unityaot-linux

# On Linux plain strip is fine
STRIP ?= strip

# Linux: we only support x64
ifneq ($(ARCH), x86_64)
    $(error "Only x64 is supported for Linux")
endif

ifdef UNITY_CHANGESET
$(EDITOR_DIR):
	@ $(ECHO) downloading editor...
	@ $(CURL) https://netstorage.unity3d.com/unity/$(UNITY_CHANGESET)/LinuxEditorInstaller/Unity.tar.xz -O

	@ $(ECHO) extracting editor...
	@ tar -xf Unity.tar.xz
	@ touch -m Editor

	@ rm Unity.tar.xz

ifeq "$(call VER_GTE,$(UNITY_VERSION),2019.4.0f1)" "YES"
	@ $(ECHO) downloading editor support...
	@ $(CURL) https://download.unity3d.com/download_unity/$(UNITY_CHANGESET)/LinuxEditorTargetInstaller/UnitySetup-Linux-IL2CPP-Support-for-Editor-$(UNITY_VERSION).tar.xz -o Support.tar.xz

	@ $(ECHO) extracting editor support...
	@ tar -xf Support.tar.xz
	@ touch -m Editor
	
	@ rm Support.tar.xz
endif
endif
