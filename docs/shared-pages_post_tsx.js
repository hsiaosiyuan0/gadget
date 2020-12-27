((typeof(window)!=='undefined'?window:global)["webpackChunkgadget_template_default"] = (typeof(window)!=='undefined'?window:global)["webpackChunkgadget_template_default"] || []).push([["shared-pages_post_tsx"],{

/***/ "./components/header/index.tsx":
/*!*************************************!*\
  !*** ./components/header/index.tsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scrollToAnchor": () => /* binding */ scrollToAnchor,
/* harmony export */   "Header": () => /* binding */ Header
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "../node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "../node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "../ignition/bundle/config/react.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_header_index_pure_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/components/header/index.pure.scss */ "./components/header/index.pure.scss");




function scrollToAnchor(hash, offset) {
  var id = decodeURIComponent(hash).replace("#", "");
  var element = document.getElementById(id);

  if (element) {
    var position = window.scrollY + element.getBoundingClientRect().top;
    window.scrollTo(0, position - offset);
  }
}
var offset = 89;

function hackClick(mouseEvent) {
  var _ref = mouseEvent.target,
      hash = _ref.hash,
      pathname = _ref.pathname;

  if (hash) {
    if (window.location.pathname === pathname) {
      mouseEvent.preventDefault();

      if (window.location.hash === hash) {
        scrollToAnchor(hash, offset);
      } else {
        window.location.hash = hash;
      }
    }
  }
}

function Header(props) {
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    function handleHashChange() {
      scrollToAnchor(window.location.hash, offset);
    }

    document.addEventListener("click", hackClick);
    window.addEventListener("hashchange", handleHashChange);

    (function () {
      document.removeEventListener("click", hackClick);
      window.removeEventListener("hashchange", handleHashChange);
    });
  });
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: _components_header_index_pure_scss__WEBPACK_IMPORTED_MODULE_3__.default.header
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: _components_header_index_pure_scss__WEBPACK_IMPORTED_MODULE_3__.default.title
  }, props.title));
}

/***/ }),

/***/ "./components/sidebar/index.tsx":
/*!**************************************!*\
  !*** ./components/sidebar/index.tsx ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => /* binding */ Node,
/* harmony export */   "Sidebar": () => /* binding */ Sidebar
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "../node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_ends_with_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.ends-with.js */ "../node_modules/core-js/modules/es.string.ends-with.js");
/* harmony import */ var core_js_modules_es_string_ends_with_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_ends_with_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "../ignition/bundle/config/react.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var gadget_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gadget.js */ "./node_modules/gadget.js/salver/index.ts");
/* harmony import */ var _components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/sidebar/index.pure.scss */ "./components/sidebar/index.pure.scss");



function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }




function Node(data) {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(true),
      _useState2 = _slicedToArray(_useState, 2),
      open = _useState2[0],
      setOpen = _useState2[1];

  function title() {
    var _data$url;

    if ((_data$url = data.url) !== null && _data$url !== void 0 && _data$url.endsWith(".html")) {
      return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(gadget_js__WEBPACK_IMPORTED_MODULE_3__.Link, {
        html: {
          className: _components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__.default.title,
          style: {
            paddingLeft: data.indent
          }
        },
        activeClassName: _components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__.default.active,
        href: data.url
      }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("i", {
        className: data.children.length ? "mi mi-arrow-drop-down" : ""
      }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("span", null, data.name));
    }

    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
      className: _components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__.default.title,
      style: {
        paddingLeft: data.indent
      }
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("i", {
      className: data.children.length ? "mi mi-arrow-drop-down" : ""
    }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("span", null, data.name));
  }

  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: [_components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__.default.node, open ? _components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__.default.open : ""].join(" "),
    onClick: function onClick(evt) {
      evt.stopPropagation();
      setOpen(!open);
    }
  }, title(), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("ul", null, data.children.map(function (cd, i) {
    var _data$indent;

    var indent = (_data$indent = data.indent) !== null && _data$indent !== void 0 ? _data$indent : 0;
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("li", {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(Node, _extends({}, cd, {
      indent: indent + (data.children.length ? 15 : 0)
    })));
  })));
}
function Sidebar(props) {
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: _components_sidebar_index_pure_scss__WEBPACK_IMPORTED_MODULE_4__.default.sidebar
  }, props.data.map(function (data, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(Node, _extends({
      key: i
    }, data));
  }));
}

/***/ }),

/***/ "./components/toc/index.tsx":
/*!**********************************!*\
  !*** ./components/toc/index.tsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Node": () => /* binding */ Node,
/* harmony export */   "Toc": () => /* binding */ Toc
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.map.js */ "../node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../ignition/bundle/config/react.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/components/toc/index.pure.scss */ "./components/toc/index.pure.scss");


function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



function Node(data) {
  var _useState = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(data.active),
      _useState2 = _slicedToArray(_useState, 2),
      active = _useState2[0],
      setActive = _useState2[1];

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    function handleHashChange() {
      setActive(data.anchor === decodeURIComponent(location.hash));
    }

    window.addEventListener("hashchange", handleHashChange);
    return function () {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [data]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: _components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__.default.node
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: _components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__.default.title
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("a", {
    className: active ? _components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__.default.active : "",
    href: data.anchor
  }, data.name))), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", null, data.children.map(function (data, i) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", {
      key: i
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Node, data));
  })));
}

function offsetTop(node) {
  var top = 0;

  do {
    top += node.offsetTop;
    node = node.offsetParent;
  } while (node && node !== document.body);

  return top;
}

function Toc(props) {
  var _useState3 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(props.data),
      _useState4 = _slicedToArray(_useState3, 2),
      data = _useState4[0],
      setData = _useState4[1];

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function () {
    setData(props.data);
    var spy;
    setTimeout(function () {
      try {
        var Gumshoe = window.Gumshoe;
        spy = new Gumshoe(".".concat(_components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__.default.toc, " a"), {
          navClass: _components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__.default.active,
          offset: 89,
          reflow: true
        });
      } catch (error) {}
    }, 0);
    return function () {
      spy && spy.destroy();
    };
  }, [props.data]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", {
    className: _components_toc_index_pure_scss__WEBPACK_IMPORTED_MODULE_2__.default.toc
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", null, data.map(function (data) {
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", {
      key: JSON.stringify(data)
    }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1___default().createElement(Node, data));
  })));
}

/***/ }),

/***/ "./pages/post.tsx":
/*!************************!*\
  !*** ./pages/post.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "outlet": () => /* binding */ outlet,
/* harmony export */   "default": () => /* binding */ PostView
/* harmony export */ });
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.regexp.exec.js */ "../node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.string.replace.js */ "../node_modules/core-js/modules/es.string.replace.js");
/* harmony import */ var core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "../ignition/bundle/config/react.ts");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! unified */ "./node_modules/unified/index.js");
/* harmony import */ var unified__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(unified__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var remark_parse__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! remark-parse */ "./node_modules/remark-parse/index.js");
/* harmony import */ var remark_parse__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(remark_parse__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var remark_rehype__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! remark-rehype */ "./node_modules/remark-rehype/index.js");
/* harmony import */ var remark_rehype__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(remark_rehype__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var rehype_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rehype-react */ "./node_modules/rehype-react/index.js");
/* harmony import */ var rehype_react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(rehype_react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! unist-util-visit */ "./node_modules/unist-util-visit/index.js");
/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(unist_util_visit__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _components_header__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @/components/header */ "./components/header/index.tsx");
/* harmony import */ var _components_sidebar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @/components/sidebar */ "./components/sidebar/index.tsx");
/* harmony import */ var _components_toc__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @/components/toc */ "./components/toc/index.tsx");
/* harmony import */ var _pages_post_pure_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @/pages/post.pure.scss */ "./pages/post.pure.scss");













var outlet = "@/outlets/default.tsx";
var processor = unified__WEBPACK_IMPORTED_MODULE_3___default()().use((remark_parse__WEBPACK_IMPORTED_MODULE_4___default())).use(function () {
  return function (node) {
    unist_util_visit__WEBPACK_IMPORTED_MODULE_7___default()(node, "heading", function (node) {
      var name = "";
      var children = node.children;

      if (children[0] && children[0].type === "text") {
        name = children[0].value;
      }

      node.data = {
        hProperties: {
          id: name.replace(/\s/g, "")
        }
      };
    });
  };
}).use((remark_rehype__WEBPACK_IMPORTED_MODULE_5___default())).use((rehype_react__WEBPACK_IMPORTED_MODULE_6___default()), {
  createElement: (react__WEBPACK_IMPORTED_MODULE_2___default().createElement)
});
function PostView(props) {
  var _props$data = props.data,
      post = _props$data.post,
      catalog = _props$data.catalog,
      title = _props$data.title;
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(function () {
    window.scrollTo(0, 0);
    var Prism = window.Prism;
    if (Prism) Prism.highlightAll();
  }, [props.data]);
  return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", null, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_components_header__WEBPACK_IMPORTED_MODULE_8__.Header, {
    title: title
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_components_sidebar__WEBPACK_IMPORTED_MODULE_9__.Sidebar, {
    data: catalog
  }), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    className: [_pages_post_pure_scss__WEBPACK_IMPORTED_MODULE_11__.default.post, "line-numbers"].join(" ")
  }, /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", {
    key: post.filename
  }, processor.processSync(post.content).result)), /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_components_toc__WEBPACK_IMPORTED_MODULE_10__.Toc, {
    data: post.toc
  }));
}
;((typeof(window)!=='undefined'?window:__webpack_require__.g)["__gadget__"]["pageModules"]).push(["/post", function () {
  var mod = __webpack_require__(/*! ./pages/post.tsx */ "./pages/post.tsx");
  return mod;
}]);


/***/ }),

/***/ "./components/header/index.pure.scss":
/*!*******************************************!*\
  !*** ./components/header/index.pure.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"header":"_3k0uOgdSRfNa0MZs6QS7ku","title":"_1G63502GZaEXBXykcWz6cX"});

/***/ }),

/***/ "./components/sidebar/index.pure.scss":
/*!********************************************!*\
  !*** ./components/sidebar/index.pure.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"sidebar":"Z_a6ax5LrTSVASNRR2aN6","node":"_3quX88R9lR5BSdfAKHIoaF","title":"_15sI_H5F3ci3xYIfWDB4vZ","active":"_2nlZm6KFp6CmYe6H9305Me","open":"_1lO9qEBu6kafjPHlc111Kf"});

/***/ }),

/***/ "./components/toc/index.pure.scss":
/*!****************************************!*\
  !*** ./components/toc/index.pure.scss ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"toc":"_3a4jt6lr4yLRJnQge009wv","active":"_3AcS4LqNlExKjtylGnGGLV","node":"pr9M2Qxu3rP9KbtpZMUZy","title":"_3BS2IRzowIlPVoY1ThvbNb"});

/***/ }),

/***/ "./pages/post.pure.scss":
/*!******************************!*\
  !*** ./pages/post.pure.scss ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
// extracted by mini-css-extract-plugin
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"post":"rWpFqfkPbEcRx8xnnjlEm","notice":"_3hJ7NiIGXXJ-8FzYOQ2w4p"});

/***/ })

}]);
//# sourceMappingURL=shared-pages_post_tsx.js.map