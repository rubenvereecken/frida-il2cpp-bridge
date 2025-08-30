UNITY_CHANGESET := 4af31df58517

include ../common.mk

# Choose platform-specific overrides
ifeq ($(OS), Linux)
    PLATFORM_MAKEFILE := linux.mk
else ifeq ($(OS), Darwin)
    PLATFORM_MAKEFILE := macos.mk
else
    $(error "Unsupported OS: $(OS)")
endif

include $(PLATFORM_MAKEFILE)

# The profile differs per OS but is supplied by platform mk
MSCORLIB := $(MONOBL_DIR)/lib/mono/$(DOTNET_PROFILE)/mscorlib.dll

UNITY_LINKER := $(MAYBE_STRACE) $(IL2CPP_DIR)/build/deploy/UnityLinker
IL2CPP := $(MAYBE_STRACE) $(IL2CPP_DIR)/build/deploy/il2cpp

# Common commands that do not change across OS (dotnetprofile provided)
CPP_TARGET_CMD = $(IL2CPP) \
	--convert-to-cpp \
	--emit-null-checks \
	--enable-array-bounds-check \
	--dotnetprofile=$(DOTNET_PROFILE) \
	--copy-level=None \
	--directory="$(<D)" \
	--generatedcppdir="$(@D)"

LINKED_DLL_TARGET_CMD = $(UNITY_LINKER) \
	--silent \
	--i18n=none \
	--core-action=link \
	--strip-security \
	--rule-set=aggressive \
	--dotnetruntime=il2cpp \
	--dotnetprofile=$(DOTNET_PROFILE) \
	--descriptor-directory="$(LINKER_DESCRIPTORS_DIR)" \
	--include-assembly="$<,$(MSCORLIB)" \
	--out="$(@D)"
