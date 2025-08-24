MONOBL_DIR = $(EDITOR_DIR)/Contents/Frameworks/MonoBleedingEdge

$(EDITOR_DIR):
	@ $(ECHO) downloading editor...
	@ $(CURL) https://download.unity3d.com/download_unity/960ebf59018a/MacEditorInstaller/Unity-5.3.5f1.pkg -o editor.pkg

	@ $(ECHO) extracting editor...
	@ pkgutil --expand editor.pkg tmp
	@ cd tmp && cat Unity.pkg.tmp/Payload | gunzip -dc | cpio -i -f 'Unity/MonoDevelop*' && cd ..
	@ mv tmp/Unity/Unity.app Editor

	@ rm -rf tmp
	@ rm editor.pkg
	@ touch -m Editor
