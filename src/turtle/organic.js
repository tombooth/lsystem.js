

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
