DEST_DIR=./Assets/www/
ORIG_DIR=./Dev/

compile:
	@ echo "Compiling..."
	@ mkdir -p $(DEST_DIR)
	@ cp -R "$(ORIG_DIR)css" "$(ORIG_DIR)images" "$(ORIG_DIR)js" "$(DEST_DIR)"
	@ bash ./script_compile $(ORIG_DIR) $(DEST_DIR) 

clean:
	@ echo "Cleaning up..."
	rm -fr $(DEST_DIR)
