export default {
  timeout: "60s",
  files: [
    "src/test/**.ts",
    "!src/test/helpers/"
  ],
  require: [
    "esm",
  ],
  nodeArguments: [
    "--experimental-modules"
  ],
  typescript: {
    rewritePaths: {
      "src/": "dist/"
    }
  }
};
