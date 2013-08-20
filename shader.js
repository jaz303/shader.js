function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw "shader compile error: " + gl.getShaderInfoLog(shader);
  
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  try {
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw "shader link error: " + gl.getProgramInfoLog(program);
  } catch (e) {
    gl.deleteProgram(program);
    throw e;
  }
  
  return program;
}

function setter(u) {
  return 'set' + u[0].toUpperCase() + u.substring(1);
}

//
// Uniforms

function u_int(obj, gl, i, u) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform1iv(i, v); }
  });
  obj[setter(u)] = function(x) { gl.uniform1i(i, x); };
}

function u_intVec2(obj, gl, i) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform2iv(i, v); }
  });
  obj[setter(u)] = function(x, y) { gl.uniform2i(i, x, y); };
}

function u_intVec3(obj, gl, i) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform3iv(i, v); }
  });
  obj[setter(u)] = function(x, y, z) { gl.uniform3i(i, x, y, z); };
}

function u_intVec4(obj, gl, i) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform4iv(i, v); }
  });
  obj[setter(u)] = function(x, y, z, w) { gl.uniform4i(i, x, y, z, w); };
}

function u_float(obj, gl, i, u) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform1fv(i, v); }
  });
  obj[setter(u)] = function(x) { gl.uniform1f(i, x); };
}

function u_floatVec2(obj, gl, i) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform2fv(i, v); }
  });
  obj[setter(u)] = function(x, y) { gl.uniform2f(i, x, y); };
}

function u_floatVec3(obj, gl, i) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform3fv(i, v); }
  });
  obj[setter(u)] = function(x, y, z) { gl.uniform3f(i, x, y, z); };
}

function u_floatVec4(obj, gl, i) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniform4fv(i, v); }
  });
  obj[setter(u)] = function(x, y, z, w) { gl.uniform4f(i, x, y, z, w); };
}

function u_mat2(obj, gl, i, u) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniformMatrix2fv(i, false, v); }
  });
}

function u_mat3(obj, gl, i, u) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniformMatrix3fv(i, false, v); }
  });
}

function u_mat4(obj, gl, i, u) {
  Object.defineProperty(obj, u.name, {
    get: function() { /* TODO */ },
    set: function(v) { gl.uniformMatrix4fv(i, false, v); }
  });
}

//
// Attributes

// TODO: support gl.vertexAttribnf
function attrib(obj, gl, i, a) {
  obj[a.name] = {
    pointer: function(size, type, normalized, stride, offset) {
      return gl.vertexAttribPointer(i,
                                    size,
                                    type || gl.FLOAT,
                                    normalized ? gl.TRUE : gl.FALSE,
                                    stride || 0,
                                    offset || 0);
    },
    enable: function() {
      return gl.enableVertexAttribArray(i);
    },
    disable: function() {
      return gl.disableVertexAttribArray(i);
    },
    location: i
  }
}

//
//

function augmentProgram(gl, program) {
  var obj = {
    gl      : gl,
    program : program,
    use     : function() { return gl.useProgram(program); }
  };
  
  var uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (var i = 0; i < uniformCount; ++i) {
    var u   = gl.getActiveUniform(program, i),
        loc = gl.getUniformLocation(program, u.name);
        
    switch (u.type) {
      case gl.INT           : u_int(obj, gl, loc, u); break;
      case gl.INT_VEC2      : u_intVec2(obj, gl, loc, u); break;
      case gl.INT_VEC3      : u_intVec3(obj, gl, loc, u); break;
      case gl.INT_VEC4      : u_intVec4(obj, gl, loc, u); break;
      case gl.FLOAT         : u_float(obj, gl, loc, u); break;
      case gl.FLOAT_VEC2    : u_floatVec2(obj, gl, loc, u); break;
      case gl.FLOAT_VEC3    : u_floatVec3(obj, gl, loc, u); break;
      case gl.FLOAT_VEC4    : u_floatVec4(obj, gl, loc, u); break;
      case gl.FLOAT_MAT2    : u_mat2(obj, gl, loc, u); break;
      case gl.FLOAT_MAT3    : u_mat3(obj, gl, loc, u); break;
      case gl.FLOAT_MAT4    : u_mat4(obj, gl, loc, u); break;
      case gl.SAMPLER_2D    : u_float(obj, gl, loc, u); break;
      case gl.SAMPLER_CUBE  : u_float(obj, gl, loc, u); break;
      default               : throw "what is this?";
    }
  }
  
  var attributeCount = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
  for (var i = 0; i < attributeCount; ++i) {
    var a = gl.getActiveAttrib(program, i);
    attrib(obj, gl, gl.getAttribLocation(program, a.name), a);
  }
  
  return obj;
}

function compile(gl, vertexSource, fragmentSource) {
  var vs = null, fs = null, p = null;
  
  try {
    vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  } catch (e) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    throw e;
  }
  
  return link(gl, vs, fs);
}

function link(gl, vertexShader, fragmentShader) {
  return augmentProgram(gl, createProgram(gl, vertexShader, fragmentShader));
}

exports.compile = compile;
exports.link = link;