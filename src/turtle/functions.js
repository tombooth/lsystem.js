
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

      if (this.tropism) { 
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
