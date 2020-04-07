export default {
  files: [
    "src/test/**.ts",
    "!src/test/helpers/"
  ],
  extensions: [
    "ts"
  ],
  require: [
    "ts-node/register"
  ]
};
