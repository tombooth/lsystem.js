
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

