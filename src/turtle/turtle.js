
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

