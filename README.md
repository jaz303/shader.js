# shayda

A simple interface to WebGL shaders which uses a proxy object to provide direct, efficient access to a program's uniforms and attributes; an intuitive API that does not sacrifice performance.

## Installation

Browserify is recommended.

    $ npm install shayda

## API

Let's assuming the following vertex shader source:

    attribute vec3 aVertexPosition;

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
    
And a very simple fragment shader:

    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
    
### Compiling

To compile the shader sources into a program, use `shayda.compile()`:

    // gl is the context object returned from canvas.getContext("webgl")
    var program = shayda.compile(gl, vertexShaderSource, fragmentShaderSource);
    
This method will throw an error on failure, and return a shader object on success. As well as references to the underlying GL context and program, this object is augmented with properties that enable attributes and uniforms to be manipulated directly by name - there's no longer any need to use unwieldy combinations of functions such as `getUniformLocation` and `uniformMatrix4fv`.

### Program Activation

To activate the compiled program, call its `use()` method:

    program.use();
    
### Direct uniform assignment

The shader object has a setter defined for each uniform. Where once you would write:

    var pUniform = gl.getUniformLocation(prog, "uPMatrix");
    gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));
    
You can now simply do:

    program.uPMatrix = new Float32Array(perspectiveMatrix.flatten());

Is that clean or what?

For consistency, all setters are currently mapped to the array-consuming (i.e. `v`-suffixed) variants of the GL functions such as `gl.uniform1iv`, `gl.uniform3iv` and `gl.uniform4fv`. For vector uniforms you also get methods of the form `setX(x, y, z, w)` - wherein `X` is the name of the uniform with the first character uppercased - which receive an argument for each component of the vector.

    // The following two lines are equivalent
    program.lightPosition = new Float32Array([1.0, 2.0, 3.0]);
    program.setLightPosition(1.0, 2.0, 3.0);

### Attributes

Attributes also get a couple of helper methods. Firstly, to enable/disable vertex attribute arrays:

    program.aVertexPosition.enable();
    program.aVertexPosition.disable();
    
And to set the attribute from the currently bound buffer (the arguments are the same as the last 5 to the standard `gl.vertexAttribPointer()` call):
    
    program.aVertexPosition.pointer(3, gl.FLOAT, false, 0, 0);
    
## Demo

A very simple demo, based on Mozilla's [Getting started with WebGL](https://developer.mozilla.org/en-US/docs/Web/WebGL/Getting_started_with_WebGL), can be found in the `demo` directory. The commented lines therein show `shayda` in operation.

## TODO

  * Support samplers

## License

&copy; 2013 Jason Frame [ [@jaz303](http://twitter.com/jaz303) / [jason@onehackoranother.com](mailto:jason@onehackoranother.com) ]  
Released under the MIT License.