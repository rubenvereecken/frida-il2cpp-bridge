MAKEFLAGS += --no-builtin-rules

VER_GTE = $(shell printf '%s\n' "$2" "$1" | sort -C -V && echo YES || echo NO)

THIS_DIR := $(shell dirname $(realpath $(firstword $(MAKEFILE_LIST))))
ROOT_DIR := $(shell realpath $(THIS_DIR)/../..)
UNITY_VERSION := $(shell basename $(THIS_DIR))
BUILD_DIR = $(ROOT_DIR)/build/$(UNITY_VERSION)
EDITOR_DIR = $(THIS_DIR)/Editor

# Platform detection and per-OS overrides
OS := $(shell uname)
ARCH := $(shell uname -m)

ifeq ($(OS), Linux)
    PLATFORM_MAKEFILE := common-linux.mk
else ifeq ($(OS), Darwin)
    PLATFORM_MAKEFILE := common-macos.mk
else ifeq ($(OS), Windows_NT)
    $(error "Windows is not supported yet")
else
    $(error "Unknown OS: $(OS)")
endif

# Pull in platform-specific path/layout definitions (MONO_DIR, IL2CPP_DIR, …)
include ../$(PLATFORM_MAKEFILE)

# $(STRIP) is set by platform-specific common-*.mk; default to plain strip
STRIP ?= strip

MONO := $(MAYBE_STRACE) $(MONOBL_DIR)/bin/mono
MCS := $(MONO) $(MONOBL_DIR)/lib/mono/4.5/mcs.exe

LINKER_DESCRIPTORS_DIR := $(IL2CPP_DIR)/LinkerDescriptors

ifeq "$(call VER_GTE,$(UNITY_VERSION),2019.1.0f1)" "YES"
GENERATED_CPP_FILENAME := %
else
GENERATED_CPP_FILENAME := Bulk_%_0
endif

ASSEMBLY_TARGET = $(BUILD_DIR)/out/%.$(DYNAMIC_LIB_EXT)
CPP_TARGET := $(BUILD_DIR)/cpp/$(GENERATED_CPP_FILENAME).cpp
LINKED_DLL_TARGET := $(BUILD_DIR)/linked/%.dll
DLL_TARGET := $(BUILD_DIR)/dll/%.dll
CS_SRC := $(ROOT_DIR)/test/%.cs

ECHO := echo -e "\e[1;34m$(UNITY_VERSION)\e[0m ►"
CURL := curl -L -s -A "" --fail

$(ASSEMBLY_TARGET): $(CPP_TARGET)
	@ $(ECHO) compiling $(<F)
	@ $(ASSEMBLY_TARGET_CMD)
	@ $(STRIP) "$@"

$(CPP_TARGET): $(LINKED_DLL_TARGET)
	@ $(ECHO) generating $(@F)
	@ $(CPP_TARGET_CMD)

$(LINKED_DLL_TARGET): $(DLL_TARGET)
	@ $(ECHO) linking $(<F)
	@ $(LINKED_DLL_TARGET_CMD)
	@ touch "$@"

$(DLL_TARGET): $(CS_SRC) $(EDITOR_DIR) $(BUILD_DIR)
	@ $(ECHO) compiling $(<F)
	@ mkdir -p "$(@D)"
	@ $(DLL_TARGET_CMD)

$(BUILD_DIR):
	@ mkdir -p "$@"

# The platform-specific makefile provides the $(EDITOR_DIR) recipe if
# needed, so the old Linux-only block above has been removed.

DLL_TARGET_CMD ?= $(MCS) \
	-target:library \
	-nologo \
	-noconfig \
	-unsafe \
	-out:"$@" \
	"$<"

.PHONY: assembly
assembly: $(BUILD_DIR)/out/GameAssembly.$(DYNAMIC_LIB_EXT)

# USED_FILE_LIST := $(BUILD_DIR)/filelist.txt
# .PHONY: minimalize
# minimalize: MAYBE_STRACE := strace -z -o "$(BUILD_DIR)/filelist.txt" -A -e trace=file
# minimalize: | clean assembly
# 	@ grep -oP '$(EDITOR_DIR)/[^"]+' "$(USED_FILE_LIST)" | sort -u | sed -E 's#/+#/#g' > "$(USED_FILE_LIST).sorted"
# 	@ find "$(EDITOR_DIR)" -type f -not -path "$(EDITOR_DIR)/Data/il2cpp/*" -print0 | grep -zFxvf "$(USED_FILE_LIST).sorted" | xargs -0 rm
# 	@ find "$(EDITOR_DIR)" -type d -empty -delete

.PHONY: clean
clean:
	@ rm -rf "$(BUILD_DIR)"

.SECONDARY:
