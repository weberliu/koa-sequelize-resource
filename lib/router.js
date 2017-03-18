'use strict';exports.__esModule = true;exports.default =














ResourceRouter;var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _koaRouter = require('koa-router');var _koaRouter2 = _interopRequireDefault(_koaRouter);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _resource = require('./resource');var _resource2 = _interopRequireDefault(_resource);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var log = (0, _debug2.default)('koa-sequelize-resource:router');var methods = { index: 'get', show: 'get', create: 'post', update: 'patch', destroy: 'delete' };function ResourceRouter(models) {

  var resources = {};
  for (var k in models) {
    resources[k] = new _resource2.default(models[k]);
  }

  var router = (0, _koaRouter2.default)();

  /**
                                            * define a router
                                            * @param  {string} url - url path
                                            * 
                                            * @return {Router} this router
                                            */
  router.define = function define(url) {
    var others = [].slice.call(arguments, 1, -1);

    var fn = _lodash2.default.last(arguments);
    var routers = fn(resources);


    for (var _k in routers) {
      var method = methods[_k];

      if (!method) {
        throw new Error('"k" is not a resource method.');
      }

      var mw = routers[_k];
      var middlewares = _lodash2.default.isArray(mw) ? others.concat(mw) : others.concat([mw]);

      if (!_lodash2.default.startsWith(url, '/')) url = '/' + url;

      log('define routers: ', method, url);
      router[method].apply(router, [url].concat(middlewares));
    }

    return router;
  };

  /**
      * define create, index, show, update, destroy methods bind to resouce
      * 
      * @param {string} path - url prefix
      * @return {Router} this router
      */
  router.crud = function crud(path) {
    var others = [].slice.call(arguments, 1, -1);
    var fn = _lodash2.default.last(arguments);
    var resource = fn(resources);
    var isAssociation = resource.constructor.name == 'AssociationResource';

    if (!_lodash2.default.startsWith(path, '/')) path = '/' + path;

    for (var _k2 in methods) {
      var url = ['show', 'update', 'destroy'].indexOf(_k2) > -1 && (!isAssociation || isAssociation && resource.isMany) ?
      path + '/:id' :
      path;

      var mw = resource[_k2]();
      var middlewares = _lodash2.default.isArray(mw) ? others.concat(mw) : others.concat([mw]);

      log('curd routers: ', methods[_k2], url);
      router[methods[_k2]].apply(router, [url].concat(middlewares));
    }

    return router;
  };

  return router;
}module.exports = exports['default'];