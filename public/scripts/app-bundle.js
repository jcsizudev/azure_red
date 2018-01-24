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
      this.activePage = 1;
      this.maxPage = 1;
      this.lineCount = 10;
      this.onCreating = false;
    }

    ContactList.prototype.showList = function showList() {
      var _this = this;

      this.api.getContactList(this.activePage, this.lineCount).then(function (contacts) {
        log.info('Success!');
        log.info(contacts);
        _this.contacts = contacts;
        var allLineCount = contacts[0].LineCount;
        _this.maxPage = Math.floor(allLineCount / _this.lineCount);
        if (allLineCount % _this.lineCount !== 0) {
          _this.maxPage += 1;
        }
      }).catch(function (error) {
        log.info('Error!');
        log.info(error);
      });
    };

    ContactList.prototype.created = function created() {
      this.onCreating = true;
      log.info('created!');
      this.showList();
    };

    ContactList.prototype.onPageChanged = function onPageChanged(e) {
      log.info('page changed ' + e.detail);
      if (this.onCreating) {
        this.onCreating = false;
      } else {
        this.activePage = e.detail;
        this.showList();
      }
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

    WebAPI.prototype.getContactList = function getContactList(page, lineCount) {
      var _this = this;

      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      var skipRows = (page - 1) * lineCount;
      strUrl += skipRows + '/' + lineCount;
      return fetch(strUrl).then(function (response) {
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
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"materialize-css/css/materialize.css\"></require><require from=\"./styles.css\"></require><md-colors md-primary-color=\"#ee6e73\" md-accent-color=\"#2bbbad\" md-error-color=\"#FF0000\"></md-colors><div class=\"container\"><router-view></router-view></div></template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = ".fullWnd {\n  width: 100vw;\n  height: 100vh;\n}\n\n.collection .collection-item {\n  background-color: #fff;\n  line-height: 2.5rem;\n  padding: 10px 20px;\n  margin: 0;\n  border-bottom: 1px solid #e0e0e0;\n}\n"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template><div class=\"row\"><div class=\"col s12\"><md-collection><md-collection-header class=\"red accent-2 white-text\"><h5>連絡先一覧</h5></md-collection-header><md-collection-item repeat.for=\"contact of contacts\"> ${contact.MCNTCT_ContactCD} : ${contact.MCNTCT_ContactName} <div class=\"secondary-content\"><a md-button=\"floating: true; tiny: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" onclick='alert($(this).parent(\"div\").children(\"input\").val())'><i class=\"material-icons\">edit</i> </a><input type=\"hidden\" id=\"hidIndex\" value=\"${$index}\"></div></md-collection-item></md-collection><div style=\"text-align:right\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" onclick='alert(\"OK\")'><i class=\"large material-icons\">add</i></a></div></div></div><div class=\"row\" style=\"text-align:center\"><div class=\"col s12\"><md-pagination md-on-page-changed.delegate=\"onPageChanged($event)\" md-pages.bind=\"maxPage\" md-active-page.bind=\"activePage\"></md-pagination></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map