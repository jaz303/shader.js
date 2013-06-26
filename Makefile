shader.min.js: shader.js
	./node_modules/uglify-js/bin/uglifyjs shader.js > shader.min.js
	
clean:
	rm -rf shader.min.js
	
.PHONY: clean