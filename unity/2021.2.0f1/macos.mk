# macOS ARM64 build script for Unity 2021.2.0f1

ASSEMBLY_TARGET_CMD = $(IL2CPP) \
	--compile-cpp \
	--libil2cpp-static \
	--configuration=Release \
	--platform=MacOSX \
	--architecture=arm64 \
	--dotnetprofile=$(DOTNET_PROFILE) \
	--cachedirectory="$(@D)/" \
	--generatedcppdir="$(<D)" \
	--baselib-directory="$(EDITOR_DIR)/Contents/PlaybackEngines/MacStandaloneSupport/" \
	--outputpath="$@"

# Experimental: BEE backend invocation (disabled by default, uncomment to try)
# BEE_BACKEND := $(IL2CPP_DIR)/build/deploy/bee_backend/mac-arm64/bee_backend
#
# $(BEE_BACKEND) \
#   --stdin-canary \
#   --dagfile="$(@D)/buildstate/bee.dag" \
#   --continue-on-failure \
#   --dagfilejson="$(@D)/buildstate/bee.dag.json" \
#   FinalProgram
