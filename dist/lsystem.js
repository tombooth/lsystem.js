(function() {

   window.L = { turtle: {} };

}());
;
(function(L) {


   L.math = {};


   L.math.degToRad = function(degrees) {
      return degrees * ( Math.PI / 180 );
   };

   L.math.rotationMatrixUp = function(a) {
      return [ [ Math.cos(a), -Math.sin(a), 0 ], // col1
               [ Math.sin(a), Math.cos(a), 0 ],  // col2
               [ 0, 0, 1 ] ];                    // col3
   };

   L.math.rotationMatrixLeft = function(a) {
      return [ [ Math.cos(a), 0, Math.sin(a) ],    // col1
               [ 0, 1, 0 ],                        // col2
               [ -Math.sin(a), 0, Math.cos(a) ] ]; // col3
   };

   L.math.rotationMatrixHeading = function(a) {
      return [ [ 1, 0, 0 ],                        // col1
               [ 0, Math.cos(a), Math.sin(a) ],    // col2
               [ 0, -Math.sin(a), Math.cos(a) ] ]; // col3
   };

   L.math.matrixMult = function(m1, m2) {

      var out = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

      out[0][0] = m1[0][0] * m2[0][0] + m1[1][0] * m2[0][1] + m1[2][0] * m2[0][2];
      out[0][1] = m1[0][1] * m2[0][0] + m1[1][1] * m2[0][1] + m1[2][1] * m2[0][2];
      out[0][2] = m1[0][2] * m2[0][0] + m1[1][2] * m2[0][1] + m1[2][2] * m2[0][2];

      out[1][0] = m1[0][0] * m2[1][0] + m1[1][0] * m2[1][1] + m1[2][0] * m2[1][2];
      out[1][1] = m1[0][1] * m2[1][0] + m1[1][1] * m2[1][1] + m1[2][1] * m2[1][2];
      out[1][2] = m1[0][2] * m2[1][0] + m1[1][2] * m2[1][1] + m1[2][2] * m2[1][2];

      out[2][0] = m1[0][0] * m2[2][0] + m1[1][0] * m2[2][1] + m1[2][0] * m2[2][2];
      out[2][1] = m1[0][1] * m2[2][0] + m1[1][1] * m2[2][1] + m1[2][1] * m2[2][2];
      out[2][2] = m1[0][2] * m2[2][0] + m1[1][2] * m2[2][1] + m1[2][2] * m2[2][2];

      return out;
   };

   function absoluteValue(v) {
      return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
   };

   function dotProduct (v1, v2) {
      return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
   };

   L.math.absCrossProduct = function(v1, v2) {
      var absV1 = absoluteValue(v1),
          absV2 = absoluteValue(v2),
          angle = Math.acos(dotProduct(v1, v2) / (absV1 * absV2));

      return absV1 * absV2 * Math.sin(angle);
   };



}(L));
;
(function(L) {

   function Turtle() { }

   Turtle.prototype.step = function(string, i, state, context) {

      var letter, ruleForLetter, endOfParams,
          paramString, params;

      letter = string.charAt(i);

      if (ruleForLetter = this.fns[letter]) {

         if (string.charAt(i + 1) !== '(') {
            ruleForLetter.call(state, context);
         } else {
            endOfParams = string.indexOf(")", i);
            paramString = string.substring(i + 2, endOfParams);

            params = paramString.split(",");
            params.push(context);

            ruleForLetter.apply(state, params);

            i = endOfParams;
         }
      } 

      return i;

   };


   L.Turtle = Turtle;

}(L));

;
(function(L) {

   L.turtle.fns = { };

   L.turtle.fns["F"] = function(n, context) { 
      if (!context) {
         context = n;
         n = this.defaultDistance;
      }

      /* move n in the current direction */
      context.beginPath();
      context.lineWidth = this.lineWidth;
      context.moveTo(this.position[0], this.position[1]);

      this.position[0] = this.position[0] + n * this.heading[0];
      this.position[1] = this.position[1] + n * this.heading[1];
      this.position[2] = this.position[2] + n * this.heading[2];

      context.lineTo(this.position[0], this.position[1]);
      context.stroke();

      if (this.tropismEnabled) { 
         var angle = this.tropismConstant * L.math.absCrossProduct(this.heading, this.tropism),
             orientationMatrix = L.math.matrixMult([this.heading, this.left, this.up], L.math.rotationMatrixLeft(angle));

         this.heading = orientationMatrix[0];
         this.left = orientationMatrix[1];
         this.up = orientationMatrix[2];
      }

   };


   L.turtle.fns["f"] = function(n, context) { 
      if (!context) {
         context = n;
         n = this.defaultDistance;
      }

      /* move n without drawing */
      this.position[0] = this.position[0] + n * this.heading[0];
      this.position[1] = this.position[1] + n * this.heading[1];
      this.position[2] = this.position[2] + n * this.heading[2];
   };


   L.turtle.fns["+"] = function(n, context) { 
      if (!context) {
         context = n;
         n = this.defaultAngle;
      }

      /* rotate around u ?!? */
      var orientationMatrix = L.math.matrixMult([this.heading, this.left, this.up], L.math.rotationMatrixUp(L.math.degToRad(n)));

      this.heading = orientationMatrix[0];
      this.left = orientationMatrix[1];
      this.up = orientationMatrix[2];
   };


   L.turtle.fns["-"] = function(n, context) {
      if (!context) {
         context = n;
         n = this.defaultAngle;
      }

      L.turtle.fns["+"].call(this, -n, context);
   };


   L.turtle.fns["&"] = function(n, context) { 
      /* rotate around l ?!? */
      var orientationMatrix = L.math.matrixMult([this.heading, this.left, this.up], L.math.rotationMatrixLeft(L.math.degToRad(n)));

      this.heading = orientationMatrix[0];
      this.left = orientationMatrix[1];
      this.up = orientationMatrix[2];
   };


   L.turtle.fns["/"] = function(n, context) { 
      /* rotate around h ?!? */
      var orientationMatrix = L.math.matrixMult([this.heading, this.left, this.up], L.math.rotationMatrixHeading(L.math.degToRad(n)));

      this.heading = orientationMatrix[0];
      this.left = orientationMatrix[1];
      this.up = orientationMatrix[2];
   };


   L.turtle.fns["!"] = function(n, context) { 
      /* set the width of the line */
      this.lineWidth = n;
   };


   L.turtle.fns["["] = function(context) {

      this.pushState();

   };


   L.turtle.fns["]"] = function(context) {

      this.popState();

   };


}(L))
;

(function(L) {

   function Organic(state, fns) {
      this.initialState = state;
      this.fns = fns;
   }

   Organic.prototype = new L.Turtle();

   Organic.prototype.render = function(string, context, callback) {

      var root = this._buildTree(string);

      root.state = this.initialState.duplicate();

      this._renderTree(root, context, callback);

   };


   Organic.prototype._buildTree = function(instructions) {

      var letter, childNode, nodeInstructions = "", currentNode;

      currentNode = {
         children: [],
         instructions: ""
      };

      for (var i = 0; i < instructions.length; i++) {

         letter = instructions.charAt(i);

         if (letter === "[") {
            childNode = this._buildTree(instructions.substr(i+1));
            currentNode.instructions += "#" + (currentNode.children.push(childNode) - 1);

            i += childNode.endIndex + 1;
         } else if (letter === "]") {
            break;
         } else {
            currentNode.instructions += letter;
         }

      }

      currentNode.endIndex = i;

      return currentNode;

   }

   Organic.prototype._renderTree = function(node, context) {

      var letter, ruleForLetter, out = "",
          endOfParams, paramString, params, instructions, state;

      instructions = node.instructions;
      state = node.state;

      for (var i = 0; i < instructions.length; i++) {

         letter = instructions.charAt(i);

         if (ruleForLetter = this.fns[letter]) {

            if (ruleForLetter.length === 1) {    // function for letter takes no params other than context
               ruleForLetter.call(state, context);
            } else {
               endOfParams = instructions.indexOf(")", i);
               paramString = instructions.substring(i + 2, endOfParams);

               params = paramString.split(",");
               params.push(context);

               if (params.length != ruleForLetter.length) throw new Error("Could not extract the correct number of parameters for " + letter);

               out += ruleForLetter.apply(state, params);

               i = endOfParams;
            }
         } else if ( letter === "#" ) {

            node.children[+instructions.charAt(++i)].state = state.duplicate();

         } 
      }

      for (i = 0; i < node.children.length; i++) {
         setTimeout(this._renderTree.bind(this, node.children[i], context), 50);
      }
   }

   L.Turtle.Organic = Organic;

}(L))
;
(function(L) {

   function Recursive(state, fns) {
      this.initialState = state;
      this.fns = fns;
   }

   Recursive.prototype = new L.Turtle();

   Recursive.prototype.render = function(string, context, callback) {

      this._renderRecurse(string, this.initialState.duplicate(), context, callback);

   };

   Recursive.prototype._renderRecurse = function(string, state, context, callback) {

      var i;

      if (string.length > 0) {

         i = this.step(string, 0, state, context);
         setTimeout(this._renderRecurse.bind(this, string.substring((i === 0) ? 1 : i), state, context, callback), 0);

      } else { callback && callback(); }

   };

   L.Turtle.Recursive = Recursive;

}(L))
;
(function(L) {

   function Simple(initialState, fns) {
      this.initialState = initialState;
      this.fns = fns;
   };

   Simple.prototype = new L.Turtle();

   Simple.prototype.render = function(string, context, callback) {

      var state = this.initialState.duplicate();

      for (var i = 0; i < string.length; i++) {
         i = this.step(string, i, state, context);
      }

      callback && callback();

   };

   L.Turtle.Simple = Simple;

}(L));

;

(function(L) {

   function State(state) {
      this.stack = [ ];
      this.fromObject(state);
   }

   State.prototype.withLineWidth = function(lineWidth) {
      this.lineWidth = lineWidth;
      return this;
   };

   State.prototype.withDefaultDistance = function(d) {
      this.defaultDistance = d;
      return this;
   };

   State.prototype.withPosition = function(x, y, z) {
      this.position = [ x, y, z ];
      return this;
   };

   State.prototype.withTropismEnabled = function(enabled) {
      this.tropismEnabled = enabled;
      return this;
   };

   State.prototype.withTropismVector = function(i, j, k) {
      this.tropism = [ i, j, k ];
      return this;
   };

   State.prototype.withTropismConstant = function(c) {
      this.tropismConstant = c;
      return this;
   };

   State.prototype.pushState = function() {
      this.stack.push(this.toObject());
   };

   State.prototype.popState = function() {
      this.fromObject(this.stack.pop());
   };

   State.prototype.duplicate = function() {
      return new State(this.toObject());
   };

   State.prototype.fromObject = function(state) {
      this.lineWidth = (state && state.lineWidth) || 1;
      this.defaultDistance = (state && state.defaultDistance) || 10;
      this.defaultAngle = (state && state.defaultAngle) || 90;

      this.position = (state && state.position) || [ 0, 0, 0 ];
      this.heading = (state && state.heading) || [ 0, -1, 0 ];
      this.left = (state && state.left) || [ -1, 0, 0 ];
      this.up = (state && state.up) || [ 0, 0, -1 ];

      this.tropismEnabled = (state && state.tropismEnabled !== undefined) ? !!state.tropismEnabled : false;
      this.tropism = (state && state.tropism) || [ 0, 0, 0 ];
      this.tropismConstant = (state && state.tropismConstant) || 1;
   };

   State.prototype.toObject = function() {
      return {
         lineWidth: this.lineWidth,
         defaultDistance: this.defaultDistance,
         defaultAngle: this.defaultAngle,
         position: [ this.position[0], this.position[1], this.position[2] ],
         heading: [ this.heading[0], this.heading[1], this.heading[2] ],
         left: [ this.left[0], this.left[1], this.left[2] ],
         up: [ this.up[0], this.up[1], this.up[2] ],
         tropismEnabled: this.tropismEnabled,
         tropism: this.tropism && [ this.tropism[0], this.tropism[1], this.tropism[2] ],
         tropismConstant: this.tropismConstant
      };
   };

   L.Turtle.State = State;

}(L));

;
(function(L) {

   function System(axiom, constants, rules) {

      if (typeof axiom === 'object') {
         this.axiom = axiom.axiom;
         this.constants = axiom.constants;
         this.rules = axiom.rules;
      } else {
         this.axiom = axiom;
         this.constants = constants;
         this.rules = rules;
      }

   }

   System.prototype.iterate = function(times, callback, string) {

      var letter, ruleForLetter, out = "",
          endOfParams, paramString, params, ruleType;

      string = string || this.axiom;

      if (times === 0) { callback(string); return; }

      for (var i = 0; i < string.length; i++) {
         letter = string.charAt(i);

         if (ruleForLetter = this.rules[letter]) {
            ruleType = typeof ruleForLetter;

            if (ruleType === 'string') {
               out += ruleForLetter;
            } else if (ruleType === 'function') {

               if (ruleForLetter.length === 0) {    // function for letter takes no params
                  out += ruleForLetter.call(this.constants);
               } else {
                  endOfParams = string.indexOf(")", i);
                  paramString = string.substring(i + 2, endOfParams);
                  params = paramString.split(",");

                  if (params.length != ruleForLetter.length) throw new Error("Could not extract the correct number of parameters for " + letter);

                  out += ruleForLetter.apply(this.constants, params);

                  i = endOfParams;
               }

            } else if (ruleType === 'object') { /* implement stochastic rules with objects mapping their likelihoods */ }

         } else {
            out += letter;
         }
      }

      setTimeout(this.iterate.bind(this, times - 1, callback, out), 0);
   };

   L.System = System;

}(L));

;
(function(L) {

   L.examples = {

      tree: {
         name: "Tree",
         system: new L.System({
            axiom: "!(1)F(130)/(45)A",
            constants: {
               "d1": 94.74,  /* divergence angle 1 */
               "d2": 132.63, /* divergence angle 2 */
               "a": 18.95,   /* branching angle */
               "lr": 1.009,  /* elongation rate */
               "vr": 1.532   /* width increase rate */
            },
            rules: {
               "A": function() { 
                  return "!(" + this.vr + ")F(30)[&(" + this.a +")F(30)A]/(" + this.d1 + ")" + 
                     "[&(" + this.a + ")F(30)A]/(" + this.d2 + ")[&(" + this.a + ")F(30)A]";
               },
               "F": function(l) { return "F(" + (l * this.lr) + ")"; },
               "!": function(w) { return "!(" + (w * this.vr) + ")"; }
            }
         }),
         state: new L.Turtle.State()
            .withLineWidth(1.732)
            .withTropismEnabled(true)
            .withTropismVector(0, -1, 0)
            .withTropismConstant(0.25),
         iterations: 7
      },

      quadratic_snowflake: {
         name: "Quadratic Snowflake",
         system: new L.System({
            axiom: "-F",
            rules: {
               F: "F+F-F-F+F"
            }
         }),
         state: new L.Turtle.State()
            .withDefaultDistance(5),
         iterations: 4
      }

   };

}(L));

