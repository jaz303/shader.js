# shader.js

A simple interface to WebGL shaders. Uses `Object.defineProperty()` to...

## Example

Vertex shader source:

    foo bar baz
    
Fragment shader source:

    foo bar baz
    
shader.js:

    // TODO: show set up of context

    var myshader = shader.compile(gl, vertexShaderSource, fragmentShaderSource);
    
    myshader.myUniform = 10;
    myshader.position.bind(...);
    
    // activate the shader
    myshader.use();

## License

&copy; 2013 Jason Frame [ [@jaz303](http://twitter.com/jaz303) / [jason@onehackoranother.com](mailto:jason@onehackoranother.com) ]  
Released under the MIT License.