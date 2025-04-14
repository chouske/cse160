/*




*/
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
let shapesize;
let red;
let green;
let blue;
let curshape;
let segcount;
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
function renderAllShapes(){
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
  var len = g_shapelist.length;
  for(var i = 0; i < len; i++) {
    g_shapelist[i].render();
  }
}
function clearCanvas(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapelist= [];
}
function setshape(whatshape){
  curshape = whatshape;
}
function customdrawing(){
  //Legs
  createtriangle(-.4, -.4, -.3, 0, -.4, 0, 101, 67, 33, 10)
  createtriangle(-.4, -.4, -.3, -.4, -.3, 0, 196, 164, 132, 10)
  createtriangle(-.3, -.4, -.2, 0, -.3, 0, 101, 67, 33, 10)
  createtriangle(-.3, -.4, -.2, -.4, -.2, 0, 196, 164, 132, 10)
  createtriangle(.1, -.4, .2, 0, .1, 0, 101, 67, 33, 10)
  createtriangle(.1, -.4, .2, -.4, .2, 0, 196, 164, 132, 10)
  createtriangle(.2, -.4, .3, 0, .2, 0, 101, 67, 33, 10)
  createtriangle(.2, -.4, .3, -.4, .3, 0, 196, 164, 132, 10)
  //Body
  createtriangle(-.4, 0, .3, .2, -.4, .2, 101, 67, 33, 10)
  createtriangle(-.4, 0, .3, 0, .3, .2, 196, 164, 132, 10)
  //Tail
  createtriangle(.3, .2, .4, .1, .4, .2, 101, 67, 33, 10)
  createtriangle(.4, .1, .5, .1, .4, .2, 101, 67, 33, 10)
  createtriangle(.5, .1, .6, 0, .6, .1, 196, 164, 132, 10)
  createtriangle(.6, 0, .7, 0, .6, .1, 196, 164, 132, 10)
  //Head
  createtriangle(-.6, .2, -.3, .2, -.3, .5, 101, 67, 33, 10)
  createtriangle(-.6, .2, -.3, .5, -.6, .5, 101, 67, 33, 10)
  //Horns
  createtriangle(-.7, .4, -.6, .4, -.6, .6, 196, 164, 132, 10)
  createtriangle(-.7, .4, -.6, .6, -.7, .6, 196, 164, 132, 10)
  createtriangle(-.3, .4, -.2, .4, -.2, .6, 196, 164, 132, 10)
  createtriangle(-.3, .4, -.2, .6, -.3, .6, 196, 164, 132, 10)
  //
  createtriangle(-.6, .4, -.5, .3, -.5, .4, 0, 0, 0, 10)
  createtriangle(-.4, .3, -.3, .4, -.4, .4, 0, 0, 0, 10)
  renderAllShapes();
}
function createtriangle(x1, y1, x2, y2, x3, y3,r, g, b, size){
    let newshape = new Triangle();
    newshape.coordinates = [x1, y1, x2, y2, x3, y3];
    //newshape.size=shapesize.value;
    newshape.color = [r/255, g/255, b/255, 1.0];
    g_shapelist.push(newshape);
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
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) {if(ev.buttons == 1){click(ev)}}
  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}
var g_shapelist = [];
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
  else{
    newshape = new Circle();
    newshape.position = [x,y];
    newshape.segments = segcount.value;
    newshape.size=shapesize.value;
    newshape.color = [red.value/255, green.value/255, blue.value/255, 1.0];
    g_shapelist.push(newshape);
  }
  renderAllShapes();
}
