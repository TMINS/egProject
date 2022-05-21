module.exports = {
  plugins: {
    // ...
    "postcss-px-to-viewport": {
      // options
      viewportUnit: "vw",
      viewportWidth: 1920,
      minPixelValue: 1,
      // selectorBlackList: [".ecahrts-postCss"],
    },
  },
};
