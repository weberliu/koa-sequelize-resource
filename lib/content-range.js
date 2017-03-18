'use strict';exports.__esModule = true;var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _contentRange = require('content-range');var _contentRange2 = _interopRequireDefault(_contentRange);
var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);
var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var log = (0, _debug2.default)('koa-sequelize-resource:content-range');var

pagination = function () {
  function pagination(header) {(0, _classCallCheck3.default)(this, pagination);
    this.range = _contentRange2.default.parse(header);
  }pagination.prototype.

  parse = function parse() {
    var range = this.range;

    if (_lodash2.default.isEmpty(range)) return;

    log('Content Range', range);

    return { offset: range.first, limit: range.length };
  };pagination.prototype.

  format = function format(length, total) {
    var range = this.range;

    if (_lodash2.default.isEmpty(range)) return;

    return _contentRange2.default.format({
      unit: range.unit,
      first: range.first,
      limit: range.first + (length || 0) - 1,
      length: total || length || 0 });

  };return pagination;}();exports.default = pagination;module.exports = exports['default'];