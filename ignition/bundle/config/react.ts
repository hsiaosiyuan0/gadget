module.exports =
  typeof window !== "undefined"
    ? window.React
    : __non_webpack_require__(
        __non_webpack_require__.resolve("react", {
          paths: [process.cwd()],
        })
      );
