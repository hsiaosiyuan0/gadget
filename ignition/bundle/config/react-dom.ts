module.exports =
  typeof window !== "undefined"
    ? window.ReactDOM
    : __non_webpack_require__(
        __non_webpack_require__.resolve("react-dom", {
          paths: [process.cwd()],
        })
      );
