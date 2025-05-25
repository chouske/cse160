

/*




*/
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
   attribute vec3 a_Normal;
   varying vec2 v_UV;
   attribute vec2 a_UV;
   varying vec3 v_Normal;
   varying vec4 v_VertPos;
   uniform mat4 u_ModelMatrix;
   uniform mat4 u_GlobalRotateMatrix;
   uniform mat4 u_ProjectionMatrix;
   uniform mat4 u_ViewMatrix;
   uniform mat4 u_NormalMatrix;
   uniform float u_size;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    gl_PointSize = u_size;
    v_UV = a_UV;
    //v_Normal = a_Normal;
    v_Normal = normalize(vec3(u_NormalMatrix * vec4(a_Normal, 1)));
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  varying vec3 v_Normal;
  uniform int u_shownormal;
  uniform vec3 u_lightPos;
  uniform int u_lightOn;
  varying vec4 v_VertPos;
  uniform vec3 u_cameraPos;
  void main() {
    if(u_shownormal == 0){
      gl_FragColor = u_FragColor;
    }
    if(u_shownormal == 1){
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    }
       vec3 lightVector = u_lightPos - vec3(v_VertPos);
       float r=length(lightVector);
      // if(r<1.0){
      //   gl_FragColor = vec4(1,0,0,1);
      // }
      // else if(r<2.0){
      //   gl_FragColor = vec4(0,1,0,1);
      // }
      //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);
      vec3 L = normalize(lightVector);
      vec3 N = normalize(v_Normal);
      float nDotL = max(dot(N, L), 0.0);
      vec3 R = reflect(- L, N);
      vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
      float specular = pow(max(dot(E,R), 0.0), 10.0);

      vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
      vec3 ambient = vec3(gl_FragColor) * 0.3;
      if(u_lightOn == 1){
      gl_FragColor = gl_FragColor * nDotL;
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      //gl_FragColor.a = 1.0;
      }
      
  }`
let canvas;
let gl;
let a_Position;
let a_Normal;
let a_UV;
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
let u_lightPos;
let u_cameraPos;
let u_lightOn;
let g_globalAngle = 0;
let g_globalAngleY = 0;
let g_lightX = 0;
let g_lightY = 0;
let g_lightZ = 0;
let g_headAngle = 0;
let g_neckAngle = 45;
let u_shownormal;
let u_ProjectionMatrix;
let u_ViewMatrix;
let movinglight = false;
let eye = new Vector3([0, 0, 1.5]);
let at = new Vector3([0,0,0]);
let normalon = 0;
let lighton = 1;
let u_NormalMatrix;
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
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if(a_Normal < 0){
    console.log('Failed to get the storage location of a_Normal');
    return;
  }
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if(!u_ProjectionMatrix){
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return false;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if(!u_ViewMatrix){
    console.log('Failed to get the storage location of u_ViewMatrix');
    return false;
  }
  u_shownormal = gl.getUniformLocation(gl.program, 'u_shownormal');
  if(!u_shownormal){
    console.log('Failed to get the storage location of u_shownormal');
    return false;
  }
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if(!u_lightPos){
    console.log('Failed to get the storage location of u_lightPos');
    return false;
  }
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if(!u_cameraPos){
    console.log('Failed to get the storage location of u_cameraPos');
    return false;
  }
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if(!u_lightOn){
    console.log('Failed to get the storage location of u_lightOn');
    return false;
  }
  u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  if(!u_NormalMatrix){
    console.log('Failed to get the storage location of u_NormalMatrix');
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
function renderAllShapes(){
   var viewMat = new Matrix4();
   viewMat.setLookAt(eye.elements[0],eye.elements[1],eye.elements[2], at.elements[0],at.elements[1],at.elements[2], 0,1,0)
   gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
   var projMat = new Matrix4();
   projMat.setPerspective(90, canvas.width/canvas.height, .1, 100)
   gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  var globalRotMat= new Matrix4().rotate(g_globalAngle,0,1,0);
  globalRotMat.rotate(g_globalAngleY, 1, 0, 0)
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT);




  gl.uniform1i(u_lightOn, lighton);
  gl.uniform1i(u_shownormal, 0);
  gl.uniform3f(u_lightPos, g_lightX/100, g_lightY/100, g_lightZ/100);
  gl.uniform3f(u_cameraPos, 0, 0, 1.5); //Eye's values
  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightX/100, g_lightY/100, g_lightZ/100);
  light.matrix.scale(-.1, -.1, -.1);
  light.matrix.translate(-0.5, -0.5, -0.5)
  light.render();
  gl.uniform1i(u_shownormal, normalon);
  var box = new Cube();
  box.color = [0,1,1,1];
  box.matrix.scale(-5,-5,-5);
  box.matrix.translate(-0.5, -0.5, -0.5)
  box.render();
  var sphere = new Sphere();
  sphere.matrix.translate(-1, -1, -1);
  sphere.render();

  {var body = new Cube();
  body.matrix.translate(0.5, 0, -1);
  body.color = [137/255, 81/255, 41/255, 1.0];
  body.matrix.translate(-.45, -.35, 0.0);
  body.matrix.scale(1, 0.5, 0.5);
  body.render();
 }
 {var leg1 = new Cube();
  leg1.matrix.translate(0.5, 0, -1);
  leg1.color = [117/255, 61/255, 21/255, 1.0];
  leg1.matrix.translate(-.45, -.85, 0.0);
  leg1.matrix.scale(0.125, 0.5, 0.125);
  leg1.render();
 }
 {var leg2 = new Cube();
  leg2.matrix.translate(0.5, 0, -1);
  leg2.color = [117/255, 61/255, 21/255, 1.0];
  leg2.matrix.translate(-.25, -.85 , 0.375);
  leg2.matrix.scale(0.125, 0.5, 0.125);
  leg2.render();
 }
 {var leg3 = new Cube();
  leg3.matrix.translate(0.5, 0, -1);
  leg3.color = [117/255, 61/255, 21/255, 1.0];
  leg3.matrix.translate(.225, -.85, 0.0);
  leg3.matrix.scale(0.125, 0.5, 0.125);
  leg3.render();
 }
 {var leg4 = new Cube();
  leg4.matrix.translate(0.5, 0, -1);
  leg4.color = [117/255, 61/255, 21/255, 1.0];
  leg4.matrix.translate(.425, -.85, 0.375);
  leg4.matrix.scale(0.125, 0.5, 0.125);
  leg4.render();
 }
 {var neck = new Cube();
  neck.matrix.translate(0.5, 0, -1);
  neck.color = [102/255, 60/255, 31/255, 1.0];
  neck.matrix.translate(-.43, 0, 0.1875);
  neck.matrix.rotate(g_neckAngle, 0, 0, 1);
  neck.matrix.scale(0.17, 0.17, 0.17);
  neck.normalMatrix.setInverseOf(neck.matrix).transpose();
  neck.render();
 }
 {var head = new Cube();
  head.matrix.translate(0.5, 0, -1);
  head.color = [137/255, 81/255, 41/255, 1.0]
    //head.matrix.translate(-0.35, 0.17, 0.1875);
  
  head.matrix.translate(-0.43, 0, 0);
  head.matrix.rotate(g_neckAngle, 0, 0, 1);
  head.matrix.translate(0, 0.17, 0);
  head.matrix.rotate(g_headAngle, 0, 0, 1);
  head.matrix.translate(0, 0.21, 0.1875);
  head.matrix.rotate(180, 0, 0, 1)
  head.matrix.scale(0.35, 0.21, 0.17);
  
  //new stuff
  head.matrix.translate(1, 1, 0);
  head.matrix.rotate(180,0,0,1);
  head.normalMatrix.setInverseOf(head.matrix).transpose();
  head.render();
 }



}
function main() {
  curshape = "square";
  setupWebGL();
  connectVariablesToGLSL();
  gl.clearColor(0/255, 128/255, 128/255, 1.0);
  let timeadd = 1;

  tick();
  function tick(){
    {
    }
    stats.begin();
    renderAllShapes();
    if(movinglight){
    g_lightX = parseFloat(g_lightX)+timeadd;
    
    if(g_lightX > 50){
      g_lightX = 50;
      timeadd = -1;
    }
    if(g_lightX < -50){
      g_lightX = -50;
      timeadd = 1;
    }
  }
    stats.end();
    requestAnimationFrame(tick);
  }
}
