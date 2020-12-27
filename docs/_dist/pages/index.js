((typeof(window)!=='undefined'?window:global)["webpackChunkgadget_template_default"] = (typeof(window)!=='undefined'?window:global)["webpackChunkgadget_template_default"] || []).push([["pages/index"],{

/***/ "./pages/index.tsx":
/*!*************************!*\
  !*** ./pages/index.tsx ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "outlet": () => /* binding */ outlet,
/* harmony export */   "default": () => /* binding */ Index
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "../node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../ignition/bundle/config/react.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);



var outlet = "@/outlets/default.tsx";
function Index(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null, props.data.urls.map(function (url, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
      href: url
    }, url));
  }));
}
;((typeof(window)!=='undefined'?window:__webpack_require__.g)["__gadget__"]["pageModules"]).push(["/index", function () {
  var mod = __webpack_require__(/*! ./pages/index.tsx */ "./pages/index.tsx");
  return mod;
}]);


/***/ })

},
0,[["./pages/index.tsx","foundation","shared"]]]);
//# sourceMappingURL=index.js.map