'use strict';exports.__esModule = true;exports.default =














ResourceRouter;var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _koaRouter = require('koa-router');var _koaRouter2 = _interopRequireDefault(_koaRouter);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _resource = require('./resource');var _resource2 = _interopRequireDefault(_resource);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var log = (0, _debug2.default)('koa-sequelize-resource:router');var methods = { index: 'get', show: 'get', create: 'post', update: 'patch', destroy: 'delete' };function ResourceRouter(models) {var _arguments = arguments;

  var resources = {};
  for (var k in models) {
    resources[k] = new _resource2.default(models[k]);
  }

  var router = (0, _koaRouter2.default)();

  /**
                                            * define a router
                                            * @path  {string} url - url path
                                            * 
                                            * @return {Router} this router
                                            */
  router.define = function (url) {
    var others = _arguments.slice(1, -1) || [];
    var fn = _arguments.slice(-1);
    var routers = fn(resources);

    log(others);

    for (var _k in routers) {
      var method = methods[_k];
      var middlewares = routers[_k];

      if (!_lodash2.default.isArray(middlewares)) {
        middlewares = [middlewares];
      }

      if (!_lodash2.default.startsWith(url, '/')) url = '/' + url;

      log('define routers: ', method, url);
      router[method].apply(router, [url].concat(middlewares));
    }

    return router;
  };

  router.crud = function (path, fn) {
    var resource = fn(resources);
    var isAssociation = resource.constructor.name == 'AssociationResource';

    if (!_lodash2.default.startsWith(path, '/')) path = '/' + path;

    for (var _k2 in methods) {
      var url = ['show', 'update', 'destroy'].indexOf(_k2) > -1 && (!isAssociation || isAssociation && resource.isMany) ?
      path + '/:id' :
      path;

      var middlewares = resource[_k2]();

      if (!_lodash2.default.isArray(middlewares)) middlewares = [middlewares];

      log('curd routers: ', methods[_k2], url);
      router[methods[_k2]].apply(router, [url].concat(middlewares));
    }

    return router;
  };

  return router;
}module.exports = exports['default'];