

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
let g_tailAngle = 225;
let g_headAngle = 0;
let g_neckAngle = 45;
let g_earAngle = 0;
let howmuchadd = 1.8;
let howmuchsubtract = 0.5;
let animations = false;
var stats = new Stats();
let shiftisdown = false;
let dosecret = false;
let leg1shift = 0;
stats.dom.style.left = "auto";
stats.dom.style.right = "0";
stats.showPanel(0);
document.body.appendChild(stats.dom);
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
 {var body = new Cube();
  body.color = [137/255, 81/255, 41/255, 1.0];
  body.matrix.translate(-.45, -.35, 0.0);
  body.matrix.scale(1, 0.5, 0.5);
  body.render();
 }
 {var leg1 = new Cube();
  leg1.color = [117/255, 61/255, 21/255, 1.0];
  leg1.matrix.translate(-.45, -.85 + leg1shift, 0.0);
  leg1.matrix.scale(0.125, 0.5, 0.125);
  leg1.render();
 }
 {var leg2 = new Cube();
  leg2.color = [117/255, 61/255, 21/255, 1.0];
  leg2.matrix.translate(-.25, -.85 + leg1shift, 0.375);
  leg2.matrix.scale(0.125, 0.5, 0.125);
  leg2.render();
 }
 {var leg3 = new Cube();
  leg3.color = [117/255, 61/255, 21/255, 1.0];
  leg3.matrix.translate(.225, -.85+0.3-leg1shift, 0.0);
  leg3.matrix.scale(0.125, 0.5, 0.125);
  leg3.render();
 }
 {var leg4 = new Cube();
  leg4.color = [117/255, 61/255, 21/255, 1.0];
  leg4.matrix.translate(.425, -.85+0.3-leg1shift, 0.375);
  leg4.matrix.scale(0.125, 0.5, 0.125);
  leg4.render();
 }
 {var tail = new Pyramid();
  tail.color = [0, 0, 0, 1.0];
  tail.matrix.translate(0.5,0,0.15)
  tail.matrix.rotate(g_tailAngle, 0, 0, 1)
  tail.matrix.rotate(160, 0, 0, 1);
  tail.matrix.translate(0, -0.5, 0)
  tail.matrix.scale(0.125, 0.5, 0.125);
  tail.render();
  /*tail.color = [0,0, 0, 1.0];
  tail.matrix.translate(.55, -0.025, 0.1875);
   tail.matrix.rotate(g_tailAngle, 0, 0, 1);
  //tail.matrix.rotate(45, 0, 0, 1);
  tail.matrix.scale(0.125, 0.5, 0.125);
  tail.render();*/
 }
 
 {var neck = new Cube();
  neck.color = [102/255, 60/255, 31/255, 1.0];
  neck.matrix.translate(-.43, 0, 0.1875);
  neck.matrix.rotate(g_neckAngle, 0, 0, 1);
  neck.matrix.scale(0.17, 0.17, 0.17);
  neck.render();
 }
 {var head = new Cube();
  head.color = [137/255, 81/255, 41/255, 1.0]
    //head.matrix.translate(-0.35, 0.17, 0.1875);
  head.matrix.translate(-0.43, 0, 0);
  head.matrix.rotate(g_neckAngle, 0, 0, 1);
  head.matrix.translate(0, 0.17, 0);
  head.matrix.rotate(g_headAngle, 0, 0, 1);
  head.matrix.translate(0, 0.21, 0.1875);
  head.matrix.rotate(180, 0, 0, 1)
  head.matrix.scale(0.35, 0.21, 0.17);
  head.render();
 }
 var test = new Cube();
 test.color = [0,0,0,1];
  //test.render();
 {var ear = new Pyramid();
  ear.color = [196/255, 164/255, 132/255, 1.0]
  ear.matrix.translate(-0.44, 0, 0)
  ear.matrix.rotate(g_neckAngle, 0, 0, 1);
  ear.matrix.translate(0, 0.17, 0);
  ear.matrix.rotate(g_headAngle, 0, 0, 1);
  //ear.matrix.rotate(g_earAngle, 0, 0, 1);
  ear.matrix.translate(0, 0.19, 0);
  ear.matrix.rotate(g_earAngle, 0, 0, 1);
  ear.matrix.translate(-0.05, 0, 0.3);//ALIGNS WITH HOW RECTANGLE WAS, IN TOP LEFT QUADRANT
  ear.matrix.scale(0.05, 0.2, 0.04);
  ear.render();
  var ear2 = new Pyramid();
  ear2.color = [196/255, 164/255, 132/255, 1.0]
  ear2.matrix.translate(-0.44, 0, 0)
  ear2.matrix.rotate(g_neckAngle, 0, 0, 1);
  ear2.matrix.translate(0, 0.17, 0);
  ear2.matrix.rotate(g_headAngle, 0, 0, 1);
  //ear.matrix.rotate(g_earAngle, 0, 0, 1);
  ear2.matrix.translate(0, 0.19, 0);
  ear2.matrix.rotate(g_earAngle, 0, 0, 1);
  ear2.matrix.translate(-0.05, 0, 0.1875);//ALIGNS WITH HOW RECTANGLE WAS, IN TOP LEFT QUADRANT
  ear2.matrix.scale(0.05, 0.2, 0.04);
  ear2.render();
 }
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
  //canvas.onmousemove = function(ev) {if(ev.buttons == 1){click(ev)}}
  // Specify the color for clearing <canvas>
  gl.clearColor(53/255, 81/255, 92/255, 1.0);
  let mode = "up";
  let leg1increase = 0.007;
  tick();
  function tick(){
    {
    if(dosecret == true){
    if((mode == "up") && (g_tailAngle < 330)){
      g_tailAngle = g_tailAngle + howmuchadd;
      howmuchadd -= 0.009;
    }
    if((mode == "up") && (g_tailAngle > 330)){
       howmuchadd = 1.8;
      mode = "down";
    }
    if((mode == "down") && (g_tailAngle > 210)){
      g_tailAngle = g_tailAngle - howmuchsubtract;
      howmuchsubtract += 0.005;
    }
    if((mode == "down") && (g_tailAngle < 210)){
      howmuchsubtract = 0.5;
      mode = "up";
      dosecret = false;
    }
    }
    }
    if(animations){
    leg1shift += leg1increase;
    if((leg1shift > 0.3) && (leg1increase > 0)){
     leg1increase *= -1;
    }
    if((leg1shift < 0) && (leg1increase < 0)){
      leg1increase *= -1;
    }
  }
    stats.begin();
    renderAllShapes();
    stats.end();
    requestAnimationFrame(tick);
  }
}
document.addEventListener("keydown", shiftdown);
document.addEventListener("keyup", shiftup);
function shiftdown(e){
  if(e.code == "ShiftLeft"){
    shiftisdown = true;
    
  }
}
function shiftup(e){
  if(e.code == "ShiftLeft"){
    shiftisdown = false;
  }
}
function click(ev) {
  if(shiftisdown){
    dosecret = true;
  }
}
