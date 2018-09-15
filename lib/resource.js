'use strict';exports.__esModule = true;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _extends2 = require('babel-runtime/helpers/extends');var _extends3 = _interopRequireDefault(_extends2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var debug = (0, _debug2.default)('ksr:resources');var

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
    var e = { statusCode: 500 };

    if (err.sql) {var _err$original =
      err.original,code = _err$original.code,errno = _err$original.errno,sqlMessage = _err$original.sqlMessage;
      switch (code) {
        case 'ER_NO_DEFAULT_FOR_FIELD':
          e.statusCode = 400;
          break;
        case 'ER_DUP_ENTRY':
          e.statusCode = 409;
          break;
        default:
          e.statusCode = 500;}

      e.errorno = errno;
      e.errmessage = sqlMessage;
    }

    ctx.status = e.statusCode;
    ctx.body = e;
  };

  // TODO: remove include
  Resource.prototype._getEntity = function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, include) {var _where;return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:return _context.abrupt('return',

              this.model.findOne({
                where: (_where = {}, _where[this.options.idColumn] = ctx.params[this.options.idParam], _where),
                include: include }));case 1:case 'end':return _context.stop();}}}, _callee, this);}));function _getEntity(_x, _x2) {return _ref.apply(this, arguments);}return _getEntity;}();Resource.prototype.



  _updatedHandler = function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(res, ctx, next) {return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:
              debug('Updated ' + this.model.name + ' ' + ctx.state.instance);

              ctx.state.instance = res;_context2.next = 4;return (
                next());case 4:
              ctx.status = 200;
              ctx.body = ctx.state.instance;case 6:case 'end':return _context2.stop();}}}, _callee2, this);}));function _updatedHandler(_x3, _x4, _x5) {return _ref2.apply(this, arguments);}return _updatedHandler;}();Resource.prototype.


  _createdHandler = function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(res, ctx, next) {return _regenerator2.default.wrap(function _callee3$(_context3) {while (1) {switch (_context3.prev = _context3.next) {case 0:
              debug('Created ' + this.model.name + ' ' + res);

              ctx.state.instance = res;_context3.next = 4;return (
                next());case 4:
              ctx.status = 201;
              ctx.body = ctx.state.instance;case 6:case 'end':return _context3.stop();}}}, _callee3, this);}));function _createdHandler(_x6, _x7, _x8) {return _ref3.apply(this, arguments);}return _createdHandler;}();Resource.prototype.


  _buildQuery = function _buildQuery(ctx) {
    var query = void 0,sortedBy = void 0,pagination = void 0;

    if (!_lodash2.default.isEmpty(ctx.request.query)) {
      var originalQuery = _lodash2.default.clone(ctx.request.query);

      // parse ordering
      if (_lodash2.default.has(originalQuery, 'sort')) {
        sortedBy = originalQuery.sort.
        split(',').
        map(function (f) {return f.substr(0, 1) === '-' ? [f.substr(1), 'DESC'] : f;});

        debug('order by %o', sortedBy);
        delete originalQuery.sort;

        query = _lodash2.default.merge(query, { order: sortedBy });
      }

      // parse pagination
      if (_lodash2.default.has(originalQuery, 'limit')) {var
        limit = originalQuery.limit,offset = originalQuery.offset;
        pagination = { limit: parseInt(limit, 10), offset: parseInt(offset, 10) || 0 };

        query = _lodash2.default.merge(query, pagination);
        delete originalQuery.limit;
        delete originalQuery.offset;
      }

      // parse query string
      var where = this.model.filter && _lodash2.default.isFunction(this.model.filter) ?
      this.model.filter(originalQuery) :
      originalQuery;

      if (!_lodash2.default.isEmpty(where)) query = _lodash2.default.merge(query, { where: where });
    }

    return { query: query, sortedBy: sortedBy, pagination: pagination };
  };Resource.prototype.

  _buildPagination = function _buildPagination(disableCount, count, pagination) {
    pagination = _lodash2.default.merge(pagination, { pageCount: 0, totalCount: 0 });

    if (!disableCount) {
      pagination.totalCount = count;
      pagination.pageCount = Math.ceil(count / pagination.limit);
      pagination.currentPage = Math.ceil(pagination.offset / pagination.limit) + 1;
    }

    var nextOffset = pagination.offset + pagination.limit;
    pagination.nextOffset = pagination.totalCount > nextOffset ? nextOffset : 0;
    pagination.prevOffset = _lodash2.default.max([0, pagination.limit - pagination.offset]);

    return pagination;
  };Resource.prototype.

  getEntity = function getEntity(include) {var _this = this;
    var that = this;
    return function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(ctx, next) {return _regenerator2.default.wrap(function _callee4$(_context4) {while (1) {switch (_context4.prev = _context4.next) {case 0:_context4.next = 2;return (
                  that._getEntity(ctx, include));case 2:ctx.state.instance = _context4.sent;
                debug('Loaded model: ' + that.model.name);_context4.next = 6;return (

                  next());case 6:case 'end':return _context4.stop();}}}, _callee4, _this);}));return function (_x9, _x10) {return _ref4.apply(this, arguments);};}();

  };Resource.prototype.

  create = function create() {var _this2 = this;
    var that = this;

    return function () {var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx, next) {return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:_context5.next = 2;return (
                  that.model.create(ctx.request.body).
                  then(function (res) {return that._createdHandler(res, ctx, next);}).
                  catch(function (err) {return that._errorHandler(err, ctx);}));case 2:case 'end':return _context5.stop();}}}, _callee5, _this2);}));return function (_x11, _x12) {return _ref5.apply(this, arguments);};}();

  };Resource.prototype.

  update = function update(options) {var _this3 = this;
    var that = this;

    return function () {var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx, next) {var instance;return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:_context6.t0 =
                ctx.state.instance;if (_context6.t0) {_context6.next = 5;break;}_context6.next = 4;return that._getEntity(ctx, []);case 4:_context6.t0 = _context6.sent;case 5:instance = _context6.t0;if (!(

                instance === null)) {_context6.next = 9;break;}
                ctx.status = 204;return _context6.abrupt('return');case 9:_context6.next = 11;return (



                  instance.update(ctx.request.body, options).
                  then(function (res) {return that._updatedHandler(res, ctx, next);}).
                  catch(function (err) {return that._errorHandler(err, ctx);}));case 11:case 'end':return _context6.stop();}}}, _callee6, _this3);}));return function (_x13, _x14) {return _ref6.apply(this, arguments);};}();

  };Resource.prototype.

  destroy = function destroy() {var _this4 = this;
    var that = this;

    return function () {var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx, next) {var instance;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:_context7.t0 =
                ctx.state.instance;if (_context7.t0) {_context7.next = 5;break;}_context7.next = 4;return that._getEntity(ctx, []);case 4:_context7.t0 = _context7.sent;case 5:instance = _context7.t0;if (!(

                instance === null)) {_context7.next = 9;break;}
                ctx.status = 204;return _context7.abrupt('return');case 9:_context7.next = 11;return (



                  instance.destroy());case 11:

                debug('Deleted ' + that.model.name + ' ' + instance);

                ctx.state.instance = instance;_context7.next = 15;return (
                  next());case 15:
                ctx.status = 204;case 16:case 'end':return _context7.stop();}}}, _callee7, _this4);}));return function (_x15, _x16) {return _ref7.apply(this, arguments);};}();

  };Resource.prototype.

  item = function item(include) {var _this5 = this;
    var that = this;

    return function () {var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(ctx, next) {return _regenerator2.default.wrap(function _callee8$(_context8) {while (1) {switch (_context8.prev = _context8.next) {case 0:_context8.next = 2;return (

                  that._getEntity(ctx, include));case 2:ctx.state.instance = _context8.sent;if (!(

                ctx.state.instance === null)) {_context8.next = 6;break;}
                ctx.status = 204;return _context8.abrupt('return');case 6:_context8.next = 8;return (




                  next());case 8:

                ctx.status = 200;
                ctx.body = ctx.state.instance;case 10:case 'end':return _context8.stop();}}}, _callee8, _this5);}));return function (_x17, _x18) {return _ref8.apply(this, arguments);};}();

  };Resource.prototype.

  all = function all() {var _this6 = this;var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var that = this;

    return function () {var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(ctx, next) {var _buildQuery2, query, pagination, sortedBy, count;return _regenerator2.default.wrap(function _callee9$(_context9) {while (1) {switch (_context9.prev = _context9.next) {case 0:_buildQuery2 =
                _this6._buildQuery(ctx), query = _buildQuery2.query, pagination = _buildQuery2.pagination, sortedBy = _buildQuery2.sortedBy;

                debug('Read collection:', query);_context9.next = 4;return (
                  that.model.findAll(query));case 4:ctx.state.instances = _context9.sent;if (

                _lodash2.default.isEmpty(pagination)) {_context9.next = 10;break;}_context9.next = 8;return (
                  that.model.count(query));case 8:count = _context9.sent;
                pagination = _this6._buildPagination(options.disableCount, count, pagination);case 10:_context9.next = 12;return (


                  next());case 12:

                ctx.body = {
                  items: ctx.state.instances,
                  metadata: { pagination: pagination, sortedBy: sortedBy } };case 13:case 'end':return _context9.stop();}}}, _callee9, _this6);}));return function (_x20, _x21) {return _ref9.apply(this, arguments);};}();


  };Resource.prototype.

  readAll = function readAll() {var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return this.all(options);
  };Resource.prototype.

  readOne = function readOne(include) {
    return this.readOne(include);
  };Resource.prototype.

  relations = function relations(name, parentOptions, childOptions) {

    var association = this.model.associations[name];

    if (association === undefined) {
      throw new Error('Cannot found the associations named "' + name + '".');
    }

    return new AssociationResource(this.model, association, parentOptions, childOptions);
  };return Resource;}();exports.default = Resource;


var AssociationResource = require('./association-resource');module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXNvdXJjZS5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIlJlc291cmNlIiwibW9kZWwiLCJvcHRpb25zIiwiXyIsImlzU3RyaW5nIiwiaWRQYXJhbSIsImlkQ29sdW1uIiwiX2Vycm9ySGFuZGxlciIsImVyciIsImN0eCIsImUiLCJzdGF0dXNDb2RlIiwic3FsIiwib3JpZ2luYWwiLCJjb2RlIiwiZXJybm8iLCJzcWxNZXNzYWdlIiwiZXJyb3JubyIsImVycm1lc3NhZ2UiLCJzdGF0dXMiLCJib2R5IiwiX2dldEVudGl0eSIsImluY2x1ZGUiLCJmaW5kT25lIiwid2hlcmUiLCJwYXJhbXMiLCJfdXBkYXRlZEhhbmRsZXIiLCJyZXMiLCJuZXh0IiwibmFtZSIsInN0YXRlIiwiaW5zdGFuY2UiLCJfY3JlYXRlZEhhbmRsZXIiLCJfYnVpbGRRdWVyeSIsInF1ZXJ5Iiwic29ydGVkQnkiLCJwYWdpbmF0aW9uIiwiaXNFbXB0eSIsInJlcXVlc3QiLCJvcmlnaW5hbFF1ZXJ5IiwiY2xvbmUiLCJoYXMiLCJzb3J0Iiwic3BsaXQiLCJtYXAiLCJmIiwic3Vic3RyIiwibWVyZ2UiLCJvcmRlciIsImxpbWl0Iiwib2Zmc2V0IiwicGFyc2VJbnQiLCJmaWx0ZXIiLCJpc0Z1bmN0aW9uIiwiX2J1aWxkUGFnaW5hdGlvbiIsImRpc2FibGVDb3VudCIsImNvdW50IiwicGFnZUNvdW50IiwidG90YWxDb3VudCIsIk1hdGgiLCJjZWlsIiwiY3VycmVudFBhZ2UiLCJuZXh0T2Zmc2V0IiwicHJldk9mZnNldCIsIm1heCIsImdldEVudGl0eSIsInRoYXQiLCJjcmVhdGUiLCJ0aGVuIiwiY2F0Y2giLCJ1cGRhdGUiLCJkZXN0cm95IiwiaXRlbSIsImFsbCIsImZpbmRBbGwiLCJpbnN0YW5jZXMiLCJpdGVtcyIsIm1ldGFkYXRhIiwicmVhZEFsbCIsInJlYWRPbmUiLCJyZWxhdGlvbnMiLCJwYXJlbnRPcHRpb25zIiwiY2hpbGRPcHRpb25zIiwiYXNzb2NpYXRpb24iLCJhc3NvY2lhdGlvbnMiLCJ1bmRlZmluZWQiLCJFcnJvciIsIkFzc29jaWF0aW9uUmVzb3VyY2UiLCJyZXF1aXJlIl0sIm1hcHBpbmdzIjoieWhCQUFBLGdDO0FBQ0EsOEI7O0FBRUEsSUFBTUEsUUFBUSxxQkFBUSxlQUFSLENBQWQsQzs7QUFFcUJDLFE7QUFDbkIsb0JBQWFDLEtBQWIsRUFBb0JDLE9BQXBCLEVBQTZCO0FBQzNCLFNBQUtELEtBQUwsR0FBYUEsS0FBYjs7QUFFQSxRQUFJRSxpQkFBRUMsUUFBRixDQUFXRixPQUFYLENBQUosRUFBeUI7QUFDdkJBLGdCQUFVLEVBQUVHLFNBQVNILE9BQVgsRUFBVjtBQUNEOztBQUVELFNBQUtBLE9BQUw7QUFDRUcsZUFBUyxJQURYO0FBRUVDLGdCQUFVLElBRlo7QUFHS0osV0FITDs7QUFLRCxHOztBQUVESyxlLDBCQUFlQyxHLEVBQUtDLEcsRUFBSztBQUN2QixRQUFNQyxJQUFJLEVBQUVDLFlBQVksR0FBZCxFQUFWOztBQUVBLFFBQUlILElBQUlJLEdBQVIsRUFBYTtBQUN5QkosVUFBSUssUUFEN0IsQ0FDSEMsSUFERyxpQkFDSEEsSUFERyxDQUNHQyxLQURILGlCQUNHQSxLQURILENBQ1VDLFVBRFYsaUJBQ1VBLFVBRFY7QUFFWCxjQUFRRixJQUFSO0FBQ0UsYUFBSyx5QkFBTDtBQUNFSixZQUFFQyxVQUFGLEdBQWUsR0FBZjtBQUNBO0FBQ0YsYUFBSyxjQUFMO0FBQ0VELFlBQUVDLFVBQUYsR0FBZSxHQUFmO0FBQ0E7QUFDRjtBQUNFRCxZQUFFQyxVQUFGLEdBQWUsR0FBZixDQVJKOztBQVVBRCxRQUFFTyxPQUFGLEdBQVlGLEtBQVo7QUFDQUwsUUFBRVEsVUFBRixHQUFlRixVQUFmO0FBQ0Q7O0FBRURQLFFBQUlVLE1BQUosR0FBYVQsRUFBRUMsVUFBZjtBQUNBRixRQUFJVyxJQUFKLEdBQVdWLENBQVg7QUFDRCxHOztBQUVEO3FCQUNNVyxVLHFIQUFZWixHLEVBQUthLE87O0FBRWQsbUJBQUtyQixLQUFMLENBQVdzQixPQUFYLENBQW1CO0FBQ3hC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O0FBQ0QsRyx1Q0E5T2tCbEYsUTs7O0FBaVByQixJQUFNdUYsc0JBQXNCQyxRQUFRLHdCQUFSLENBQTVCLEMiLCJmaWxlIjoicmVzb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgZGVidWdlciBmcm9tICdkZWJ1ZydcblxuY29uc3QgZGVidWcgPSBkZWJ1Z2VyKCdrc3I6cmVzb3VyY2VzJylcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvciAobW9kZWwsIG9wdGlvbnMpIHtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWxcblxuICAgIGlmIChfLmlzU3RyaW5nKG9wdGlvbnMpKSB7XG4gICAgICBvcHRpb25zID0geyBpZFBhcmFtOiBvcHRpb25zIH1cbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICBpZFBhcmFtOiAnaWQnLFxuICAgICAgaWRDb2x1bW46ICdpZCcsXG4gICAgICAuLi5vcHRpb25zXG4gICAgfVxuICB9XG5cbiAgX2Vycm9ySGFuZGxlciAoZXJyLCBjdHgpIHtcbiAgICBjb25zdCBlID0geyBzdGF0dXNDb2RlOiA1MDAgfVxuXG4gICAgaWYgKGVyci5zcWwpIHtcbiAgICAgIGNvbnN0IHsgY29kZSwgZXJybm8sIHNxbE1lc3NhZ2UgfSA9IGVyci5vcmlnaW5hbFxuICAgICAgc3dpdGNoIChjb2RlKSB7XG4gICAgICAgIGNhc2UgJ0VSX05PX0RFRkFVTFRfRk9SX0ZJRUxEJzpcbiAgICAgICAgICBlLnN0YXR1c0NvZGUgPSA0MDBcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdFUl9EVVBfRU5UUlknOlxuICAgICAgICAgIGUuc3RhdHVzQ29kZSA9IDQwOVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZS5zdGF0dXNDb2RlID0gNTAwXG4gICAgICB9XG4gICAgICBlLmVycm9ybm8gPSBlcnJub1xuICAgICAgZS5lcnJtZXNzYWdlID0gc3FsTWVzc2FnZVxuICAgIH1cblxuICAgIGN0eC5zdGF0dXMgPSBlLnN0YXR1c0NvZGVcbiAgICBjdHguYm9keSA9IGVcbiAgfVxuXG4gIC8vIFRPRE86IHJlbW92ZSBpbmNsdWRlXG4gIGFzeW5jIF9nZXRFbnRpdHkgKGN0eCwgaW5jbHVkZSkge1xuICAgIC8vIEZldGNoIHRoZSBlbnRpdHlcbiAgICByZXR1cm4gdGhpcy5tb2RlbC5maW5kT25lKHtcbiAgICAgIHdoZXJlOiB7IFt0aGlzLm9wdGlvbnMuaWRDb2x1bW5dOiBjdHgucGFyYW1zW3RoaXMub3B0aW9ucy5pZFBhcmFtXSB9LFxuICAgICAgaW5jbHVkZTogaW5jbHVkZVxuICAgIH0pXG4gIH1cblxuICBhc3luYyBfdXBkYXRlZEhhbmRsZXIgKHJlcywgY3R4LCBuZXh0KSB7XG4gICAgZGVidWcoYFVwZGF0ZWQgJHt0aGlzLm1vZGVsLm5hbWV9ICR7Y3R4LnN0YXRlLmluc3RhbmNlfWApXG5cbiAgICBjdHguc3RhdGUuaW5zdGFuY2UgPSByZXNcbiAgICBhd2FpdCBuZXh0KClcbiAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgY3R4LmJvZHkgPSBjdHguc3RhdGUuaW5zdGFuY2VcbiAgfVxuXG4gIGFzeW5jIF9jcmVhdGVkSGFuZGxlciAocmVzLCBjdHgsIG5leHQpIHtcbiAgICBkZWJ1ZyhgQ3JlYXRlZCAke3RoaXMubW9kZWwubmFtZX0gJHtyZXN9YClcblxuICAgIGN0eC5zdGF0ZS5pbnN0YW5jZSA9IHJlc1xuICAgIGF3YWl0IG5leHQoKVxuICAgIGN0eC5zdGF0dXMgPSAyMDFcbiAgICBjdHguYm9keSA9IGN0eC5zdGF0ZS5pbnN0YW5jZVxuICB9XG5cbiAgX2J1aWxkUXVlcnkgKGN0eCkge1xuICAgIGxldCBxdWVyeSwgc29ydGVkQnksIHBhZ2luYXRpb25cblxuICAgIGlmICghXy5pc0VtcHR5KGN0eC5yZXF1ZXN0LnF1ZXJ5KSkge1xuICAgICAgY29uc3Qgb3JpZ2luYWxRdWVyeSA9IF8uY2xvbmUoY3R4LnJlcXVlc3QucXVlcnkpXG5cbiAgICAgIC8vIHBhcnNlIG9yZGVyaW5nXG4gICAgICBpZiAoXy5oYXMob3JpZ2luYWxRdWVyeSwgJ3NvcnQnKSkge1xuICAgICAgICBzb3J0ZWRCeSA9IG9yaWdpbmFsUXVlcnkuc29ydFxuICAgICAgICAgIC5zcGxpdCgnLCcpXG4gICAgICAgICAgLm1hcChmID0+IChmLnN1YnN0cigwLCAxKSA9PT0gJy0nID8gW2Yuc3Vic3RyKDEpLCAnREVTQyddIDogZikpXG5cbiAgICAgICAgZGVidWcoJ29yZGVyIGJ5ICVvJywgc29ydGVkQnkpXG4gICAgICAgIGRlbGV0ZSBvcmlnaW5hbFF1ZXJ5LnNvcnRcblxuICAgICAgICBxdWVyeSA9IF8ubWVyZ2UocXVlcnksIHsgb3JkZXI6IHNvcnRlZEJ5IH0pXG4gICAgICB9XG5cbiAgICAgIC8vIHBhcnNlIHBhZ2luYXRpb25cbiAgICAgIGlmIChfLmhhcyhvcmlnaW5hbFF1ZXJ5LCAnbGltaXQnKSkge1xuICAgICAgICBjb25zdCB7IGxpbWl0LCBvZmZzZXQgfSA9IG9yaWdpbmFsUXVlcnlcbiAgICAgICAgcGFnaW5hdGlvbiA9IHsgbGltaXQ6IHBhcnNlSW50KGxpbWl0LCAxMCksIG9mZnNldDogcGFyc2VJbnQob2Zmc2V0LCAxMCkgfHwgMCB9XG5cbiAgICAgICAgcXVlcnkgPSBfLm1lcmdlKHF1ZXJ5LCBwYWdpbmF0aW9uKVxuICAgICAgICBkZWxldGUgb3JpZ2luYWxRdWVyeS5saW1pdFxuICAgICAgICBkZWxldGUgb3JpZ2luYWxRdWVyeS5vZmZzZXRcbiAgICAgIH1cblxuICAgICAgLy8gcGFyc2UgcXVlcnkgc3RyaW5nXG4gICAgICBsZXQgd2hlcmUgPSB0aGlzLm1vZGVsLmZpbHRlciAmJiBfLmlzRnVuY3Rpb24odGhpcy5tb2RlbC5maWx0ZXIpXG4gICAgICAgID8gdGhpcy5tb2RlbC5maWx0ZXIob3JpZ2luYWxRdWVyeSlcbiAgICAgICAgOiBvcmlnaW5hbFF1ZXJ5XG5cbiAgICAgIGlmICghXy5pc0VtcHR5KHdoZXJlKSkgcXVlcnkgPSBfLm1lcmdlKHF1ZXJ5LCB7IHdoZXJlIH0pXG4gICAgfVxuXG4gICAgcmV0dXJuIHsgcXVlcnksIHNvcnRlZEJ5LCBwYWdpbmF0aW9uIH1cbiAgfVxuXG4gIF9idWlsZFBhZ2luYXRpb24gKGRpc2FibGVDb3VudCwgY291bnQsIHBhZ2luYXRpb24pIHtcbiAgICBwYWdpbmF0aW9uID0gXy5tZXJnZShwYWdpbmF0aW9uLCB7IHBhZ2VDb3VudDogMCwgdG90YWxDb3VudDogMCB9KVxuXG4gICAgaWYgKCFkaXNhYmxlQ291bnQpIHtcbiAgICAgIHBhZ2luYXRpb24udG90YWxDb3VudCA9IGNvdW50XG4gICAgICBwYWdpbmF0aW9uLnBhZ2VDb3VudCA9IE1hdGguY2VpbChjb3VudCAvIHBhZ2luYXRpb24ubGltaXQpXG4gICAgICBwYWdpbmF0aW9uLmN1cnJlbnRQYWdlID0gTWF0aC5jZWlsKHBhZ2luYXRpb24ub2Zmc2V0IC8gcGFnaW5hdGlvbi5saW1pdCkgKyAxXG4gICAgfVxuXG4gICAgbGV0IG5leHRPZmZzZXQgPSBwYWdpbmF0aW9uLm9mZnNldCArIHBhZ2luYXRpb24ubGltaXRcbiAgICBwYWdpbmF0aW9uLm5leHRPZmZzZXQgPSAocGFnaW5hdGlvbi50b3RhbENvdW50ID4gbmV4dE9mZnNldCkgPyBuZXh0T2Zmc2V0IDogMFxuICAgIHBhZ2luYXRpb24ucHJldk9mZnNldCA9IF8ubWF4KFswLCBwYWdpbmF0aW9uLmxpbWl0IC0gcGFnaW5hdGlvbi5vZmZzZXRdKVxuXG4gICAgcmV0dXJuIHBhZ2luYXRpb25cbiAgfVxuXG4gIGdldEVudGl0eSAoaW5jbHVkZSkge1xuICAgIGxldCB0aGF0ID0gdGhpc1xuICAgIHJldHVybiBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG4gICAgICBjdHguc3RhdGUuaW5zdGFuY2UgPSBhd2FpdCB0aGF0Ll9nZXRFbnRpdHkoY3R4LCBpbmNsdWRlKVxuICAgICAgZGVidWcoYExvYWRlZCBtb2RlbDogJHt0aGF0Lm1vZGVsLm5hbWV9YClcblxuICAgICAgYXdhaXQgbmV4dCgpXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZSAoKSB7XG4gICAgbGV0IHRoYXQgPSB0aGlzXG5cbiAgICByZXR1cm4gYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuICAgICAgYXdhaXQgdGhhdC5tb2RlbC5jcmVhdGUoY3R4LnJlcXVlc3QuYm9keSlcbiAgICAgICAgLnRoZW4ocmVzID0+IHRoYXQuX2NyZWF0ZWRIYW5kbGVyKHJlcywgY3R4LCBuZXh0KSlcbiAgICAgICAgLmNhdGNoKGVyciA9PiB0aGF0Ll9lcnJvckhhbmRsZXIoZXJyLCBjdHgpKVxuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZSAob3B0aW9ucykge1xuICAgIGxldCB0aGF0ID0gdGhpc1xuXG4gICAgcmV0dXJuIGFzeW5jIChjdHgsIG5leHQpID0+IHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gY3R4LnN0YXRlLmluc3RhbmNlIHx8IGF3YWl0IHRoYXQuX2dldEVudGl0eShjdHgsIFtdKVxuXG4gICAgICBpZiAoaW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgY3R4LnN0YXR1cyA9IDIwNFxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgYXdhaXQgaW5zdGFuY2UudXBkYXRlKGN0eC5yZXF1ZXN0LmJvZHksIG9wdGlvbnMpXG4gICAgICAgIC50aGVuKHJlcyA9PiB0aGF0Ll91cGRhdGVkSGFuZGxlcihyZXMsIGN0eCwgbmV4dCkpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gdGhhdC5fZXJyb3JIYW5kbGVyKGVyciwgY3R4KSlcbiAgICB9XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICBsZXQgdGhhdCA9IHRoaXNcblxuICAgIHJldHVybiBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG4gICAgICBjb25zdCBpbnN0YW5jZSA9IGN0eC5zdGF0ZS5pbnN0YW5jZSB8fCBhd2FpdCB0aGF0Ll9nZXRFbnRpdHkoY3R4LCBbXSlcblxuICAgICAgaWYgKGluc3RhbmNlID09PSBudWxsKSB7XG4gICAgICAgIGN0eC5zdGF0dXMgPSAyMDRcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGluc3RhbmNlLmRlc3Ryb3koKVxuXG4gICAgICBkZWJ1ZyhgRGVsZXRlZCAke3RoYXQubW9kZWwubmFtZX0gJHtpbnN0YW5jZX1gKVxuXG4gICAgICBjdHguc3RhdGUuaW5zdGFuY2UgPSBpbnN0YW5jZVxuICAgICAgYXdhaXQgbmV4dCgpXG4gICAgICBjdHguc3RhdHVzID0gMjA0XG4gICAgfVxuICB9XG5cbiAgaXRlbSAoaW5jbHVkZSkge1xuICAgIGxldCB0aGF0ID0gdGhpc1xuXG4gICAgcmV0dXJuIGFzeW5jIChjdHgsIG5leHQpID0+IHtcbiAgICAgIC8vIGN0eC5zdGF0ZS5pbnN0YW5jZSA9IGF3YWl0IHRoYXQuX2dldEVudGl0eShjdHgsIFt7IGFsbDogdHJ1ZSB9XSlcbiAgICAgIGN0eC5zdGF0ZS5pbnN0YW5jZSA9IGF3YWl0IHRoYXQuX2dldEVudGl0eShjdHgsIGluY2x1ZGUpXG5cbiAgICAgIGlmIChjdHguc3RhdGUuaW5zdGFuY2UgPT09IG51bGwpIHtcbiAgICAgICAgY3R4LnN0YXR1cyA9IDIwNFxuXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBhd2FpdCBuZXh0KClcblxuICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgY3R4LmJvZHkgPSBjdHguc3RhdGUuaW5zdGFuY2VcbiAgICB9XG4gIH1cblxuICBhbGwgKG9wdGlvbnMgPSB7fSkge1xuICAgIGxldCB0aGF0ID0gdGhpc1xuXG4gICAgcmV0dXJuIGFzeW5jIChjdHgsIG5leHQpID0+IHtcbiAgICAgIGxldCB7IHF1ZXJ5LCBwYWdpbmF0aW9uLCBzb3J0ZWRCeSB9ID0gdGhpcy5fYnVpbGRRdWVyeShjdHgpXG5cbiAgICAgIGRlYnVnKCdSZWFkIGNvbGxlY3Rpb246JywgcXVlcnkpXG4gICAgICBjdHguc3RhdGUuaW5zdGFuY2VzID0gYXdhaXQgdGhhdC5tb2RlbC5maW5kQWxsKHF1ZXJ5KVxuXG4gICAgICBpZiAoIV8uaXNFbXB0eShwYWdpbmF0aW9uKSkge1xuICAgICAgICBsZXQgY291bnQgPSBhd2FpdCB0aGF0Lm1vZGVsLmNvdW50KHF1ZXJ5KVxuICAgICAgICBwYWdpbmF0aW9uID0gdGhpcy5fYnVpbGRQYWdpbmF0aW9uKG9wdGlvbnMuZGlzYWJsZUNvdW50LCBjb3VudCwgcGFnaW5hdGlvbilcbiAgICAgIH1cblxuICAgICAgYXdhaXQgbmV4dCgpXG5cbiAgICAgIGN0eC5ib2R5ID0ge1xuICAgICAgICBpdGVtczogY3R4LnN0YXRlLmluc3RhbmNlcyxcbiAgICAgICAgbWV0YWRhdGE6IHsgcGFnaW5hdGlvbiwgc29ydGVkQnkgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlYWRBbGwgKG9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFsbChvcHRpb25zKVxuICB9XG5cbiAgcmVhZE9uZSAoaW5jbHVkZSkge1xuICAgIHJldHVybiB0aGlzLnJlYWRPbmUoaW5jbHVkZSlcbiAgfVxuXG4gIHJlbGF0aW9ucyAobmFtZSwgcGFyZW50T3B0aW9ucywgY2hpbGRPcHRpb25zKSB7XG5cbiAgICBjb25zdCBhc3NvY2lhdGlvbiA9IHRoaXMubW9kZWwuYXNzb2NpYXRpb25zW25hbWVdXG5cbiAgICBpZiAoYXNzb2NpYXRpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgZm91bmQgdGhlIGFzc29jaWF0aW9ucyBuYW1lZCBcIiR7bmFtZX1cIi5gKVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgQXNzb2NpYXRpb25SZXNvdXJjZSh0aGlzLm1vZGVsLCBhc3NvY2lhdGlvbiwgcGFyZW50T3B0aW9ucywgY2hpbGRPcHRpb25zKVxuICB9XG59XG5cbmNvbnN0IEFzc29jaWF0aW9uUmVzb3VyY2UgPSByZXF1aXJlKCcuL2Fzc29jaWF0aW9uLXJlc291cmNlJylcbiJdfQ==