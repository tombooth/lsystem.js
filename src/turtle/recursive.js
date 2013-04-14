
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
