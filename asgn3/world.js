

/*




*/
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  attribute vec2 a_UV;
  varying vec2 v_UV;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_GlobalRotateMatrixY;
   uniform mat4 u_ProjectionMatrix;
   uniform mat4 u_ViewMatrix;
   uniform float u_size;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrixY * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = u_size;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    }
    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
      else{
        gl_FragColor = texture2D(u_Sampler1, v_UV);
      }
      
  }`
  /*else if(u_whichTexture == 1){
        gl_FragColor = vec4(0.07, 0.52, 0.06, 1);
      }
      else{
        gl_FragColor = vec4(0.529, 0.808, 0.922, 1);
      }*/
let canvas;
let gl;
let a_Position;
let a_UV;
let u_size;
let u_FragColor;
let u_ModelMatrix;
let u_GlobalRotateMatrix;
let u_GlobalRotateMatrixY;
let u_Sampler0;
let u_Sampler1;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_whichTexture;
let eye = new Vector3([0, 1, 3]);
let at = new Vector3([0,1,0]);
let g_globalXAngle = 0;
let g_globalYAngle = 0;
var stats = new Stats();
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
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
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
  u_GlobalRotateMatrixY = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrixY');
  if (!u_GlobalRotateMatrixY) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrixY');
    return;
  }
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0){
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1){
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture){
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return false;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return false;
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
function initTextures(gl, n){
  var image = new Image();
  if(!image){
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function(){sendTextureToGLSL(gl, n, u_Sampler0, image)};
  image.src = 'grass.png';
  return true;
}
function initTextures2(gl, n){
  var image = new Image();
  if(!image){
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function(){sendTextureToGLSL2(gl, n, u_Sampler1, image)};
  image.src = 'bookshelf.png';
  return true;
}
function sendTextureToGLSL(gl, n, u_Sampler, image){
  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler, 0);
  console.log('finished loadTexture');
}
function sendTextureToGLSL2(gl, n, u_Sampler, image){
  var texture = gl.createTexture();
  if(!texture){
    console.log('Failed to create the texture object');
    return false;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);
  console.log('finished loadTexture');
}
function renderAllShapes(){
  var viewMat = new Matrix4();
  //More means further
  //Keep the third value(out of 9) positive
   { //Don't delete
   viewMat.setLookAt(eye.elements[0],eye.elements[1],eye.elements[2], at.elements[0],at.elements[1],at.elements[2], 0,1,0)
   gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);



   var projMat = new Matrix4();
   projMat.setPerspective(60, canvas.width/canvas.height, .1, 100)
   gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  
  
  
   var globalRotMat= new Matrix4()/*.rotate(g_globalXAngle,0,1,0);*/
  //globalRotMat.rotate(g_globalYAngle,1,0,0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  var globalRotMatY= new Matrix4()/*.rotate(g_globalYAngle,1,0,0);*/
  //
  gl.uniformMatrix4fv(u_GlobalRotateMatrixY, false, globalRotMatY.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);
   }
  var floor = new Cube();
  floor.textureNum = 0;
  floor.matrix.translate(-16, 0, -16);
  floor.matrix.scale(32, 0.01, 32);
  floor.render();
  var skybox = new Cube();
  skybox.color = [0.529, 0.808, 0.922, 1];
  skybox.textureNum = -2;
  skybox.matrix.translate(-16, 0, -16);
  skybox.matrix.scale(32, 32, 32);
  skybox.render();
  {
  createBook(1,0,0);
  createBook(1,1,0);
  createBook(1,0,1);
  createBook(1,1,1);
  createBook(1,1,2);
  createBook(1,0,2);
  } 
  {
  createBook(15,0,10);
  createBook(15,1,10);
  createBook(15,0,11);
  createBook(15,1,11);
  createBook(15,1,12);
  createBook(15,0,12);
  } 
  {
  createBook(15,0,10);
  createBook(15,1,10);
  createBook(15,0,11);
  createBook(15,1,11);
  createBook(15,1,12);
  createBook(15,0,12);
  } 
  createBook(1,0,-14);
  createBook(1,0,-15);
  createBook(-10,0,13);
  createBook(-5,0,5);
   createBook(-13,0,-2);
  //createBook(1,0,-16);

  function createBook(x, y, z){
    var book = new Cube();
    book.textureNum = 1;
    book.matrix.translate(x, y, 0-z);
    book.render();
   }
}
function main() {
  //shapesize = document.getElementById('shapesize');
  setupWebGL();
  connectVariablesToGLSL();
  initTextures(gl,0);
  initTextures2(gl,0);
  canvas.onmousedown = click;
  gl.clearColor(53/255, 81/255, 92/255, 1.0);
  tick();
  function tick(){
    stats.begin();
    renderAllShapes();
    stats.end();
    requestAnimationFrame(tick);
  }
}
document.addEventListener("keydown", whatkey);
let [oldX, oldY] = [null, null];
document.addEventListener("mousemove", function(e) {
  let  mouseX = e.clientX;
  let mouseY = e.clientY;
  if(oldX == null){
    oldX = mouseX;
    oldY = mouseY;
    return;
  }
  let xrot = -1;
  let yrot = -1;
  if(oldX == mouseX){
    xrot = 0;
  }
  if(oldY == mouseY){
    yrot = 0;
  }
  if(mouseX < oldX){
    xrot = 1;
  }
  if(mouseY < oldY){
    yrot = 1;
  }
  rotate(xrot, yrot);
  oldX = mouseX;
  oldY = mouseY;

}
)
function whatkey(e){
  if(e.code == "KeyW"){
      let atclone = new Vector3([at.elements[0], at.elements[1], at.elements[2]]);
      let forward = atclone.sub(eye);
      forward.normalize();
      forward.mul(0.05);
      eye.add(forward);
      at.add(forward);
  }
  if(e.code == "KeyS"){
      let atclone = new Vector3([at.elements[0], at.elements[1], at.elements[2]]);
      let forward = atclone.sub(eye);
      forward.normalize();
      forward.mul(-0.05);
      eye.add(forward);
      at.add(forward);
  }
  if(e.code == "KeyA"){
      let atclone = new Vector3([at.elements[0], at.elements[1], at.elements[2]]);
      let forward = atclone.sub(eye);
      let up = new Vector3([0,1,0]);
      let side = Vector3.cross(forward, up)
      side.normalize();
      side.mul(-0.05);
      eye.add(side);
      at.add(side);
  }
  if(e.code == "KeyD"){
      let atclone = new Vector3([at.elements[0], at.elements[1], at.elements[2]]);
      let forward = atclone.sub(eye);
      let up = new Vector3([0,1,0]);
      let side = Vector3.cross(forward, up)
      side.normalize();
      side.mul(0.05);
      eye.add(side);
      at.add(side);
  }
  if(e.code == "KeyQ"){
    rotate(1, 0);
  }
  if(e.code == "KeyE"){
    rotate(-1, 0);
  }
}
function rotate(degside, degup){
   let atclone = new Vector3([at.elements[0], at.elements[1], at.elements[2]]);
    let eyeclone = new Vector3([eye.elements[0], eye.elements[1], eye.elements[2]]);
    let forward = atclone.sub(eye);
    let rmatrix = new Matrix4();
    rmatrix.setRotate(degside, 0, 1, 0);
    let forward2 = rmatrix.multiplyVector3(forward);
    let rmatrix2 = new Matrix4();
    rmatrix2.setRotate(degup, 1, 0, 0)
    let forward3 = rmatrix2.multiplyVector3(forward2);
    eyeclone.add(forward3);
    at = eyeclone;
}
function click(ev) {

}
