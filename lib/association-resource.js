'use strict';exports.__esModule = true;var _regenerator = require('babel-runtime/regenerator');var _regenerator2 = _interopRequireDefault(_regenerator);var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);var _inherits2 = require('babel-runtime/helpers/inherits');var _inherits3 = _interopRequireDefault(_inherits2);var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);
var _inflection = require('inflection');var _inflection2 = _interopRequireDefault(_inflection);

var _resource = require('./resource');var _resource2 = _interopRequireDefault(_resource);
var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var debug = (0, _debug2.default)('ksr:associations');var

AssociationResource = function (_Resource) {(0, _inherits3.default)(AssociationResource, _Resource);
  function AssociationResource(parent, association, parentOptions, childOptions) {(0, _classCallCheck3.default)(this, AssociationResource);var _this = (0, _possibleConstructorReturn3.default)(this,
    _Resource.call(this, association.target || null, childOptions));

    _this.alias = association.as;
    _this.associationType = association.associationType;
    _this.isMany = _this.associationType === 'HasMany' || _this.associationType === 'BelongsToMany';
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
    return function () {var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx, next) {return _regenerator2.default.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:if (
                ctx.state.instance) {_context.next = 5;break;}
                ctx.status = 204;return _context.abrupt('return',
                true);case 5:

                ctx.state.parent = ctx.state.instance;

                if (that.isMany) {
                  ctx.state.collection = ctx.state.parent[that.getMethod];
                }_context.next = 9;return (

                  next());case 9:case 'end':return _context.stop();}}}, _callee, _this2);}));return function (_x, _x2) {return _ref.apply(this, arguments);};}();


  };AssociationResource.prototype.

  all = function all() {var _this3 = this;var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var that = this;

    return [
    that.parent.getEntity(),
    that._fetchParent(), function () {var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(

      function _callee2(ctx, next) {var _that$_buildQuery, query, sortedBy, pagination, countMethod, count;return _regenerator2.default.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_that$_buildQuery =
                that._buildQuery(ctx), query = _that$_buildQuery.query, sortedBy = _that$_buildQuery.sortedBy, pagination = _that$_buildQuery.pagination;

                debug('Association query: ', query);_context2.next = 4;return (

                  ctx.state.parent[that.getMethod](query));case 4:ctx.state.instances = _context2.sent;if (

                _lodash2.default.isEmpty(pagination)) {_context2.next = 16;break;}
                countMethod = 'count' + _inflection2.default.capitalize(that.alias);if (!(
                options && options.disableCount)) {_context2.next = 11;break;}_context2.t0 =
                ctx.state.instances.length;_context2.next = 14;break;case 11:_context2.next = 13;return (
                  ctx.state.parent[countMethod](query));case 13:_context2.t0 = _context2.sent;case 14:count = _context2.t0;

                pagination = _this3._buildPagination(options.disableCount, count, pagination);case 16:_context2.next = 18;return (


                  next());case 18:

                ctx.body = {
                  items: ctx.state.instances,
                  metadata: { pagination: pagination, sortedBy: sortedBy } };case 19:case 'end':return _context2.stop();}}}, _callee2, _this3);}));return function (_x4, _x5) {return _ref2.apply(this, arguments);};}()];



  };AssociationResource.prototype.

  item = function item() {var _this4 = this;
    return [
    this.parent.getEntity({ model: this.model, as: this.alias }),
    this._fetchParent(), function () {var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(

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
    that._fetchParent(), function () {var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(

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

    var updateOne = function () {var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(ctx, next) {var newInstance;return _regenerator2.default.wrap(function _callee5$(_context5) {while (1) {switch (_context5.prev = _context5.next) {case 0:
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


    var destoryOne = function () {var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(ctx, next) {return _regenerator2.default.wrap(function _callee6$(_context6) {while (1) {switch (_context6.prev = _context6.next) {case 0:
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

    return function () {var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(ctx, next) {var _where;var fn, instances;return _regenerator2.default.wrap(function _callee7$(_context7) {while (1) {switch (_context7.prev = _context7.next) {case 0:
                fn = 'get' + _inflection2.default.capitalize(that.alias);_context7.next = 3;return (
                  ctx.state.parent[fn]({ where: (_where = {}, _where[that.options.idColumn] = ctx.params[that.options.idParam], _where) }));case 3:instances = _context7.sent;if (!(

                instances.length > 0)) {_context7.next = 10;break;}
                ctx.state.instance = instances[0];_context7.next = 8;return (
                  next());case 8:_context7.next = 11;break;case 10:

                ctx.status = 204;case 11:case 'end':return _context7.stop();}}}, _callee7, _this8);}));return function (_x14, _x15) {return _ref7.apply(this, arguments);};}();


  };return AssociationResource;}(_resource2.default);exports.default = AssociationResource;module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hc3NvY2lhdGlvbi1yZXNvdXJjZS5qcyJdLCJuYW1lcyI6WyJkZWJ1ZyIsIkFzc29jaWF0aW9uUmVzb3VyY2UiLCJwYXJlbnQiLCJhc3NvY2lhdGlvbiIsInBhcmVudE9wdGlvbnMiLCJjaGlsZE9wdGlvbnMiLCJ0YXJnZXQiLCJhbGlhcyIsImFzIiwiYXNzb2NpYXRpb25UeXBlIiwiaXNNYW55IiwiUmVzb3VyY2UiLCJjYXBpdGFsaXplIiwiaW5mbGVjdGlvbiIsInNldE1ldGhvZCIsImdldE1ldGhvZCIsInBsdXJhbGl6ZSIsImFkZE1ldGhvZCIsIl9mZXRjaFBhcmVudCIsInRoYXQiLCJjdHgiLCJuZXh0Iiwic3RhdGUiLCJpbnN0YW5jZSIsInN0YXR1cyIsImNvbGxlY3Rpb24iLCJhbGwiLCJvcHRpb25zIiwiZ2V0RW50aXR5IiwiX2J1aWxkUXVlcnkiLCJxdWVyeSIsInNvcnRlZEJ5IiwicGFnaW5hdGlvbiIsImluc3RhbmNlcyIsIl8iLCJpc0VtcHR5IiwiY291bnRNZXRob2QiLCJkaXNhYmxlQ291bnQiLCJsZW5ndGgiLCJjb3VudCIsIl9idWlsZFBhZ2luYXRpb24iLCJib2R5IiwiaXRlbXMiLCJtZXRhZGF0YSIsIml0ZW0iLCJtb2RlbCIsImNyZWF0ZSIsIm5ld0luc3RhbmNlIiwiYnVpbGQiLCJyZXF1ZXN0IiwicHJvbWlzZSIsInRoZW4iLCJfY3JlYXRlZEhhbmRsZXIiLCJyZXMiLCJjYXRjaCIsIl9lcnJvckhhbmRsZXIiLCJlcnIiLCJ1cGRhdGUiLCJ1cGRhdGVPbmUiLCJfdXBkYXRlZEhhbmRsZXIiLCJmbiIsInB1c2giLCJfZmV0Y2hPbmUiLCJkZXN0cm95IiwiZGVzdG9yeU9uZSIsIndoZXJlIiwiaWRDb2x1bW4iLCJwYXJhbXMiLCJpZFBhcmFtIl0sIm1hcHBpbmdzIjoiZ3RCQUFBLGdDO0FBQ0Esd0M7O0FBRUEsc0M7QUFDQSw4Qjs7QUFFQSxJQUFNQSxRQUFRLHFCQUFRLGtCQUFSLENBQWQsQzs7QUFFcUJDLG1CO0FB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LEtBQUosQ0FBVUMsUUFBVixHQUFxQlUsVUFBVSxDQUFWLENBQXJCLENBTEc7QUFNR1osd0JBTkg7O0FBUUhELG9CQUFJSSxNQUFKLEdBQWEsR0FBYixDQVJHLG1FQUFQOzs7QUFXRCxHLDhCQTVLOENiLGtCLG9CQUE1QlYsbUIiLCJmaWxlIjoiYXNzb2NpYXRpb24tcmVzb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnXG5pbXBvcnQgaW5mbGVjdGlvbiBmcm9tICdpbmZsZWN0aW9uJ1xuXG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZSdcbmltcG9ydCBkZWJ1Z2VyIGZyb20gJ2RlYnVnJ1xuXG5jb25zdCBkZWJ1ZyA9IGRlYnVnZXIoJ2tzcjphc3NvY2lhdGlvbnMnKVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBc3NvY2lhdGlvblJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvciAocGFyZW50LCBhc3NvY2lhdGlvbiwgcGFyZW50T3B0aW9ucywgY2hpbGRPcHRpb25zKSB7XG4gICAgc3VwZXIoYXNzb2NpYXRpb24udGFyZ2V0IHx8IG51bGwsIGNoaWxkT3B0aW9ucylcblxuICAgIHRoaXMuYWxpYXMgPSBhc3NvY2lhdGlvbi5hc1xuICAgIHRoaXMuYXNzb2NpYXRpb25UeXBlID0gYXNzb2NpYXRpb24uYXNzb2NpYXRpb25UeXBlXG4gICAgdGhpcy5pc01hbnkgPSB0aGlzLmFzc29jaWF0aW9uVHlwZSA9PT0gJ0hhc01hbnknIHx8IHRoaXMuYXNzb2NpYXRpb25UeXBlID09PSAnQmVsb25nc1RvTWFueSdcbiAgICB0aGlzLnBhcmVudCA9IG5ldyBSZXNvdXJjZShwYXJlbnQsIHBhcmVudE9wdGlvbnMpXG5cbiAgICBjb25zdCBjYXBpdGFsaXplID0gaW5mbGVjdGlvbi5jYXBpdGFsaXplKHRoaXMuYWxpYXMpXG5cbiAgICB0aGlzLnNldE1ldGhvZCA9ICdzZXQnICsgY2FwaXRhbGl6ZVxuICAgIHRoaXMuZ2V0TWV0aG9kID0gKHRoaXMuaXNNYW55KVxuICAgICAgPyAnZ2V0JyArIGluZmxlY3Rpb24ucGx1cmFsaXplKGNhcGl0YWxpemUpXG4gICAgICA6ICdnZXQnICsgY2FwaXRhbGl6ZVxuXG4gICAgdGhpcy5hZGRNZXRob2QgPSAnYWRkJyArIGNhcGl0YWxpemVcbiAgfVxuXG4gIF9mZXRjaFBhcmVudCAoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXNcbiAgICByZXR1cm4gYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuICAgICAgaWYgKCFjdHguc3RhdGUuaW5zdGFuY2UpIHtcbiAgICAgICAgY3R4LnN0YXR1cyA9IDIwNFxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LnN0YXRlLnBhcmVudCA9IGN0eC5zdGF0ZS5pbnN0YW5jZVxuXG4gICAgICAgIGlmICh0aGF0LmlzTWFueSkge1xuICAgICAgICAgIGN0eC5zdGF0ZS5jb2xsZWN0aW9uID0gY3R4LnN0YXRlLnBhcmVudFt0aGF0LmdldE1ldGhvZF1cbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IG5leHQoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGFsbCAob3B0aW9ucyA9IHt9KSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXNcblxuICAgIHJldHVybiBbXG4gICAgICB0aGF0LnBhcmVudC5nZXRFbnRpdHkoKSxcbiAgICAgIHRoYXQuX2ZldGNoUGFyZW50KCksXG5cbiAgICAgIGFzeW5jIChjdHgsIG5leHQpID0+IHtcbiAgICAgICAgbGV0IHsgcXVlcnksIHNvcnRlZEJ5LCBwYWdpbmF0aW9uIH0gPSB0aGF0Ll9idWlsZFF1ZXJ5KGN0eClcblxuICAgICAgICBkZWJ1ZygnQXNzb2NpYXRpb24gcXVlcnk6ICcsIHF1ZXJ5KVxuXG4gICAgICAgIGN0eC5zdGF0ZS5pbnN0YW5jZXMgPSBhd2FpdCBjdHguc3RhdGUucGFyZW50W3RoYXQuZ2V0TWV0aG9kXShxdWVyeSlcblxuICAgICAgICBpZiAoIV8uaXNFbXB0eShwYWdpbmF0aW9uKSkge1xuICAgICAgICAgIGNvbnN0IGNvdW50TWV0aG9kID0gJ2NvdW50JyArIGluZmxlY3Rpb24uY2FwaXRhbGl6ZSh0aGF0LmFsaWFzKVxuICAgICAgICAgIGNvbnN0IGNvdW50ID0gb3B0aW9ucyAmJiBvcHRpb25zLmRpc2FibGVDb3VudFxuICAgICAgICAgICAgPyBjdHguc3RhdGUuaW5zdGFuY2VzLmxlbmd0aFxuICAgICAgICAgICAgOiBhd2FpdCBjdHguc3RhdGUucGFyZW50W2NvdW50TWV0aG9kXShxdWVyeSlcblxuICAgICAgICAgIHBhZ2luYXRpb24gPSB0aGlzLl9idWlsZFBhZ2luYXRpb24ob3B0aW9ucy5kaXNhYmxlQ291bnQsIGNvdW50LCBwYWdpbmF0aW9uKVxuICAgICAgICB9XG5cbiAgICAgICAgYXdhaXQgbmV4dCgpXG5cbiAgICAgICAgY3R4LmJvZHkgPSB7XG4gICAgICAgICAgaXRlbXM6IGN0eC5zdGF0ZS5pbnN0YW5jZXMsXG4gICAgICAgICAgbWV0YWRhdGE6IHsgcGFnaW5hdGlvbiwgc29ydGVkQnkgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgaXRlbSAoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMucGFyZW50LmdldEVudGl0eSh7bW9kZWw6IHRoaXMubW9kZWwsIGFzOiB0aGlzLmFsaWFzfSksXG4gICAgICB0aGlzLl9mZXRjaFBhcmVudCgpLFxuXG4gICAgICBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG4gICAgICAgIGN0eC5zdGF0ZS5pbnN0YW5jZSA9IGN0eC5zdGF0ZS5wYXJlbnRbdGhpcy5hbGlhc11cblxuICAgICAgICBhd2FpdCBuZXh0KClcblxuICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICAgIGN0eC5ib2R5ID0gY3R4LnN0YXRlLmluc3RhbmNlXG4gICAgICB9XG4gICAgXVxuICB9XG5cbiAgY3JlYXRlICgpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpc1xuXG4gICAgcmV0dXJuIFtcbiAgICAgIHRoYXQucGFyZW50LmdldEVudGl0eSh7bW9kZWw6IHRoYXQubW9kZWwsIGFzOiB0aGF0LmFsaWFzfSksXG4gICAgICB0aGF0Ll9mZXRjaFBhcmVudCgpLFxuXG4gICAgICBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG4gICAgICAgIGNvbnN0IG5ld0luc3RhbmNlID0gdGhhdC5tb2RlbC5idWlsZChjdHgucmVxdWVzdC5ib2R5KVxuICAgICAgICBjb25zdCBwcm9taXNlID0gdGhhdC5pc01hbnlcbiAgICAgICAgICA/IGN0eC5zdGF0ZS5wYXJlbnRbdGhhdC5hZGRNZXRob2RdKG5ld0luc3RhbmNlKVxuICAgICAgICAgIDogY3R4LnN0YXRlLnBhcmVudFt0aGF0LnNldE1ldGhvZF0obmV3SW5zdGFuY2UpXG5cbiAgICAgICAgYXdhaXQgcHJvbWlzZVxuICAgICAgICAgIC50aGVuKHJlcyA9PiB0aGF0Ll9jcmVhdGVkSGFuZGxlcihyZXMsIGN0eCwgbmV4dCkpXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB0aGF0Ll9lcnJvckhhbmRsZXIoZXJyLCBjdHgpKVxuICAgICAgfVxuICAgIF1cbiAgfVxuXG4gIHVwZGF0ZSAoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXNcblxuICAgIGNvbnN0IHVwZGF0ZU9uZSA9IGFzeW5jIChjdHgsIG5leHQpID0+IHtcbiAgICAgIGNvbnN0IG5ld0luc3RhbmNlID0gdGhhdC5tb2RlbC5idWlsZChjdHgucmVxdWVzdC5ib2R5KVxuICAgICAgYXdhaXQgY3R4LnN0YXRlLnBhcmVudFt0aGF0LnNldE1ldGhvZF0obmV3SW5zdGFuY2UpXG4gICAgICAgIC50aGVuKHJlcyA9PiB0aGF0Ll91cGRhdGVkSGFuZGxlcihyZXMsIGN0eCwgbmV4dCkpXG4gICAgICAgIC5jYXRjaChlcnIgPT4gdGhhdC5fZXJyb3JIYW5kbGVyKGVyciwgY3R4KSlcbiAgICB9XG5cbiAgICBsZXQgZm4gPSBbXG4gICAgICB0aGF0LnBhcmVudC5nZXRFbnRpdHkoe21vZGVsOiB0aGF0Lm1vZGVsLCBhczogdGhhdC5hbGlhc30pLFxuICAgICAgdGhhdC5fZmV0Y2hQYXJlbnQoKVxuICAgIF1cblxuICAgIGlmICh0aGF0LmlzTWFueSkge1xuICAgICAgZm4ucHVzaCh0aGF0Ll9mZXRjaE9uZSgpKVxuICAgICAgZm4ucHVzaChzdXBlci51cGRhdGUoKSlcbiAgICB9IGVsc2Uge1xuICAgICAgZm4ucHVzaCh1cGRhdGVPbmUpXG4gICAgfVxuXG4gICAgcmV0dXJuIGZuXG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpc1xuXG4gICAgbGV0IGZuID0gW1xuICAgICAgdGhpcy5wYXJlbnQuZ2V0RW50aXR5KHttb2RlbDogdGhpcy5tb2RlbCwgYXM6IHRoaXMuYWxpYXN9KSxcbiAgICAgIHRoaXMuX2ZldGNoUGFyZW50KClcbiAgICBdXG5cbiAgICBjb25zdCBkZXN0b3J5T25lID0gYXN5bmMgKGN0eCwgbmV4dCkgPT4ge1xuICAgICAgY3R4LnN0YXRlLmluc3RhbmNlID0gY3R4LnN0YXRlLnBhcmVudFt0aGlzLmFsaWFzXVxuXG4gICAgICBhd2FpdCBjdHguc3RhdGUuaW5zdGFuY2UuZGVzdHJveSgpXG4gICAgICBhd2FpdCBuZXh0KClcblxuICAgICAgY3R4LnN0YXR1cyA9IDIwNFxuICAgIH1cblxuICAgIGlmICh0aGlzLmlzTWFueSkge1xuICAgICAgZm4ucHVzaCh0aGF0Ll9mZXRjaE9uZSgpKVxuICAgICAgZm4ucHVzaChzdXBlci5kZXN0cm95KCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGZuLnB1c2goZGVzdG9yeU9uZSlcbiAgICB9XG5cbiAgICByZXR1cm4gZm5cbiAgfVxuXG4gIF9mZXRjaE9uZSAoKSB7XG4gICAgY29uc3QgdGhhdCA9IHRoaXNcblxuICAgIHJldHVybiBhc3luYyAoY3R4LCBuZXh0KSA9PiB7XG4gICAgICBjb25zdCBmbiA9ICdnZXQnICsgaW5mbGVjdGlvbi5jYXBpdGFsaXplKHRoYXQuYWxpYXMpXG4gICAgICBjb25zdCBpbnN0YW5jZXMgPSBhd2FpdCBjdHguc3RhdGUucGFyZW50W2ZuXSh7d2hlcmU6IHtbdGhhdC5vcHRpb25zLmlkQ29sdW1uXTogY3R4LnBhcmFtc1t0aGF0Lm9wdGlvbnMuaWRQYXJhbV19fSlcblxuICAgICAgaWYgKGluc3RhbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGN0eC5zdGF0ZS5pbnN0YW5jZSA9IGluc3RhbmNlc1swXVxuICAgICAgICBhd2FpdCBuZXh0KClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5zdGF0dXMgPSAyMDRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==