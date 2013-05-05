
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

