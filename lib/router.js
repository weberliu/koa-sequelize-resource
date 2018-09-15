'use strict';exports.__esModule = true;exports.default =













ResourceRouter;var _lodash = require('lodash');var _lodash2 = _interopRequireDefault(_lodash);var _koaRouter = require('koa-router');var _koaRouter2 = _interopRequireDefault(_koaRouter);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _resource = require('./resource');var _resource2 = _interopRequireDefault(_resource);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var debug = (0, _debug2.default)('ksr:router');var methods = { all: 'get', item: 'get', create: 'post', update: 'patch', destroy: 'delete' };function ResourceRouter(models) {
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
        throw new Error('"' + _k + '" is not a resource method.');
      }

      var mw = routers[_k];
      var middlewares = _lodash2.default.isArray(mw) ? others.concat(mw) : others.concat([mw]);

      if (!_lodash2.default.startsWith(url, '/')) url = '/' + url;

      debug('define routers: ', method, url);
      router[method].apply(router, [url].concat(middlewares));
    }

    return router;
  };

  /**
      * define create, all, item, update, destroy methods bind to resouce
      *
      * @param {string} path - url prefix
      * @return {Router} this router
      */
  router.crud = function crud(path) {
    var others = [].slice.call(arguments, 1, -1);
    var fn = _lodash2.default.last(arguments);
    var resource = fn(resources);

    if (resource === undefined) {
      throw new Error('Resouce is undefined');
    }

    var isAssociation = resource.constructor.name === 'AssociationResource';

    if (!_lodash2.default.startsWith(path, '/')) path = '/' + path;

    for (var _k2 in methods) {
      var url = ['item', 'update', 'destroy'].indexOf(_k2) > -1 && (!isAssociation || isAssociation && resource.isMany) ?
      path + '/:id' :
      path;

      var mw = resource[_k2]();
      var middlewares = _lodash2.default.isArray(mw) ? others.concat(mw) : others.concat([mw]);

      debug('curd routers: ', methods[_k2], url);
      router[methods[_k2]].apply(router, [url].concat(middlewares));
    }

    return router;
  };

  return router;
}module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yb3V0ZXIuanMiXSwibmFtZXMiOlsiUmVzb3VyY2VSb3V0ZXIiLCJkZWJ1ZyIsIm1ldGhvZHMiLCJhbGwiLCJpdGVtIiwiY3JlYXRlIiwidXBkYXRlIiwiZGVzdHJveSIsIm1vZGVscyIsInJlc291cmNlcyIsImsiLCJSZXNvdXJjZSIsInJvdXRlciIsImRlZmluZSIsInVybCIsIm90aGVycyIsInNsaWNlIiwiY2FsbCIsImFyZ3VtZW50cyIsImZuIiwiXyIsImxhc3QiLCJyb3V0ZXJzIiwibWV0aG9kIiwiRXJyb3IiLCJtdyIsIm1pZGRsZXdhcmVzIiwiaXNBcnJheSIsImNvbmNhdCIsInN0YXJ0c1dpdGgiLCJjcnVkIiwicGF0aCIsInJlc291cmNlIiwidW5kZWZpbmVkIiwiaXNBc3NvY2lhdGlvbiIsImNvbnN0cnVjdG9yIiwibmFtZSIsImluZGV4T2YiLCJpc01hbnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBY3dCQSxjLENBZHhCLGdDLCtDQUNBLHVDLHFEQUNBLDhCLDZDQUNBLHNDLGdKQUVBLElBQU1DLFFBQVEscUJBQVEsWUFBUixDQUFkLENBQ0EsSUFBTUMsVUFBVSxFQUNkQyxLQUFLLEtBRFMsRUFFZEMsTUFBTSxLQUZRLEVBR2RDLFFBQVEsTUFITSxFQUlkQyxRQUFRLE9BSk0sRUFLZEMsU0FBUyxRQUxLLEVBQWhCLENBUWUsU0FBU1AsY0FBVCxDQUF5QlEsTUFBekIsRUFBaUM7QUFDOUMsTUFBSUMsWUFBWSxFQUFoQjtBQUNBLE9BQUssSUFBSUMsQ0FBVCxJQUFjRixNQUFkLEVBQXNCO0FBQ3BCQyxjQUFVQyxDQUFWLElBQWUsSUFBSUMsa0JBQUosQ0FBYUgsT0FBT0UsQ0FBUCxDQUFiLENBQWY7QUFDRDs7QUFFRCxNQUFNRSxTQUFTLDBCQUFmOztBQUVBOzs7Ozs7QUFNQUEsU0FBT0MsTUFBUCxHQUFnQixTQUFTQSxNQUFULENBQWlCQyxHQUFqQixFQUFzQjtBQUNwQyxRQUFJQyxTQUFTLEdBQUdDLEtBQUgsQ0FBU0MsSUFBVCxDQUFjQyxTQUFkLEVBQXlCLENBQXpCLEVBQTRCLENBQUMsQ0FBN0IsQ0FBYjs7QUFFQSxRQUFNQyxLQUFLQyxpQkFBRUMsSUFBRixDQUFPSCxTQUFQLENBQVg7QUFDQSxRQUFNSSxVQUFVSCxHQUFHVixTQUFILENBQWhCOztBQUVBLFNBQUssSUFBSUMsRUFBVCxJQUFjWSxPQUFkLEVBQXVCO0FBQ3JCLFVBQU1DLFNBQVNyQixRQUFRUSxFQUFSLENBQWY7O0FBRUEsVUFBSSxDQUFDYSxNQUFMLEVBQWE7QUFDWCxjQUFNLElBQUlDLEtBQUosT0FBY2QsRUFBZCxpQ0FBTjtBQUNEOztBQUVELFVBQUllLEtBQUtILFFBQVFaLEVBQVIsQ0FBVDtBQUNBLFVBQUlnQixjQUFlTixpQkFBRU8sT0FBRixDQUFVRixFQUFWLENBQUQsR0FBa0JWLE9BQU9hLE1BQVAsQ0FBY0gsRUFBZCxDQUFsQixHQUFzQ1YsT0FBT2EsTUFBUCxDQUFjLENBQUNILEVBQUQsQ0FBZCxDQUF4RDs7QUFFQSxVQUFJLENBQUNMLGlCQUFFUyxVQUFGLENBQWFmLEdBQWIsRUFBa0IsR0FBbEIsQ0FBTCxFQUE2QkEsTUFBTSxNQUFNQSxHQUFaOztBQUU3QmIsWUFBTSxrQkFBTixFQUEwQnNCLE1BQTFCLEVBQWtDVCxHQUFsQztBQUNBRixhQUFPVyxNQUFQLGlCQUFlVCxHQUFmLFNBQXVCWSxXQUF2QjtBQUNEOztBQUVELFdBQU9kLE1BQVA7QUFDRCxHQXZCRDs7QUF5QkE7Ozs7OztBQU1BQSxTQUFPa0IsSUFBUCxHQUFjLFNBQVNBLElBQVQsQ0FBZUMsSUFBZixFQUFxQjtBQUNqQyxRQUFJaEIsU0FBUyxHQUFHQyxLQUFILENBQVNDLElBQVQsQ0FBY0MsU0FBZCxFQUF5QixDQUF6QixFQUE0QixDQUFDLENBQTdCLENBQWI7QUFDQSxRQUFNQyxLQUFLQyxpQkFBRUMsSUFBRixDQUFPSCxTQUFQLENBQVg7QUFDQSxRQUFNYyxXQUFXYixHQUFHVixTQUFILENBQWpCOztBQUVBLFFBQUl1QixhQUFhQyxTQUFqQixFQUE0QjtBQUMxQixZQUFNLElBQUlULEtBQUosQ0FBVSxzQkFBVixDQUFOO0FBQ0Q7O0FBRUQsUUFBTVUsZ0JBQWdCRixTQUFTRyxXQUFULENBQXFCQyxJQUFyQixLQUE4QixxQkFBcEQ7O0FBRUEsUUFBSSxDQUFDaEIsaUJBQUVTLFVBQUYsQ0FBYUUsSUFBYixFQUFtQixHQUFuQixDQUFMLEVBQThCQSxPQUFPLE1BQU1BLElBQWI7O0FBRTlCLFNBQUssSUFBSXJCLEdBQVQsSUFBY1IsT0FBZCxFQUF1QjtBQUNyQixVQUFJWSxNQUFPLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsU0FBbkIsRUFBOEJ1QixPQUE5QixDQUFzQzNCLEdBQXRDLElBQTJDLENBQUMsQ0FBNUMsS0FBa0QsQ0FBQ3dCLGFBQUQsSUFBbUJBLGlCQUFpQkYsU0FBU00sTUFBL0YsQ0FBRDtBQUNIUCxVQURHO0FBRU5BLFVBRko7O0FBSUEsVUFBSU4sS0FBS08sU0FBU3RCLEdBQVQsR0FBVDtBQUNBLFVBQUlnQixjQUFlTixpQkFBRU8sT0FBRixDQUFVRixFQUFWLENBQUQsR0FBa0JWLE9BQU9hLE1BQVAsQ0FBY0gsRUFBZCxDQUFsQixHQUFzQ1YsT0FBT2EsTUFBUCxDQUFjLENBQUNILEVBQUQsQ0FBZCxDQUF4RDs7QUFFQXhCLFlBQU0sZ0JBQU4sRUFBd0JDLFFBQVFRLEdBQVIsQ0FBeEIsRUFBb0NJLEdBQXBDO0FBQ0FGLGFBQU9WLFFBQVFRLEdBQVIsQ0FBUCxpQkFBbUJJLEdBQW5CLFNBQTJCWSxXQUEzQjtBQUNEOztBQUVELFdBQU9kLE1BQVA7QUFDRCxHQTFCRDs7QUE0QkEsU0FBT0EsTUFBUDtBQUNELEMiLCJmaWxlIjoicm91dGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJ1xuaW1wb3J0IFJvdXRlciBmcm9tICdrb2Etcm91dGVyJ1xuaW1wb3J0IGRlYnVnZXIgZnJvbSAnZGVidWcnXG5pbXBvcnQgUmVzb3VyY2UgZnJvbSAnLi9yZXNvdXJjZSdcblxuY29uc3QgZGVidWcgPSBkZWJ1Z2VyKCdrc3I6cm91dGVyJylcbmNvbnN0IG1ldGhvZHMgPSB7XG4gIGFsbDogJ2dldCcsXG4gIGl0ZW06ICdnZXQnLFxuICBjcmVhdGU6ICdwb3N0JyxcbiAgdXBkYXRlOiAncGF0Y2gnLFxuICBkZXN0cm95OiAnZGVsZXRlJ1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZXNvdXJjZVJvdXRlciAobW9kZWxzKSB7XG4gIGxldCByZXNvdXJjZXMgPSB7fVxuICBmb3IgKGxldCBrIGluIG1vZGVscykge1xuICAgIHJlc291cmNlc1trXSA9IG5ldyBSZXNvdXJjZShtb2RlbHNba10pXG4gIH1cblxuICBjb25zdCByb3V0ZXIgPSBSb3V0ZXIoKVxuXG4gIC8qKlxuICAgKiBkZWZpbmUgYSByb3V0ZXJcbiAgICogQHBhcmFtICB7c3RyaW5nfSB1cmwgLSB1cmwgcGF0aFxuICAgKlxuICAgKiBAcmV0dXJuIHtSb3V0ZXJ9IHRoaXMgcm91dGVyXG4gICAqL1xuICByb3V0ZXIuZGVmaW5lID0gZnVuY3Rpb24gZGVmaW5lICh1cmwpIHtcbiAgICBsZXQgb3RoZXJzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEsIC0xKVxuXG4gICAgY29uc3QgZm4gPSBfLmxhc3QoYXJndW1lbnRzKVxuICAgIGNvbnN0IHJvdXRlcnMgPSBmbihyZXNvdXJjZXMpXG5cbiAgICBmb3IgKGxldCBrIGluIHJvdXRlcnMpIHtcbiAgICAgIGNvbnN0IG1ldGhvZCA9IG1ldGhvZHNba11cblxuICAgICAgaWYgKCFtZXRob2QpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIiR7a31cIiBpcyBub3QgYSByZXNvdXJjZSBtZXRob2QuYClcbiAgICAgIH1cblxuICAgICAgbGV0IG13ID0gcm91dGVyc1trXVxuICAgICAgbGV0IG1pZGRsZXdhcmVzID0gKF8uaXNBcnJheShtdykpID8gb3RoZXJzLmNvbmNhdChtdykgOiBvdGhlcnMuY29uY2F0KFttd10pXG5cbiAgICAgIGlmICghXy5zdGFydHNXaXRoKHVybCwgJy8nKSkgdXJsID0gJy8nICsgdXJsXG5cbiAgICAgIGRlYnVnKCdkZWZpbmUgcm91dGVyczogJywgbWV0aG9kLCB1cmwpXG4gICAgICByb3V0ZXJbbWV0aG9kXSh1cmwsIC4uLm1pZGRsZXdhcmVzKVxuICAgIH1cblxuICAgIHJldHVybiByb3V0ZXJcbiAgfVxuXG4gIC8qKlxuICAgKiBkZWZpbmUgY3JlYXRlLCBhbGwsIGl0ZW0sIHVwZGF0ZSwgZGVzdHJveSBtZXRob2RzIGJpbmQgdG8gcmVzb3VjZVxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHVybCBwcmVmaXhcbiAgICogQHJldHVybiB7Um91dGVyfSB0aGlzIHJvdXRlclxuICAgKi9cbiAgcm91dGVyLmNydWQgPSBmdW5jdGlvbiBjcnVkIChwYXRoKSB7XG4gICAgbGV0IG90aGVycyA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxLCAtMSlcbiAgICBjb25zdCBmbiA9IF8ubGFzdChhcmd1bWVudHMpXG4gICAgY29uc3QgcmVzb3VyY2UgPSBmbihyZXNvdXJjZXMpXG5cbiAgICBpZiAocmVzb3VyY2UgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXNvdWNlIGlzIHVuZGVmaW5lZCcpXG4gICAgfVxuXG4gICAgY29uc3QgaXNBc3NvY2lhdGlvbiA9IHJlc291cmNlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdBc3NvY2lhdGlvblJlc291cmNlJ1xuXG4gICAgaWYgKCFfLnN0YXJ0c1dpdGgocGF0aCwgJy8nKSkgcGF0aCA9ICcvJyArIHBhdGhcblxuICAgIGZvciAobGV0IGsgaW4gbWV0aG9kcykge1xuICAgICAgbGV0IHVybCA9IChbJ2l0ZW0nLCAndXBkYXRlJywgJ2Rlc3Ryb3knXS5pbmRleE9mKGspID4gLTEgJiYgKCFpc0Fzc29jaWF0aW9uIHx8IChpc0Fzc29jaWF0aW9uICYmIHJlc291cmNlLmlzTWFueSkpKVxuICAgICAgICA/IGAke3BhdGh9LzppZGBcbiAgICAgICAgOiBwYXRoXG5cbiAgICAgIGxldCBtdyA9IHJlc291cmNlW2tdKClcbiAgICAgIGxldCBtaWRkbGV3YXJlcyA9IChfLmlzQXJyYXkobXcpKSA/IG90aGVycy5jb25jYXQobXcpIDogb3RoZXJzLmNvbmNhdChbbXddKVxuXG4gICAgICBkZWJ1ZygnY3VyZCByb3V0ZXJzOiAnLCBtZXRob2RzW2tdLCB1cmwpXG4gICAgICByb3V0ZXJbbWV0aG9kc1trXV0odXJsLCAuLi5taWRkbGV3YXJlcylcbiAgICB9XG5cbiAgICByZXR1cm4gcm91dGVyXG4gIH1cblxuICByZXR1cm4gcm91dGVyXG59XG4iXX0=