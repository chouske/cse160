class Sphere{
    constructor(){
        this.type="sphere";
        this.position = [0.0, 0.0, 0.0];
        this.color=[1.0,1.0,1.0,1.0];
        this.matrix = new Matrix4();
    }
    render(){
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        var d=Math.PI/10;
        var dd=Math.PI/10;
        for(var t=0; t<Math.PI; t+=d){
            for(var r=0; r <(2*Math.PI); r += d){
                var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
                var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t+dd)];
                var p3 = [Math.sin(t)*Math.cos(r+dd), Math.sin(t)*Math.sin(r+dd), Math.cos(t)];
                var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];
                var v = [];
                var uv = []
                v=v.concat(p1); uv=uv.concat([0,0]);
                v=v.concat(p2); uv=uv.concat([0,0]);
                v=v.concat(p4); uv = uv.concat([0,0]);
                gl.uniform4f(u_FragColor, 1, 1, 1, 1);
                drawTriangle3Dnormal(v, v, uv);
                var v = [];
                var uv = []
                v=v.concat(p1); uv=uv.concat([0,0]);
                v=v.concat(p4); uv=uv.concat([0,0]);
                v=v.concat(p3); uv = uv.concat([0,0]);
                gl.uniform4f(u_FragColor, 1, 1, 0, 1);
                drawTriangle3Dnormal(v, v, uv);
            }   
        }
    }



}