'use strict';exports.__esModule = true;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);
var _sequelize = require('sequelize');var _sequelize2 = _interopRequireDefault(_sequelize);

var _contentRange = require('./content-range');var _contentRange2 = _interopRequireDefault(_contentRange);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var log = (0, _debug2.default)('koa-sequelize-resource:resources');var

Resource = function () {

  function Resource(model, options) {(0, _classCallCheck3.default)(this, Resource);
    this.model = model;

    if (_lodash2.default.isString(options)) {
      options = { idParam: options };
    }

    this.options = (0, _extends3.default)({
      idParam: 'id',
      idColumn: 'id' },
    options);

  }Resource.prototype.

  _errorHandler = function _errorHandler(err, ctx) {
    var e = _lodash2.default.cloneDeep(err);

    if (e.sql) {
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
          e.statusCode = 500;}

    } else {
      e.statusCode = 500;
    }

    ctx.status = e.statusCode;
    ctx.body = e;
  };

  // TODO: remove include
  Resource.prototype._getEntity = function () {var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(ctx, include) {var _where;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt('return',

              this.model.findOne({
                where: (_where = {}, _where[this.options.idColumn] = ctx.params[this.options.idParam], _where),
                include: include }));case 1:case 'end':return _context.stop();}}}, _callee, this);}));function _getEntity(_x, _x2) {return _ref.apply(this, arguments);}return _getEntity;}();Resource.prototype.



  _updatedHandler = function () {var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(res, ctx, next) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              log('Updated ' + this.model.name + ' ' + ctx.state.instance);

              ctx.state.instance = res;_context2.next = 4;return (
                next());case 4:
              ctx.status = 200;
              ctx.body = ctx.state.instance;case 6:case 'end':return _context2.stop();}}}, _callee2, this);}));function _updatedHandler(_x3, _x4, _x5) {return _ref2.apply(this, arguments);}return _updatedHandler;}();Resource.prototype.


  _createdHandler = function () {var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(res, ctx, next) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
              log('Created ' + this.model.name + ' ' + res);

              ctx.state.instance = res;_context3.next = 4;return (
                next());case 4:
              ctx.status = 201;
              ctx.body = ctx.state.instance;case 6:case 'end':return _context3.stop();}}}, _callee3, this);}));function _createdHandler(_x6, _x7, _x8) {return _ref3.apply(this, arguments);}return _createdHandler;}();Resource.prototype.


  getEntity = function getEntity(include) {var _this = this;
    var that = this;
    return function () {var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(ctx, next) {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                  that._getEntity(ctx, include));case 2:ctx.state.instance = _context4.sent;
                log('Loaded ' + that.model.name + ' ' + ctx.state.instance);_context4.next = 6;return (

                  next());case 6:case 'end':return _context4.stop();}}}, _callee4, _this);}));return function (_x9, _x10) {return _ref4.apply(this, arguments);};}();

  };Resource.prototype.

  create = function create() {var _this2 = this;
    var that = this;

    return function () {var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5(ctx, next) {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
                  that.model.create(ctx.request.body).
                  then(function (res) {return that._createdHandler(res, ctx, next);}).
                  catch(function (err) {return that._errorHandler(err, ctx);}));case 2:case 'end':return _context5.stop();}}}, _callee5, _this2);}));return function (_x11, _x12) {return _ref5.apply(this, arguments);};}();

  };Resource.prototype.

  update = function update(options) {var _this3 = this;
    var that = this;

    return function () {var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6(ctx, next) {var instance;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.t0 =
                ctx.state.instance;if (_context6.t0) {_context6.next = 5;break;}_context6.next = 4;return that._getEntity(ctx, []);case 4:_context6.t0 = _context6.sent;case 5:instance = _context6.t0;if (!(

                instance === null)) {_context6.next = 9;break;}
                ctx.status = 204;return _context6.abrupt('return');case 9:_context6.next = 11;return (



                  instance.update(ctx.request.body, options).
                  then(function (res) {return that._updatedHandler(res, ctx, next);}).
                  catch(function (err) {return that._errorHandler(err, ctx);}));case 11:case 'end':return _context6.stop();}}}, _callee6, _this3);}));return function (_x13, _x14) {return _ref6.apply(this, arguments);};}();

  };Resource.prototype.

  destroy = function destroy() {var _this4 = this;
    var that = this;

    return function () {var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee7(ctx, next) {var instance;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.t0 =
                ctx.state.instance;if (_context7.t0) {_context7.next = 5;break;}_context7.next = 4;return that._getEntity(ctx, []);case 4:_context7.t0 = _context7.sent;case 5:instance = _context7.t0;if (!(

                instance === null)) {_context7.next = 9;break;}
                ctx.status = 204;return _context7.abrupt('return');case 9:_context7.next = 11;return (



                  instance.destroy());case 11:

                log('Deleted ' + that.model.name + ' ' + instance);

                ctx.state.instance = instance;_context7.next = 15;return (
                  next());case 15:
                ctx.status = 204;case 16:case 'end':return _context7.stop();}}}, _callee7, _this4);}));return function (_x15, _x16) {return _ref7.apply(this, arguments);};}();

  };Resource.prototype.

  show = function show(include) {var _this5 = this;
    var that = this;

    return function () {var _ref8 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee8(ctx, next) {return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:_context8.next = 2;return (

                  that._getEntity(ctx, include));case 2:ctx.state.instance = _context8.sent;if (!(

                ctx.state.instance === null)) {_context8.next = 6;break;}
                ctx.status = 204;return _context8.abrupt('return');case 6:_context8.next = 8;return (




                  next());case 8:

                ctx.status = 200;
                ctx.body = ctx.state.instance;case 10:case 'end':return _context8.stop();}}}, _callee8, _this5);}));return function (_x17, _x18) {return _ref8.apply(this, arguments);};}();

  };Resource.prototype.

  _buildQuery = function _buildQuery(ctx) {
    var query = {};

    // parse query 
    if (!_lodash2.default.isEmpty(ctx.request.query)) {
      var originalQuery = _lodash2.default.clone(ctx.request.query);

      if (_lodash2.default.has(originalQuery, 'orderby')) {
        var order = originalQuery.orderby.substr(0, 1) == '-' ?
        originalQuery.orderby.substr(1) + ' DESC' :
        originalQuery.orderby;

        delete originalQuery.orderby;

        query = _lodash2.default.merge(query, { order: order });
      }

      var where = this.model.where && _lodash2.default.isFunction(this.model.where) ?
      this.model.where(originalQuery) :
      originalQuery;

      if (!_lodash2.default.isEmpty(where)) query = _lodash2.default.merge(query, { where: where });
    }

    return query;
  };Resource.prototype.

  index = function index() {var _this6 = this;var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var that = this;

    return function () {var _ref9 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee9(ctx, next) {var query, range, pagination, result;return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:

                query = that._buildQuery(ctx);

                // parse pagination header
                range = new _contentRange2.default(ctx.header['content-range']);
                pagination = range.parse();

                query = _lodash2.default.merge(query, pagination);

                log('Read collection:', query);if (

                _lodash2.default.isEmpty(pagination)) {_context9.next = 20;break;}if (!
                options.disableCount) {_context9.next = 13;break;}_context9.next = 9;return (
                  that.model.findAll(query));case 9:ctx.state.instances = _context9.sent;
                ctx.set('content-range', range.format(ctx.state.instances.length));_context9.next = 18;break;case 13:_context9.next = 15;return (

                  that.model.findAndCount(query));case 15:result = _context9.sent;
                ctx.state.instances = result.rows;
                ctx.set('content-range', range.format(result.rows.length, result.count));case 18:_context9.next = 23;break;case 20:_context9.next = 22;return (


                  that.model.findAll(query));case 22:ctx.state.instances = _context9.sent;case 23:_context9.next = 25;return (


                  next());case 25:

                ctx.status = _lodash2.default.isEmpty(pagination) ? 200 : 206;
                ctx.body = ctx.state.instances;case 27:case 'end':return _context9.stop();}}}, _callee9, _this6);}));return function (_x20, _x21) {return _ref9.apply(this, arguments);};}();

  };Resource.prototype.

  readAll = function readAll() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.index(options);
  };Resource.prototype.

  readOne = function readOne(include) {
    return this.readOne(include);
  };Resource.prototype.

  relations = function relations(name, parentOptions, childOptions) {
    var AssociationResource = require('./association-resource');
    var association = this.model.associations[name];

    if (association === undefined) {
      throw new Error('Cannot found the associations named "' + name + '".');
    }

    var resource = new AssociationResource(this.model, association, parentOptions, childOptions);

    return resource;
  };return Resource;}();exports.default = Resource;module.exports = exports['default'];