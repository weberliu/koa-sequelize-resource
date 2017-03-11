'use strict';exports.__esModule = true;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);
var _sequelize = require('sequelize');var _sequelize2 = _interopRequireDefault(_sequelize);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var debug = (0, _debug2.default)('koa-sequelize-resource');var

Resouce = function () {

  function Resouce(model, options) {(0, _classCallCheck3.default)(this, Resouce);
    debug(model);
    if (!model instanceof _sequelize2.default.Model) {
      throw new Error(model + ' is not instance of Sequelize model.');
    }

    this.model = model;
    this.options = (0, _extends3.default)({ idColumn: 'id' }, options);
  }Resouce.prototype.

  _handleError = function _handleError(err, ctx) {
    var e = _lodash2.default.cloneDeep(err);

    delete e.parent;
    delete e.original;
    delete e.sql;

    e.code = err.original.code;

    switch (e.code) {
      case 'ER_NO_DEFAULT_FOR_FIELD':
        e.statusCode = 400;
        break;
      case 'ER_DUP_ENTRY':
        e.statusCode = 409;
        break;
      default:
        e.statusCode = 500;
        throw e;}


    ctx.status = e.statusCode;
    ctx.body = e;
  };Resouce.prototype.

  _getEntity = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, include) {var _where;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt('return',

              this.model.findOne({
                where: (_where = {}, _where[this.options.idColumn] = ctx.params[this.options.idColumn], _where),
                include: include }));case 1:case 'end':return _context.stop();}}}, _callee, this);}));function _getEntity(_x, _x2) {return _ref.apply(this, arguments);}return _getEntity;}();Resouce.prototype.



  getEntity = function getEntity(include) {var _this = this;
    var that = this;

    return function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(ctx, next) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                  that._getEntity(ctx, include));case 2:ctx.state.instance = _context2.sent;
                debug('Loaded ' + that.model.name + ' ' + ctx.state.instance);_context2.next = 6;return (

                  next());case 6:case 'end':return _context2.stop();}}}, _callee2, _this);}));return function (_x3, _x4) {return _ref2.apply(this, arguments);};}();

  };Resouce.prototype.

  create = function create() {var _this2 = this;
    var that = this;

    return function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                  that.model.create(ctx.request.body).
                  then(function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(instance) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                              debug('Created ' + that.model.name + ' ' + instance);

                              ctx.state.instance = instance;_context3.next = 4;return (
                                next());case 4:
                              ctx.status = 201;
                              ctx.body = ctx.state.instance;case 6:case 'end':return _context3.stop();}}}, _callee3, _this2);}));return function (_x7) {return _ref4.apply(this, arguments);};}()).

                  catch(function (err) {return that._handleError(err, ctx);}));case 2:case 'end':return _context4.stop();}}}, _callee4, _this2);}));return function (_x5, _x6) {return _ref3.apply(this, arguments);};}();

  };Resouce.prototype.

  readOne = function readOne() {var _this3 = this;
    var that = this;

    return function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
                  that._getEntity(ctx, [{ all: true }]));case 2:ctx.state.instance = _context5.sent;if (!(

                ctx.state.instance === null)) {_context5.next = 6;break;}
                ctx.status = 204;return _context5.abrupt('return');case 6:_context5.next = 8;return (




                  next());case 8:

                ctx.status = 200;
                ctx.body = ctx.state.instance;case 10:case 'end':return _context5.stop();}}}, _callee5, _this3);}));return function (_x8, _x9) {return _ref5.apply(this, arguments);};}();

  };Resouce.prototype.

  readAll = function readAll(options) {var _this4 = this;
    var that = this;

    return function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                debug('Read collection');_context6.next = 3;return (
                  that.model.findAll(_lodash2.default.merge(ctx.state.where, options)));case 3:ctx.state.instances = _context6.sent;_context6.next = 6;return (

                  next());case 6:
                ctx.status = 200;
                ctx.body = ctx.state.instances;case 8:case 'end':return _context6.stop();}}}, _callee6, _this4);}));return function (_x10, _x11) {return _ref6.apply(this, arguments);};}();

  };Resouce.prototype.

  update = function update(options) {var _this5 = this;
    var that = this;

    return function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx, next) {var instance;return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:_context8.next = 2;return (
                  that._getEntity(ctx, []));case 2:instance = _context8.sent;if (!(

                instance === null)) {_context8.next = 6;break;}
                ctx.status = 204;return _context8.abrupt('return');case 6:_context8.next = 8;return (



                  instance.update(ctx.request.body, options).
                  then(function () {var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(res) {return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                              debug('Updated ' + that.model.name + ' ' + instance);

                              ctx.state.instance = res;_context7.next = 4;return (
                                next());case 4:
                              ctx.status = 200;
                              ctx.body = ctx.state.instance;case 6:case 'end':return _context7.stop();}}}, _callee7, _this5);}));return function (_x14) {return _ref8.apply(this, arguments);};}()).

                  catch(function (err) {return that._handleError(err, ctx);}));case 8:case 'end':return _context8.stop();}}}, _callee8, _this5);}));return function (_x12, _x13) {return _ref7.apply(this, arguments);};}();

  };Resouce.prototype.

  destroy = function destroy() {var _this6 = this;
    var that = this;

    return function () {var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx, next) {var instance;return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_context9.next = 2;return (
                  that._getEntity(ctx, []));case 2:instance = _context9.sent;if (!(

                instance === null)) {_context9.next = 6;break;}
                ctx.status = 204;return _context9.abrupt('return');case 6:_context9.next = 8;return (



                  instance.destroy());case 8:

                debug('Deleted ' + that.model.name + ' ' + instance);

                ctx.state.instance = instance;_context9.next = 12;return (
                  next());case 12:
                ctx.status = 204;case 13:case 'end':return _context9.stop();}}}, _callee9, _this6);}));return function (_x15, _x16) {return _ref9.apply(this, arguments);};}();

  };return Resouce;}();exports.default = Resouce;module.exports = exports['default'];