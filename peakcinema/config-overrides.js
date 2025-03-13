<<<<<<< HEAD
const { override, useBabelRc, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc(),
    addWebpackAlias({
        "~": path.resolve(__dirname, "src")
    })
=======
const { override, useBabelRc } = require("customize-cra");

module.exports = override(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useBabelRc()
>>>>>>> 3b7c1e6 (the firt commit)
);

