/*


      I used chatGPT just as a refresher for javascript basics and clarification on vectors but not for any code here

*/
// DrawRectangle.js
   var ctx;
   function main() {
    // Retrieve <canvas> element                                  <- (1)
     var canvas = document.getElementById('example');
     if (!canvas) {
       console.log('Failed to retrieve the <canvas> element');
       return;
     }

   // Get the rendering context for 2DCG                          <- (2)
   ctx = canvas.getContext('2d');
   ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
   ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

   var v1 = new Vector3([2.25, 2.25, 0]);
   drawVector(v1, "red");
   }
   function drawVector(v, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(200, 200)
    ctx.lineTo(200 + (v.elements[0]*20), 200 - (v.elements[1]*20));
    ctx.stroke();
   }
   function handleDrawEvent(){
      ctx.clearRect(0, 0, 400, 400)
      ctx.fillRect(0, 0, 400, 400);
      var v1xinput = document.getElementById('v1xinput');
      var v1yinput = document.getElementById('v1yinput');
      var v2xinput = document.getElementById('v2xinput');
      var v2yinput = document.getElementById('v2yinput');
      var v1 = new Vector3([v1xinput.value, v1yinput.value, 0])
      var v2 = new Vector3([v2xinput.value, v2yinput.value, 0])
      drawVector(v1, "red");
      drawVector(v2, "blue");
      //v1.add(v2);
      //drawVector(v1, "green");
   }
   function angleBetween(v1, v2){
    let mydot = Vector3.dot(v1, v2);
    let myangle = Math.acos(mydot/(v1.magnitude()*v2.magnitude()))*180/(Math.PI);
    return myangle;
   }
   function areaTriangle(v1, v2){
      let mycrossvector = Vector3.cross(v1, v2);
      return mycrossvector.magnitude()/2;

   }
   function handleDrawOperationEvent(){
    //ctx.clearRect(0, 0, 400, 400)
    //ctx.fillRect(0, 0, 400, 400);
    handleDrawEvent();
    var v1xinput = document.getElementById('v1xinput');
    var v1yinput = document.getElementById('v1yinput');
    var v2xinput = document.getElementById('v2xinput');
    var v2yinput = document.getElementById('v2yinput');
    var scalar = document.getElementById('scalar');
    var operations = document.getElementById('operations');
    var v1 = new Vector3([v1xinput.value, v1yinput.value, 0])
    var v2 = new Vector3([v2xinput.value, v2yinput.value, 0])
    //drawVector(v1, "red"); Alreayd called above
    //drawVector(v2, "blue");
    if(operations.value == "add"){
      v1.add(v2);
      drawVector(v1, "green");
    }
    else if(operations.value == "sub"){
      v1.sub(v2);
      drawVector(v1, "green");
    }
    else if(operations.value == "mul"){
      v1.mul(scalar.value);
      drawVector(v1, "green");
      v2.mul(scalar.value);
      drawVector(v2, "green");
    }
    else if(operations.value == "div"){
      v1.div(scalar.value);
      drawVector(v1, "green");
      v2.div(scalar.value);
      drawVector(v2, "green");
    }
    else if(operations.value == "mag"){
        console.log("Magnitude v1: " + v1.magnitude());
        console.log("Magnitude v2: " + v2.magnitude());
    }
    else if(operations.value == "nor"){
      v1.normalize(scalar.value);
      drawVector(v1, "green");
      v2.normalize(scalar.value);
      drawVector(v2, "green");
    }
    else if(operations.value == "ang"){
      let myangle = angleBetween(v1, v2);
      console.log("Angle: " + myangle);
    }
    else if(operations.value == "area"){
      let myarea = areaTriangle(v1, v2);
      console.log("Area of the triangle: " + myarea);
    }
    
    

 }
   