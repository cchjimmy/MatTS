(function () {
  const numberOfObjects = 1000;
  const resolution = [400, 400];
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const pos =Mat.multM(Mat.random(numberOfObjects, 2), Mat.matrix([resolution[0], 0], [0, resolution[1]]));
  const ang = new Array(numberOfObjects);
  const scale = Mat.random(numberOfObjects, 2);
  const maxSize = 50;
  const vel = Mat.empty(numberOfObjects, 2);
  const shape = Mat.matrix(
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5]
  );

  main();

  function main() {
    canvas.width = resolution[0];
    canvas.height = resolution[1];

    Mat.multS(scale, maxSize);

    for (let i = 0; i < numberOfObjects; i++) {
      vel[i][0] = Math.random() - 0.5;
      vel[i][1] = Math.random() - 0.5;
      ang[i] = Math.random();
    }

    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, resolution[0], resolution[1]);
    Mat.add(pos, vel);
    for (let i = 0; i < pos.length; i++) {
      if (pos[i][0] < 0 || pos[i][0] > resolution[0]) 
        vel[i][0] *= -1;
      
      if (pos[i][1] < 0 || pos[i][1] > resolution[1]) 
        vel[i][1] *= -1;
      
    }
    batchShapeDraw(numberOfObjects, shape, pos, ang, scale);
    requestAnimationFrame(loop);
  }

  function batchShapeDraw(numberOfObjects: number, shape: number[][], pos: number[][], ang: number[], scale: number[][], color: string = "black", fill: boolean = false): void {
    ctx.save();
    fill ? ctx.fillStyle = color : ctx.strokeStyle = color;
    ctx.beginPath();
    for (let i = 0; i < numberOfObjects; i++) {
      let c = Math.cos(ang[i]);
      let s = Math.sin(ang[i]);
      let rot = Mat.matrix(
        [c, -s],
        [s, c]
      );
      let transform = Mat.multM(rot, Mat.matrix([scale[i][0], 0], [0, scale[i][1]]));
      let transformed = Mat.multM(shape, Mat.transpose(transform));
      for (let j = 0; j < transformed.length; j++) {
        transformed[j][0] += pos[i][0];
        transformed[j][1] += pos[i][1];
      }
      ctx.moveTo(transformed[0][0], transformed[0][1]);
      for (let j = 1; j < transformed.length; j++) {
        ctx.lineTo(transformed[j][0], transformed[j][1]);
      }
      ctx.lineTo(transformed[0][0], transformed[0][1]);
    }
    fill ? ctx.fill() : ctx.stroke();
    ctx.restore();
  }
}());
