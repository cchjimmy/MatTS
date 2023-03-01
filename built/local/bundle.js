var Mat = {
    matrix: function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var shape = Mat.shape(values);
        var matrix = Mat.empty(shape[0], shape[1]);
        for (var i = 0; i < shape[0]; i++) {
            for (var j = 0; j < shape[1]; j++) {
                matrix[i][j] = values[i][j] || 0;
            }
        }
        return matrix;
    },
    shape: function (m) {
        var rows = m.length;
        var columns = 0;
        for (var i = 0; i < rows; i++) {
            columns = columns >= m[i].length ? columns : m[i].length;
        }
        return [rows, columns];
    },
    zeroes: function (r, c) {
        var matrix = new Array(r);
        var row = new Array(c);
        for (var i = 0; i < c; i++) {
            row[i] = 0;
        }
        for (var i = 0; i < r; i++) {
            matrix[i] = row.slice(0);
        }
        return matrix;
    },
    identity: function (order) {
        var matrix = Mat.zeroes(order, order);
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
    add: function (m1, m2) {
        var shape1 = Mat.shape(m1);
        for (var i = 0; i < shape1[0]; i++) {
            for (var j = 0; j < shape1[1]; j++) {
                m1[i][j] += m2[i][j];
            }
        }
        return m1;
    },
    subM: function (m1, m2) {
        var shape1 = Mat.shape(m1);
        for (var i = 0; i < shape1[0]; i++) {
            for (var j = 0; j < shape1[1]; j++) {
                m1[i][j] -= m2[i][j];
            }
        }
        return m1;
    },
    subS: function (m, s) {
        var shape = Mat.shape(m);
        for (var i = 0; i < shape[0]; i++) {
            for (var j = 0; j < shape[1]; j++) {
                m[i][j] -= s;
            }
        }
        return m;
    },
    dot: function (m1, m2, rI, cI) {
        if (rI === void 0) { rI = 0; }
        if (cI === void 0) { cI = 0; }
        var result = 0;
        var shape1 = Mat.shape(m1);
        for (var i = 0; i < shape1[1]; i++) {
            result += m1[rI][i] * m2[i][cI];
        }
        return result;
    },
    multM: function (m1, m2) {
        var shape1 = Mat.shape(m1);
        var shape2 = Mat.shape(m2);
        var result = Mat.empty(shape1[0], shape2[1]);
        for (var i = 0; i < shape1[0]; i++) {
            for (var j = 0; j < shape2[1]; j++) {
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
    var numberOfObjects = 1000;
    var resolution = [400, 400];
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var pos = Mat.multM(Mat.random(numberOfObjects, 2), Mat.matrix([resolution[0], 0], [0, resolution[1]]));
    var ang = new Array(numberOfObjects);
    var scale = Mat.random(numberOfObjects, 2);
    var maxSize = 50;
    var vel = Mat.empty(numberOfObjects, 2);
    var shape = Mat.matrix([-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]);
    main();
    function main() {
        canvas.width = resolution[0];
        canvas.height = resolution[1];
        Mat.multS(scale, maxSize);
        for (var i = 0; i < numberOfObjects; i++) {
            vel[i][0] = Math.random() - 0.5;
            vel[i][1] = Math.random() - 0.5;
            ang[i] = Math.random();
        }
        loop();
    }
    function loop() {
        ctx.clearRect(0, 0, resolution[0], resolution[1]);
        Mat.add(pos, vel);
        for (var i = 0; i < pos.length; i++) {
            if (pos[i][0] < 0 || pos[i][0] > resolution[0])
                vel[i][0] *= -1;
            if (pos[i][1] < 0 || pos[i][1] > resolution[1])
                vel[i][1] *= -1;
        }
        batchShapeDraw(numberOfObjects, shape, pos, ang, scale);
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
            var rot = Mat.matrix([c, -s], [s, c]);
            var transform = Mat.multM(rot, Mat.matrix([scale[i][0], 0], [0, scale[i][1]]));
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
}());
//# sourceMappingURL=bundle.js.map