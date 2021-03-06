(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NumberFormatter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var PATTERN_SYMBOLS_REGEX = /0|[\-+]\d/;
var NOT_PATTERN_SYMBOLS_REGEX = /[^0\.\-,+]/;
function parsePattern(pattern, options) {
    pattern = pattern.trim();
    var config = {};
    // EXTRACT PREFIX
    //---------------------
    var pattern_start = pattern.search(PATTERN_SYMBOLS_REGEX);
    if (pattern_start > 0) {
        config.prefix = pattern.substring(0, pattern_start);
        pattern = pattern.substring(pattern_start);
    }
    //---------------------
    // EXTRACT SUFFIX
    //---------------------
    var pattern_end = pattern.search(NOT_PATTERN_SYMBOLS_REGEX);
    if (pattern_end != -1) {
        config.suffix = pattern.substring(pattern_end);
        pattern = pattern.substring(0, pattern_end);
    }
    //---------------------
    config.pattern = pattern;
    // USE SIGN CHECK
    config.use_sign = pattern[0] == "-" || pattern[0] == "+";
    // TODO: ADD A SYNTAX CHECK (Maybe)
    // MASK SYNTAX CHECK
    //---------------------
    //---------------------
    // DECIMALS CHECK
    //---------------------
    var pt = pattern.indexOf(".");
    if (pt != -1) {
        config.fixedCount = pattern.length - pt - 1;
    }
    //---------------------
    // SEPARATOR CHECK
    //---------------------
    var sep = pattern.lastIndexOf(",");
    if (sep != -1) {
        config.separationSize = (pt != -1 ? pt : pattern.length) - sep - 1;
    }
    //---------------------
    // APPLY EXTRA OPTIONS
    //---------------------
    config.options = options;
    //---------------------
    return config;
}
function formatFromPattern(num, pattern, options) {
    var config = parsePattern(pattern, options);
    return formatFromConfig(num, config);
}
function formatFromConfig(num, config) {
    var _a;
    var _b = num.toString().split("."), integer = _b[0], decimal = _b[1];
    if (integer[0] == "-" || integer[0] == "+") {
        integer = integer.substr(1);
    }
    if (isNaN(num) || !integer) {
        return "";
    }
    var SEPARATOR = ((_a = config.options) === null || _a === void 0 ? void 0 : _a.separator) || ",";
    var strNum;
    if (config.separationSize) {
        var offset = integer.length % config.separationSize;
        var chunks = integer
            .substr(offset)
            .match(new RegExp("\\d{1," + config.separationSize + "}", "g"));
        if (offset && chunks)
            chunks = [integer.substr(0, offset)].concat(chunks);
        strNum = chunks ? chunks.join(SEPARATOR) : "";
    }
    var strdecimal = "";
    if (config.fixedCount) {
        if (decimal) {
            if (config.fixedCount > decimal.length) {
                strdecimal = decimal.padEnd(config.fixedCount, "0");
            }
            else {
                strdecimal = decimal.substr(0, config.fixedCount);
            }
        }
        else {
            strdecimal = "0".repeat(config.fixedCount);
        }
    }
    var sign = num == 0 ? "" : num > 0 ? "+" : "-";
    //TODO: sign on negative
    return "".concat(
    //Add Prefix
    config.prefix ? config.prefix : "", 
    //Add sign if true
    config.use_sign || num < 0 ? sign : "", 
    //Add number
    strNum ? strNum : integer, 
    //Add decimal numbers
    config.fixedCount ? "." + strdecimal : "", 
    //Add suffix
    config.suffix ? config.suffix : "");
}
module.exports = { formatFromConfig: formatFromConfig, formatFromPattern: formatFromPattern, parsePattern: parsePattern };

},{}]},{},[1])(1)
});
