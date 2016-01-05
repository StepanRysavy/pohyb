(function (Pohyb, undefined) {
	if (!Pohyb) return;
  
    var defaultUnit = undefined,
        value,
        result,
        matrix,
        lastTransform, 
        args, 
        webkit = false; 

	var transform = {
		matrix: function (el) {

            if (Pohyb.computed(el, "transform") === undefined) webkit = true;
        
            value = Pohyb.computed(el, (webkit === true?"webkitT":"t") + "ransform");

			if (value === undefined || value.indexOf("matrix") === -1) {
                el.style[(webkit === true?"-webkit-":"") + "transform-origin"] = "50% 50%";
				el.style[(webkit === true?"-webkit-":"") + "transform"] = "matrix(1,0,0,1,0,0)";
				value = Pohyb.computed(el, (webkit === true?"webkitT":"t") + "ransform");
			}

			value = value.split("matrix(")[1].split(")")[0].split(", ");

			for (var i = 0; i < value.length; i++) {
				value[i] = Number(value[i]);
			}

			matrix = Matrix.create([
				[value[0], value[1], value[4]],
				[value[2], value[3], value[5]],
				[0, 0, 1]
            ]);

			return {
				matrix: matrix,
				value: value
			}

		},
		get: function (attribute, element) {
            
            args = transform.matrix(element);
			value = args.value; 
            matrix = args.matrix; 

            result = [];

            for (var i=0;i<6;i++) {
                result.push(Pohyb.read(value[i]));
            }

            return result;

        },
        set: function (attribute, element, value) {

           lastTransform = [];

            for (var i=0;i<6;i++) {
                lastTransform.push(value[i].value);
            }

           lastTransform = "matrix(" + lastTransform.join(", ") + ")";

           element.style[(webkit === true?"-webkit-":"") + "transform"] = lastTransform;

           return undefined;

        },
        parse: function (type, value, element, defaults) {

            var b, c,
                data = ((Pohyb.data) ? Pohyb.data(element).get("transform") : element.dataset) || {},
                parsed = [];

            for (var i=0;i<6;i++) {
                parsed.push(Pohyb.read(undefined));
            }

            if (arguments[3] === true) {

                if (typeof value === "object" && value.length == 6 && type === "matrix") {

                    for (var i=0;i<6;i++) {
                        parsed[i].value = value[i];
                    }

                     return parsed;
                }

                if (typeof value === "object") {

                    for (var i = 0; i < value.length; i++) {

                        type = value[i].key;
                        c = value[i].value;			

                        if (typeof c === "string") {
                            
                            c = c.split(" ");
                            c.forEach(function (value, index) {
                                c[index] = Number(c[index].split("px")[0]);
                            });

                            if (c.length === 1) c[1] = c[0];
           
                        } else {
                            c = [c, c];
                        }

                        if (type === "scaleX") {
                            data.scaleX = c[0];
                        }

                        if (type === "scaleY") {
                            data.scaleY = c[0];
                        }
          
                        if (type === "rotate") {
                            c[0] = Number(c[0]) * Math.PI / 180;
                            data.rotate = c[0];
                        }

                        if (type === "translateX") {
                            data.translateX = c[0];
                        }
                        if (type === "translateY") {
                            data.translateY = c[0];
                        }
                        if (type === "skewX") {
                            data.skewX = c[0];
                        }
                        if (type === "skewY") {
                            data.skewY = c[0];
                        }

                        if (type === "scale") {

                            data.scaleX = c[0];
                            data.scaleY = c[1];

                        }

                        if (type === "translate") {

                            data.translateX = c[0];
                            data.translateY = c[1];

                        }

                        if (type === "skew") {

                            data.skewX = c[0];
                            data.skewY = c[1];

                        }
                    }
                }

                // MATRIC CALC

                // SCALE MULTIPLY

                b = data.scaleX || 1;
                c = data.scaleY || 1;

                matrix = Matrix.create([
                    [b, 0, 0],
                    [0, c, 0],
                    [0, 0, 1]
                    ]);

                // ROTATE MULTIPLY

                b = data.rotate || 0;

                matrix = matrix.x(Matrix.create([
                    [Math.cos(b), -Math.sin(b), 0],
                    [Math.sin(b), Math.cos(b), 0],
                    [0, 0, 1]
                ]));

                // TRANSLATE MULTIPLY

                b = data.translateX || 0;
                c = data.translateY || 0;

                matrix = matrix.x(Matrix.create([
                    [1, 0, b],
                    [0, 1, c],
                    [0, 0, 1]
                ]));

                // SKEW MULTIPLY

                b = data.skewX || 0;
                c = data.skewY || 0;

                matrix = matrix.x(Matrix.create([
                    [1, Math.tan(b), 0],
                    [Math.tan(c), 1, 0],
                    [0, 0, 1]
                ]));

                (Pohyb.data) ? Pohyb.data(element).set("transform", data) : element.dataset = data;

            } else {

                matrix = transform.matrix(element).matrix;

            }

            c = matrix.elements;

            parsed[0].value = c[0][0];
            parsed[1].value = c[0][1];
            parsed[2].value = c[1][0];
            parsed[3].value = c[1][1];
            parsed[4].value = c[0][2];
            parsed[5].value = c[1][2];

            return parsed;
        }
    };

    Pohyb.addParametersFunctions("transform", transform);

    Pohyb.addParameters(["matrix"], "transform", 0);
    Pohyb.addParametersBind(["scale", "scaleX", "scaleY", "rotate", "translate", "translateX", "translateY", "skew", "skewX", "skewY"], "matrix");

    function Matrix() {}
    Matrix.prototype = {

      // Maps the matrix to another matrix (of the same dimensions) according to the given function
      map: function(fn) {
        var els = [], ni = this.elements.length, ki = ni, i, nj, kj = this.elements[0].length, j;
        do { i = ki - ni;
          nj = kj;
          els[i] = [];
          do { j = kj - nj;
            els[i][j] = fn(this.elements[i][j], i + 1, j + 1);
        } while (--nj);
    } while (--ni);
    return Matrix.create(els);
    },

      // Returns true iff the matrix can multiply the argument from the left
      canMultiplyFromLeft: function(matrix) {
        var M = matrix.elements || matrix;
        if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
        // this.columns should equal matrix.rows
        return (this.elements[0].length == M.length);
    },

      // Returns the result of multiplying the matrix from the right by the argument.
      // If the argument is a scalar then just multiply all the elements. If the argument is
      // a vector, a vector is returned, which saves you having to remember calling
      // col(1) on the result.
      multiply: function(matrix) {
        if (!matrix.elements) {
          return this.map(function(x) { return x * matrix; });
      }
      var returnVector = matrix.modulus ? true : false;
      var M = matrix.elements || matrix;
      if (typeof(M[0][0]) == 'undefined') { M = Matrix.create(M).elements; }
      if (!this.canMultiplyFromLeft(M)) { return null; }
      var ni = this.elements.length, ki = ni, i, nj, kj = M[0].length, j;
      var cols = this.elements[0].length, elements = [], sum, nc, c;
      do { i = ki - ni;
          elements[i] = [];
          nj = kj;
          do { j = kj - nj;
            sum = 0;
            nc = cols;
            do { c = cols - nc;
              sum += this.elements[i][c] * M[c][j];
          } while (--nc);
          elements[i][j] = sum;
      } while (--nj);
    } while (--ni);
    var M = Matrix.create(elements);
    return returnVector ? M.col(1) : M;
    },

    x: function(matrix) { return this.multiply(matrix); },

      // Set the matrix's elements from an array. If the argument passed
      // is a vector, the resulting matrix will be a single column.
        setElements: function(els) {
            var i, elements = els.elements || els;
            if (typeof(elements[0][0]) != 'undefined') {
                var ni = elements.length, ki = ni, nj, kj, j;
                this.elements = [];
                do { i = ki - ni;
                    nj = elements[i].length; kj = nj;
                    this.elements[i] = [];
                    do { j = kj - nj;
                        this.elements[i][j] = elements[i][j];
                    } while (--nj);
                } while(--ni);
                return this;
            }
            var n = elements.length, k = n;
            this.elements = [];
            do { i = k - n;
                this.elements.push([elements[i]]);
            } while (--n);
            return this;
        }
    };

    // Constructor function
    Matrix.create = function(elements) {
        var M = new Matrix();
        return M.setElements(elements);
    };

})(Pohyb);

