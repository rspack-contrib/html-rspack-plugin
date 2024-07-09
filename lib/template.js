/**
 * This is a minimal implementation of `lodash.template`
 * Modified based on lodash v4.17.21
 * License: https://github.com/lodash/lodash/blob/main/LICENSE
 */

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g;
/** Used to match template delimiters. */
var reEvaluate = /<%([\s\S]+?)%>/g;
/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;
/** Used to match empty string literals in compiled template source. */
var reEmptyStringLeading = /\b__p \+= '';/g,
  reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
  reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;

/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */
var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;

/** Used to match unescaped characters in compiled string literals. */
var reUnescapedString = /['\n\r\u2028\u2029\\]/g;

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029',
};

const escapeStringChar = (chr) => '\\' + stringEscapes[chr];

function template(string) {
  var isEscaping,
    isEvaluating,
    index = 0,
    source = "__p += '";

  // Compile the regexp to match each delimiter.
  var reDelimiters = RegExp(
    reEscape.source +
      '|' +
      reInterpolate.source +
      '|' +
      reEsTemplate.source +
      '|' +
      reEvaluate.source +
      '|$',
    'g',
  );

  string.replace(
    reDelimiters,
    function (
      match,
      escapeValue,
      interpolateValue,
      esTemplateValue,
      evaluateValue,
      offset,
    ) {
      interpolateValue || (interpolateValue = esTemplateValue);

      // Escape characters that can't be included in string literals.
      source += string
        .slice(index, offset)
        .replace(reUnescapedString, escapeStringChar);

      // Replace delimiters with snippets.
      if (escapeValue) {
        isEscaping = true;
        source += "' +\n__e(" + escapeValue + ") +\n'";
      }
      if (evaluateValue) {
        isEvaluating = true;
        source += "';\n" + evaluateValue + ";\n__p += '";
      }
      if (interpolateValue) {
        source +=
          "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
      }
      index = offset + match.length;

      // The JS engine embedded in Adobe products needs `match` returned in
      // order to produce the correct `offset` value.
      return match;
    },
  );

  source += "';\n";

  // Cleanup code by stripping empty strings.
  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source)
    .replace(reEmptyStringMiddle, '$1')
    .replace(reEmptyStringTrailing, '$1;');

  // Frame code as the function body.
  source =
    'function(' +
    'data' +
    ') {\n' +
    "var __t, __p = ''" +
    (isEscaping ? ', __e = lodashEscape' : '') +
    (isEvaluating
      ? ', __j = Array.prototype.join;\n' +
        "function print() { __p += __j.call(arguments, '') }\n"
      : ';\n') +
    source +
    'return __p\n}';

  return { compiled: source, isEscaping };
}

module.exports = { template };
