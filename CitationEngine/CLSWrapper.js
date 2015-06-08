/*
 * The Citation Processor is a wrapper for the citeproc-js library.
 * It simplifies the use of citeproc-js and is implemented in
 * pseudo-class style.
 */
var CITATION_PROCESSOR = function(citations, locals, style){
   //optional parameters
   if(typeof locals === 'undefined') { locals = citeprocConsts.localsUsEn }
   if(typeof style === 'undefined') { style = citeprocConsts.style }

   var citations = citations,
   /*
    * The init-function is responsible for the communication with the
    * outer world.
    * @param locals: the path to a location xml-file. example:
    * https://bitbucket.org/fbennett/citeproc-js/src/01429717257da70cb8cef6dccbde51fdf6fa763d/demo/locales-en-US.xml?at=default
    * More on locals files: http://docs.citationstyles.org/en/latest/primer.html#locale-files
    *                       https://github.com/citation-style-language/locales
    * @param style: the path to a style csl-file. >7.000 file can be found here: https://zotero.org/styles
    * @param citations: An object containing the information to be cited.
    */
   // Initialize a system object, which contains two methods needed by the
   // engine.
   citeprocSys = {
      context: this,
      // The lang parameter is not used, but still requiered, since CLS.Eninge
      // will call this functions including this parameter.
      retrieveLocale: function (lang){
         return locals;
      },
      retrieveItem: function(id){
         return citations[id];
      }
   };

   /*
    * Given the identifier of a CSL style, this function instantiates a CSL.Engine
    * object that can render citations in that style.
    * @param context: context must contain a serialized csl-file.
    */
   getProcessor = function() {
      var citeproc = null;
      if(style != null){
         citeproc = new CSL.Engine(citeprocSys, style);
      }
      return citeproc;
   },

   /*
    * This renders the citation-object and returs it. Thus, it is, beside the init-
    * function, the only publicly-accessable function. It returns an HTML-containing
    * string.
    */
   renderCitations = function(citations) {
      var citeproc = getProcessor();
      if(citeproc != null){
         var itemIDs = [];
         for (var key in citations) {
            itemIDs.push(key);
         }
         citeproc.updateItems(itemIDs);
         var bibResult = citeproc.makeBibliography();
         return bibResult[1].join('\n');
      } else {
         throw new Error("Couldn't get CSL Processor. Style or locale parameters might be falsely");
      }
   };

   return renderCitations(citations);
}
