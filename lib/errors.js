// @ts-nocheck
"use strict";

module.exports = function (err) {
  return {
    toHtml: function () {
      return "Html Webpack Plugin:\n<pre>\n" + this.toString() + "</pre>";
    },
    toJsonHtml: function () {
      return JSON.stringify(this.toHtml());
    },
    toString: function () {
      if (err.message) {
        err.message = `[html-rspack-plugin]: ` + err.message; 
      }
      return err;
    }
  };
};
