define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      this.message = 'Hello World!';
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Contacts';
      config.map([{ route: '', moduleId: 'contact-list', title: 'List' }]);
    };

    return App;
  }();
});
define('contact-list',['exports', './web-api', 'aurelia-framework'], function (exports, _webApi, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactList = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var log = _aureliaFramework.LogManager.getLogger('contact-list');

  var ContactList = exports.ContactList = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI), _dec(_class = function () {
    function ContactList(api) {
      _classCallCheck(this, ContactList);

      this.api = api;
      this.contacts = [];
      this.message = 'Contact List!';
    }

    ContactList.prototype.created = function created() {
      var _this = this;

      this.api.getContactList().then(function (contacts) {
        log.info('Success!');
        log.info(contacts);
        _this.contacts = contacts;
      }).catch(function (error) {
        log.info('Error!');
        log.info(error);
      });
    };

    return ContactList;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.use.plugin('aurelia-materialize-bridge', function (b) {
      return b.useAll();
    });

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('web-api',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WebAPI = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var log = _aureliaFramework.LogManager.getLogger('web-api');

  var WebAPI = exports.WebAPI = function () {
    function WebAPI() {
      _classCallCheck(this, WebAPI);

      this.isRequesting = false;
    }

    WebAPI.prototype.getContactList = function getContactList() {
      var _this = this;

      this.isRequesting = true;
      return fetch('https://izufr01.azurewebsites.net/api/SA21/01/0/10').then(function (response) {
        _this.isRequesting = false;
        log.info('Success!');
        log.info(response);
        if (response.status !== 200) {
          rejected(response);
        } else {
          return response.json();
        }
      }).catch(function (error) {
        _this.isRequesting = false;
        log.info('Error!');
        log.info(response);
        return error.json();
      });
    };

    return WebAPI;
  }();
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"materialize-css/css/materialize.css\"></require><h1 class=\"blue-text text-darken-4\">${message}</h1><div><router-view></router-view></div></template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template><div>とりあえず${message} </div><div><ul><li repeat.for=\"contact of contacts\"><div>${contact.MCNTCT_ContactCD} : ${contact.MCNTCT_ContactName}</div></li></ul></div></template>"; });
//# sourceMappingURL=app-bundle.js.map