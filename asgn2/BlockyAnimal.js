/*




*/
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform float u_size;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let shapesize;
let red;
let green;
let blue;
let curshape;
let segcount;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let g_globalAngle = 0;
function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById("webgl", { preserveDrawingBuffer: true});

  // Get the rendering context for WebGL
  gl = canvas.getContext('webgl');
  gl.enable(gl.DEPTH_TEST);
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
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
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
function renderAllShapes(){
  var globalRotMat= new Matrix4().rotate(g_globalAngle,0,1,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
  /*var len = g_shapelist.length;
  for(var i = 0; i < len; i++) {
    g_shapelist[i].render();
  }*/
 var body = new Cube();
 body.color = [1.0, 0.0, 0.0, 1.0];
 body.matrix.translate(-.25, -.5, 0.0);
 body.matrix.scale(0.5, 1, 0.5);
 body.render();
 var leftArm = new Cube();
 leftArm.color = [1, 1, 0, 1];
 leftArm.matrix.translate(.7, 0, 0.0);
 leftArm.matrix.rotate(45, 0, 0, 1);
 leftArm.matrix.scale(0.25, .7, .5);
 leftArm.render();
}
function clearCanvas(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapelist= [];
}
function setshape(whatshape){
  curshape = whatshape;
}
function main() {
  curshape = "square";
  red = document.getElementById('red');
  green = document.getElementById('green');
  blue = document.getElementById('blue');
  shapesize = document.getElementById('shapesize');
  segcount = document.getElementById('segcount');
  setupWebGL();
  connectVariablesToGLSL();
  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) {if(ev.buttons == 1){click(ev)}}
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  renderAllShapes();
}
//var g_shapelist = [];
function click(ev) {
  [x, y] = convertCoordinatesEventToGL(ev);
  let newshape;
  if(curshape == "square"){
    newshape = new Point();
    newshape.position = [x, y];
    newshape.color = [red.value/255, green.value/255, blue.value/255, 1.0];
    newshape.size = shapesize.value;
    g_shapelist.push(newshape);
  }
  else if(curshape == "triangle"){
    newshape = new Triangle();
    newshape.position = [x,y];
    newshape.size=shapesize.value;
    let d = newshape.size/200;
    newshape.coordinates = [x, y, x+d, y, x, y+d]
    newshape.color = [red.value/255, green.value/255, blue.value/255, 1.0];
    g_shapelist.push(newshape);
  }
  else if(curshape == "circle"){
    newshape = new Circle();
    newshape.position = [x,y];
    newshape.segments = segcount.value;
    newshape.size=shapesize.value;
    newshape.color = [red.value/255, green.value/255, blue.value/255, 1.0];
    g_shapelist.push(newshape);
  }
  renderAllShapes();
}
