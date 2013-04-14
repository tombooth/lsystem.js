
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

