const NS = "__gadget__";

// wrap a module with a module-register logic
export function withRegister(
  id: string,
  store: string,
  originalModule: string,
  originalSource: string
) {
  // we use a immediately invoked expression to register the module to gadget's
  // modules manager, so that the manager will be notified which module is loaded then
  // do the further processes such as emitting an event to broadcast which module is loaded
  // to its subscribers.
  //
  // we concat the registering logic after the original code of the modules, this manner brings the
  // benefits that we will not being required to deal with the variation of the source-maps
  return `
${originalSource}
;((typeof(window)!=='undefined'?window:global)["${NS}"]["${store}"]).push(["${id}", function () {
  var mod = require(${originalModule});
  return mod;
}]);
`;
}
