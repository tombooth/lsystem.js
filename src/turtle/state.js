

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

      this.tropism = (state && state.tropism);
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
         tropism: this.tropism && [ this.tropism[0], this.tropism[1], this.tropism[2] ],
         tropismConstant: this.tropismConstant
      };
   };

   L.Turtle.State = State;

}(L));

