class Point{
    constructor(){
      this.type="point";
      this.position = [0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
    }
    render(){
      gl.disableVertexAttribArray(a_Position);
      //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([this.position[0], this.position[1]]), gl.DYNAMIC_DRAW);
      gl.vertexAttrib3f(a_Position, this.position[0], this.position[1], 0.0);
      gl.uniform1f(u_size, this.size);
      gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  }