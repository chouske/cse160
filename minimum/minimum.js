var VSHADER_SOURCE =
  `attribute vec4 a_Position;
   uniform float u_size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_size;
  }`

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`
  let canvas;
let gl;
let a_Position;
let u_size;
let u_FragColor;
function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById("webgl", { preserveDrawingBuffer: true});
  
    // Get the rendering context for WebGL
    gl = canvas.getContext('webgl');
    //gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
}
function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }
  
    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get the storage location of a_Position');
      return;
    }
    u_size = gl.getUniformLocation(gl.program, 'u_size');
    if (u_size < 0) {
      console.log('Failed to get the storage location of u_size');
      return;
    }
    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
      console.log('Failed to get the storage location of u_FragColor');
      return;
    }
}
function convertCoordinatesEventToGL(ev){
var x = ev.clientX; // x coordinate of a mouse pointer
var y = ev.clientY; // y coordinate of a mouse pointer
var rect = ev.target.getBoundingClientRect();

x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
return([x, y]);
}
function main(){
    setupWebGL();
    connectVariablesToGLSL();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Create point;
    gl.disableVertexAttribArray(a_Position);
    gl.vertexAttrib3f(a_Position, 0.5, 0.5, 0.0)
    gl.uniform1f(u_size, 50.0);
    gl.uniform4f(u_FragColor, 0.0, 1.0, 0.0, 1.0);
    gl.drawArrays(gl.POINTS, 0, 1);
}