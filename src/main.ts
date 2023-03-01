(function () {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const numberOfObjects = 500;
  const resolution = [400, 400];
  const maxSize = 50;
  const shape = generateStar();
  const pos = Mat.multM(Mat.random(numberOfObjects, 2), [[resolution[0], 0], [0, resolution[1]]]);
  const ang = new Array(numberOfObjects);
  const scale = Mat.random(numberOfObjects, 2);
  const vel = Mat.random(numberOfObjects, 2);

  main();

  function main() {
    canvas.width = resolution[0];
    canvas.height = resolution[1];
    Mat.multS(scale, maxSize);
    Mat.subS(vel, 0.5);

    for (let i = 0; i < numberOfObjects; i++) {
      ang[i] = Math.random() * Math.PI * 2;
    }

    loop();
  }

  function loop() {
    ctx.clearRect(0, 0, resolution[0], resolution[1]);
    Mat.addM(pos, vel);
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
      let rot = [
        [c, -s],
        [s, c]
      ];
      let transform = Mat.multM(rot, [[scale[i][0], 0], [0, scale[i][1]]]);
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

  function generateStar(numberOfSpikes: number = 5, R_out: number = 1, R_in: number = 0.5): number[][] {
    let dR = Math.PI * 2 / (numberOfSpikes * 2);
    let vertices: number[][] = new Array(numberOfSpikes * 2);
    let I = [
      [0, R_in]
    ];
    let O = [
      [0, R_out]
    ];
    for (let i = 0; i < vertices.length; i++) {
      let c = Math.cos(dR * i);
      let s = Math.sin(dR * i);
      let rot = [
        [c, -s],
        [s, c]
      ];
      let input: number[][] = i % 2 ? O : I;
      let transformed = Mat.multM(input, Mat.transpose(rot));
      vertices[i] = [transformed[0][0], transformed[0][1]];
    }
    return vertices;
  }
}());
