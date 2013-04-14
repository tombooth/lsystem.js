
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
