// @ts-check
/** @type {import('prebundle').Config} */
export default {
  dependencies: [
    'tapable',
    {
      name: "html-minifier-terser",
      ignoreDts: true,
    },
    {
      name: "lodash",
      ignoreDts: true,
    },
  ],
};
