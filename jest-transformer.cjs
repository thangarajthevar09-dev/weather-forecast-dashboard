const { transformSync } = require("@babel/core");

const replaceViteEnv = ({ types: t }) => ({
  visitor: {
    MemberExpression(path) {
      const { object, property } = path.node;

      if (
        t.isMemberExpression(object) &&
        t.isMetaProperty(object.object) &&
        t.isIdentifier(object.object.meta, { name: "import" }) &&
        t.isIdentifier(object.object.property, { name: "meta" }) &&
        t.isIdentifier(object.property, { name: "env" }) &&
        t.isIdentifier(property)
      ) {
        path.replaceWith(
          t.memberExpression(
            t.memberExpression(
              t.identifier("process"),
              t.identifier("env")
            ),
            property
          )
        );
      }
    },
  },
});

module.exports = {
  process(sourceText, sourcePath) {
    const result = transformSync(sourceText, {
      filename: sourcePath,
      babelrc: false,
      configFile: false,
      sourceType: "unambiguous",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: { node: "current" },
            modules: "commonjs",
          },
        ],
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
      plugins: [replaceViteEnv],
    });

    if (!result) {
      throw new Error(`Babel failed to transform ${sourcePath}`);
    }

    return { code: result.code };
  },
};