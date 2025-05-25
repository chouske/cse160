class Cube{
    constructor(){
        this.type="cube";
        this.position = [0.0, 0.0, 0.0];
        this.color=[1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
        this.normalMatrix = new Matrix4();
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
       gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        gl.uniformMatrix4fv(u_NormalMatrix, false, this.normalMatrix.elements);
       drawTriangle3Dnormal([0,0,0, 1,1,0, 1,0,0], [0,0,-1, 0,0,-1, 0,0,-1], [0,0,1,1,1,0]);
       drawTriangle3Dnormal([0,0,0, 0,1,0, 1,1,0], [0,0,-1, 0,0,-1, 0,0,-1], [0,0,0,1,1,1]);
      // gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
       drawTriangle3Dnormal([0,1,0, 0,1,1, 1,1,1], [0,1,0, 0,1,0, 0,1,0], [0,0, 0,1, 1,1]);
       drawTriangle3Dnormal([0,1,0, 1,1,1, 1,1,0], [0,1,0, 0,1,0, 0,1,0], [0,0, 1,1, 1,0]);
       //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
       drawTriangle3Dnormal([1,0,0, 1,1,0, 1,1,1], [1,0,0, 1,0,0, 1,0,0], [0,0,0,1,1,1]);
       drawTriangle3Dnormal([1,0,0, 1,1,1, 1,0,1], [1,0,0, 1,0,0, 1,0,0], [0,0, 1,1, 1,0]);
       //7 and 8
       //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
       drawTriangle3Dnormal([0,0,0, 0,0,1, 1,0,1], [0,-1,0,0,-1,0, 0,-1,0], [0,0,0,1,1,1]);
       drawTriangle3Dnormal([0,0,0, 1,0,1, 1,0,0], [0,-1,0,0,-1,0, 0,-1,0], [0,0,1,1,1,0]);
       //9 and 10
       //gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
       drawTriangle3Dnormal([0,0,0, 0,1,0, 0,1,1], [-1,0,0,-1,0,0, -1,0,0], [0,0,0,1,1,1]); //Left

       drawTriangle3Dnormal([0,0,0, 0,1,1, 0,0,1], [-1,0,0,-1,0,0, -1,0,0], [0,0,1,1,1,0]);
       //11 and 12
       //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
       drawTriangle3Dnormal([0,0,1, 0,1,1, 1,1,1], [0,0,1,0,0,1, 0,0,1], [0,0,1,1,0,1]); //Forward
       drawTriangle3Dnormal([0,0,1, 1,1,1, 1,0,1], [0,0,1,0,0,1, 0,0,1], [0,0,1,0,1,1]);
    }



}