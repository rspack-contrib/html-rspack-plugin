// @ts-check
/** @type {import('prebundle').Config} */
export default {
  dependencies: [
    'tapable',
    {
      name: "lodash",
      ignoreDts: true,
    },
  ],
};
