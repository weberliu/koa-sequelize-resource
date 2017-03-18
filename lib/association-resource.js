'use strict';exports.__esModule = true;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);

var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);
var _inflection = require('inflection');var _inflection2 = _interopRequireDefault(_inflection);

var _contentRange = require('./content-range');var _contentRange2 = _interopRequireDefault(_contentRange);
var _resource = require('./resource');var _resource2 = _interopRequireDefault(_resource);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var log = (0, _debug2.default)('koa-sequelize-resource:associations');var

AssociationResource = function (_Resource) {(0, _inherits3.default)(AssociationResource, _Resource);
  function AssociationResource(parent, association, parentOptions, childOptions) {(0, _classCallCheck3.default)(this, AssociationResource);var _this = (0, _possibleConstructorReturn3.default)(this,
    _Resource.call(this, association.target, childOptions));

    _this.alias = association.as;
    _this.associationType = association.associationType;
    _this.isMany = _this.associationType == 'HasMany' || _this.associationType == 'BelongsToMany';
    _this.parent = new _resource2.default(parent, parentOptions);

    var capitalize = _inflection2.default.capitalize(_this.alias);

    _this.setMethod = 'set' + capitalize;
    _this.getMethod = _this.isMany ?
    'get' + _inflection2.default.pluralize(capitalize) :
    'get' + capitalize;

    _this.addMethod = 'add' + capitalize;return _this;
  }AssociationResource.prototype.

  _fetchParent = function _fetchParent() {var _this2 = this;
    var that = this;
    return function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, next) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (
                ctx.state.instance) {_context.next = 5;break;}
                ctx.status = 204;return _context.abrupt('return',
                true);case 5:

                ctx.state.parent = ctx.state.instance;

                if (that.isMany) {
                  ctx.state.collection = ctx.state.parent[that.getMethod];
                }_context.next = 9;return (

                  next());case 9:case 'end':return _context.stop();}}}, _callee, _this2);}));return function (_x, _x2) {return _ref.apply(this, arguments);};}();


  };AssociationResource.prototype.

  index = function index() {var _this3 = this;var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var that = this;

    return [
    that.parent.getEntity(),
    that._fetchParent(), function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(

      function _callee2(ctx, next) {var range, pagination, query, countMethod, count;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
                range = new _contentRange2.default(ctx.header['content-range']);
                pagination = range.parse();
                query = that._buildQuery(ctx);

                log('Association query: ', query);_context2.next = 6;return (

                  ctx.state.parent[that.getMethod](_lodash2.default.merge({}, query, pagination)));case 6:ctx.state.instances = _context2.sent;if (

                _lodash2.default.isEmpty(pagination)) {_context2.next = 19;break;}
                countMethod = 'count' + _inflection2.default.capitalize(that.alias);if (!(
                options && options.disableCount)) {_context2.next = 13;break;}_context2.t0 =
                ctx.state.instances.length;_context2.next = 16;break;case 13:_context2.next = 15;return (
                  ctx.state.parent[countMethod](query));case 15:_context2.t0 = _context2.sent;case 16:count = _context2.t0;

                log(countMethod, count);
                ctx.set('content-range', range.format(ctx.state.instances.length, count));case 19:_context2.next = 21;return (


                  next());case 21:

                ctx.status = _lodash2.default.isEmpty(pagination) ? 200 : 206;
                ctx.body = ctx.state.instances;case 23:case 'end':return _context2.stop();}}}, _callee2, _this3);}));return function (_x4, _x5) {return _ref2.apply(this, arguments);};}()];


  };AssociationResource.prototype.

  show = function show() {var _this4 = this;
    return [
    this.parent.getEntity({ model: this.model, as: this.alias }),
    this._fetchParent(), function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(

      function _callee3(ctx, next) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
                ctx.state.instance = ctx.state.parent[_this4.alias];_context3.next = 3;return (

                  next());case 3:

                ctx.status = 200;
                ctx.body = ctx.state.instance;case 5:case 'end':return _context3.stop();}}}, _callee3, _this4);}));return function (_x6, _x7) {return _ref3.apply(this, arguments);};}()];


  };AssociationResource.prototype.

  create = function create() {var _this5 = this;
    var that = this;

    return [
    that.parent.getEntity({ model: that.model, as: that.alias }),
    that._fetchParent(), function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(

      function _callee4(ctx, next) {var newInstance, promise;return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:
                newInstance = that.model.build(ctx.request.body);
                promise = that.isMany ?
                ctx.state.parent[that.addMethod](newInstance) :
                ctx.state.parent[that.setMethod](newInstance);_context4.next = 4;return (

                  promise.
                  then(function (res) {return that._createdHandler(res, ctx, next);}).
                  catch(function (err) {return that._errorHandler(err, ctx);}));case 4:case 'end':return _context4.stop();}}}, _callee4, _this5);}));return function (_x8, _x9) {return _ref4.apply(this, arguments);};}()];


  };AssociationResource.prototype.

  update = function update() {var _this6 = this;
    var that = this;

    var updateOne = function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {var newInstance;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
                newInstance = that.model.build(ctx.request.body);_context5.next = 3;return (
                  ctx.state.parent[that.setMethod](newInstance).
                  then(function (res) {return that._updatedHandler(res, ctx, next);}).
                  catch(function (err) {return that._errorHandler(err, ctx);}));case 3:case 'end':return _context5.stop();}}}, _callee5, _this6);}));return function updateOne(_x10, _x11) {return _ref5.apply(this, arguments);};}();


    var fn = [
    that.parent.getEntity({ model: that.model, as: that.alias }),
    that._fetchParent()];


    if (that.isMany) {
      fn.push(that._fetchOne());
      fn.push(_Resource.prototype.update.call(this));
    } else {
      fn.push(updateOne);
    }

    return fn;
  };AssociationResource.prototype.

  destroy = function destroy() {var _this7 = this;
    var that = this;

    var fn = [
    this.parent.getEntity({ model: this.model, as: this.alias }),
    this._fetchParent()];


    var destoryOne = function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
                ctx.state.instance = ctx.state.parent[_this7.alias];_context6.next = 3;return (

                  ctx.state.instance.destroy());case 3:_context6.next = 5;return (
                  next());case 5:

                ctx.status = 204;case 6:case 'end':return _context6.stop();}}}, _callee6, _this7);}));return function destoryOne(_x12, _x13) {return _ref6.apply(this, arguments);};}();


    if (this.isMany) {
      fn.push(that._fetchOne());
      fn.push(_Resource.prototype.destroy.call(this));
    } else {
      fn.push(destoryOne);
    }

    return fn;
  };AssociationResource.prototype.

  _fetchOne = function _fetchOne() {var _this8 = this;
    var that = this;

    return function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx, next) {var _where;var fn, instances;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                fn = 'get' + _inflection2.default.capitalize(that.alias);_context7.next = 3;return (
                  ctx.state.parent[fn]({ where: (_where = {}, _where[that.options.idColumn] = ctx.params[that.options.idParam], _where) }));case 3:instances = _context7.sent;if (!(

                instances.length > 0)) {_context7.next = 10;break;}
                ctx.state.instance = instances[0];_context7.next = 8;return (
                  next());case 8:_context7.next = 11;break;case 10:

                ctx.status = 204;case 11:case 'end':return _context7.stop();}}}, _callee7, _this8);}));return function (_x14, _x15) {return _ref7.apply(this, arguments);};}();


  };return AssociationResource;}(_resource2.default);exports.default = AssociationResource;module.exports = exports['default'];