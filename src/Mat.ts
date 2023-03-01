const Mat = {
  shape(m: number[][]): [number, number] {
    let rows = m.length;
    let columns = 0;
    for (let i = 0; i < rows; i++) {
      columns = columns >= m[i].length ? columns : m[i].length;
    }
    return [rows, columns];
  },
  fill(r: number, c: number, value: number): number[][] {
    let matrix: number[][] = new Array(r);
    let row = new Array(c);
    for (let i = 0; i < c; i++) {
      row[i] = value;
    }
    for (let i = 0; i < r; i++) {
      matrix[i] = row.slice(0);
    }
    return matrix;
  },
  identity(order: number): number[][] {
    let matrix = Mat.fill(order, order, 0);
    for (let i = 0; i < order; i++) {
      matrix[i][i] = 1;
    }
    return matrix;
  },
  empty(r: number, c: number): number[][] {
    let matrix: number[][] = new Array(r);
    let row: number[] = new Array(c);
    for (let i = 0; i < r; i++) {
      matrix[i] = row.slice(0);
    }
    return matrix;
  },
  addM(m1: number[][], m2: number[][]): number[][] {
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m1[0].length; j++) {
        m1[i][j] += m2[i][j];
      }
    }
    return m1;
  },
  addS(m: number[][], s: number): number[][] {
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[0].length; j++) {
        m[i][j] += s;
      }
    }
    return m;
  },
  subM(m1: number[][], m2: number[][]): number[][] {
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m1[0].length; j++) {
        m1[i][j] -= m2[i][j];
      }
    }
    return m1;
  },
  subS(m: number[][], s: number): number[][] {
    for (let i = 0; i < m.length; i++) {
      for (let j = 0; j < m[0].length; j++) {
        m[i][j] -= s;
      }
    }
    return m;
  },
  dot(m1: number[][], m2: number[][], rI: number = 0, cI: number = 0): number {
    let result = 0;
    for (let i = 0; i < m1[rI].length; i++) {
      result += m1[rI][i] * m2[i][cI];
    }
    return result;
  },
  multM(m1: number[][], m2: number[][]): number[][] {
    let result = Mat.empty(m1.length, m2[0].length);
    for (let i = 0; i < m1.length; i++) {
      for (let j = 0; j < m2[0].length; j++) {
        result[i][j] = Mat.dot(m1, m2, i, j);
      }
    }
    return result;
  },
  multS(m: number[][], s: number) {
    let shape = Mat.shape(m);
    for (let i = 0; i < shape[0]; i++) {
      for (let j = 0; j < shape[1]; j++) {
        m[i][j] *= s;
      }
    }
    return m;
  },
  transpose(m: number[][]): number[][] {
    let shape = Mat.shape(m);
    let t = Mat.empty(shape[1], shape[0]);
    for (let i = 0; i < shape[1]; i++) {
      for (let j = 0; j < shape[0]; j++) {
        t[i][j] = m[j][i];
      }
    }
    return t;
  },
  copy(s: number[][]): number[][] {
    let matrix: number[][] = new Array(s.length);
    for (let i = 0; i < s.length; i++) {
      matrix[i] = s[i].slice(0);
    }
    return matrix;
  },
  random(r: number, c: number): number[][] {
    let matrix = Mat.empty(r, c);
    for (let i = 0; i < r; i++) {
      for (let j = 0; j < c; j++) {
        matrix[i][j] = Math.random();
      }
    }
    return matrix;
  }
}