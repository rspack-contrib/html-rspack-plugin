/* This loader renders the template with underscore if no other loader was found */
// @ts-nocheck
const { template } = require('./template');

module.exports = function (source) {
  const allLoadersButThisOne = this.loaders.filter(
    (loader) => loader.normal !== module.exports,
  );

  // This loader shouldn't kick in if there is any other loader
  if (allLoadersButThisOne.length > 0) {
    return source;
  }

  // Allow only one html-webpack-plugin loader to allow loader options in the webpack config
  const htmlWebpackPluginLoaders = this.loaders.filter(
    (loader) => loader.normal === module.exports,
  );
  const lastHtmlRspackPluginLoader =
    htmlWebpackPluginLoaders[htmlWebpackPluginLoaders.length - 1];
  if (this.loaders[this.loaderIndex] !== lastHtmlRspackPluginLoader) {
    return source;
  }

  if (/\.(c|m)?js$/.test(this.resourcePath)) {
    return source;
  }

  const escapeCode = `const htmlEscapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const escapeHtmlChar = (key) => htmlEscapes[key];
const reUnescapedHtml = /[&<>"']/g, reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

function lodashEscape(string) {
  string = string.toString();
  return string && reHasUnescapedHtml.test(string)
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
};`;

  // The following part renders the template with lodash as a minimalistic loader
  const { compiled, isEscaping } = template(source);
  // Use `eval("require")("lodash")` to enforce using the native nodejs require
  // during template execution
  return `
module.exports = function (templateParams) { with(templateParams) {
  ${isEscaping ? escapeCode : ''}
  // Execute the lodash template
  return (${compiled})(); 
}}`;
};
