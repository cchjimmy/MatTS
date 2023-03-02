var Mat = {
    shape: function (m) {
        var rows = m.length;
        var columns = 0;
        for (var i = 0; i < rows; i++) {
            columns = columns >= m[i].length ? columns : m[i].length;
        }
        return [rows, columns];
    },
    fill: function (r, c, value) {
        var matrix = new Array(r);
        var row = new Array(c);
        for (var i = 0; i < c; i++) {
            row[i] = value;
        }
        for (var i = 0; i < r; i++) {
            matrix[i] = row.slice(0);
        }
        return matrix;
    },
    identity: function (order) {
        var matrix = Mat.fill(order, order, 0);
        for (var i = 0; i < order; i++) {
            matrix[i][i] = 1;
        }
        return matrix;
    },
    empty: function (r, c) {
        var matrix = new Array(r);
        var row = new Array(c);
        for (var i = 0; i < r; i++) {
            matrix[i] = row.slice(0);
        }
        return matrix;
    },
    addM: function (m1, m2) {
        for (var i = 0; i < m1.length; i++) {
            for (var j = 0; j < m1[0].length; j++) {
                m1[i][j] += m2[i][j];
            }
        }
        return m1;
    },
    addS: function (m, s) {
        for (var i = 0; i < m.length; i++) {
            for (var j = 0; j < m[0].length; j++) {
                m[i][j] += s;
            }
        }
        return m;
    },
    subM: function (m1, m2) {
        for (var i = 0; i < m1.length; i++) {
            for (var j = 0; j < m1[0].length; j++) {
                m1[i][j] -= m2[i][j];
            }
        }
        return m1;
    },
    subS: function (m, s) {
        for (var i = 0; i < m.length; i++) {
            for (var j = 0; j < m[0].length; j++) {
                m[i][j] -= s;
            }
        }
        return m;
    },
    dot: function (m1, m2, rI, cI) {
        if (rI === void 0) { rI = 0; }
        if (cI === void 0) { cI = 0; }
        var result = 0;
        for (var i = 0; i < m1[rI].length; i++) {
            result += m1[rI][i] * m2[i][cI];
        }
        return result;
    },
    multM: function (m1, m2) {
        var result = Mat.empty(m1.length, m2[0].length);
        for (var i = 0; i < m1.length; i++) {
            for (var j = 0; j < m2[0].length; j++) {
                result[i][j] = Mat.dot(m1, m2, i, j);
            }
        }
        return result;
    },
    multS: function (m, s) {
        var shape = Mat.shape(m);
        for (var i = 0; i < shape[0]; i++) {
            for (var j = 0; j < shape[1]; j++) {
                m[i][j] *= s;
            }
        }
        return m;
    },
    transpose: function (m) {
        var shape = Mat.shape(m);
        var t = Mat.empty(shape[1], shape[0]);
        for (var i = 0; i < shape[1]; i++) {
            for (var j = 0; j < shape[0]; j++) {
                t[i][j] = m[j][i];
            }
        }
        return t;
    },
    copy: function (s) {
        var matrix = new Array(s.length);
        for (var i = 0; i < s.length; i++) {
            matrix[i] = s[i].slice(0);
        }
        return matrix;
    },
    random: function (r, c) {
        var matrix = Mat.empty(r, c);
        for (var i = 0; i < r; i++) {
            for (var j = 0; j < c; j++) {
                matrix[i][j] = Math.random();
            }
        }
        return matrix;
    }
};
(function () {
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var numberOfObjects = 500;
    var resolution = [400, 400];
    var maxSize = 50;
    var shape = generateStar();
    var pos = Mat.multM(Mat.random(numberOfObjects, 2), [[resolution[0], 0], [0, resolution[1]]]);
    var ang = new Array(numberOfObjects);
    var scale = Mat.random(numberOfObjects, 2);
    var vel = Mat.random(numberOfObjects, 2);
    main();
    function main() {
        canvas.width = resolution[0];
        canvas.height = resolution[1];
        Mat.multS(scale, maxSize);
        Mat.subS(vel, 0.5);
        for (var i = 0; i < numberOfObjects; i++) {
            ang[i] = Math.random() * Math.PI * 2;
        }
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        loop();
    }
    function loop() {
        ctx.fillRect(0, 0, resolution[0], resolution[1]);
        Mat.addM(pos, vel);
        for (var i = 0; i < pos.length; i++) {
            if (pos[i][0] < 0 || pos[i][0] > resolution[0])
                vel[i][0] *= -1;
            if (pos[i][1] < 0 || pos[i][1] > resolution[1])
                vel[i][1] *= -1;
        }
        batchShapeDraw(numberOfObjects, shape, pos, ang, scale, "white");
        requestAnimationFrame(loop);
    }
    function batchShapeDraw(numberOfObjects, shape, pos, ang, scale, color, fill) {
        if (color === void 0) { color = "black"; }
        if (fill === void 0) { fill = false; }
        ctx.save();
        fill ? ctx.fillStyle = color : ctx.strokeStyle = color;
        ctx.beginPath();
        for (var i = 0; i < numberOfObjects; i++) {
            var c = Math.cos(ang[i]);
            var s = Math.sin(ang[i]);
            var rot = [
                [c, -s],
                [s, c]
            ];
            var transform = Mat.multM(rot, [[scale[i][0], 0], [0, scale[i][1]]]);
            var transformed = Mat.multM(shape, Mat.transpose(transform));
            for (var j = 0; j < transformed.length; j++) {
                transformed[j][0] += pos[i][0];
                transformed[j][1] += pos[i][1];
            }
            ctx.moveTo(transformed[0][0], transformed[0][1]);
            for (var j = 1; j < transformed.length; j++) {
                ctx.lineTo(transformed[j][0], transformed[j][1]);
            }
            ctx.lineTo(transformed[0][0], transformed[0][1]);
        }
        fill ? ctx.fill() : ctx.stroke();
        ctx.restore();
    }
    function generateStar(numberOfSpikes, R_out, R_in) {
        if (numberOfSpikes === void 0) { numberOfSpikes = 5; }
        if (R_out === void 0) { R_out = 0.5; }
        if (R_in === void 0) { R_in = 0.25; }
        var dR = Math.PI * 2 / (numberOfSpikes * 2);
        var vertices = new Array(numberOfSpikes * 2);
        var I = [
            [0, R_in]
        ];
        var O = [
            [0, R_out]
        ];
        for (var i = 0; i < vertices.length; i++) {
            var c = Math.cos(dR * i);
            var s = Math.sin(dR * i);
            var rot = [
                [c, -s],
                [s, c]
            ];
            var input = i % 2 ? O : I;
            var transformed = Mat.multM(input, Mat.transpose(rot));
            vertices[i] = [transformed[0][0], transformed[0][1]];
        }
        return vertices;
    }
}());
//# sourceMappingURL=bundle.js.map