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
      config.map([{ route: '', moduleId: 'contact-list', name: 'contactList', title: 'List' }, { route: 'contactNew/', moduleId: 'contact-new', name: 'contactNew' }]);
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
      this.selectedItem = null;
    }

    ContactList.prototype.showList = function showList() {
      var _this = this;

      this.api.getContactList(this.activePage, this.lineCount).then(function (contacts) {
        log.info('Success!');
        log.info(contacts);
        _this.contacts = contacts.map(function (e) {
          e.selected = false;
          return e;
        });
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
      if (this.selectedItem) {
        this.selectedItem.selected = false;
        this.selectedItem = null;
      }
    };

    ContactList.prototype.onClickRow = function onClickRow(e) {
      log.info(e);
      if (this.selectedItem) {
        this.selectedItem.selected = false;
      }
      e.target.item.selected = true;
      this.selectedItem = e.target.item;
    };

    return ContactList;
  }()) || _class);
});
define('contact-new',['exports', './web-api', 'aurelia-framework', 'aurelia-validation', 'aurelia-materialize-bridge'], function (exports, _webApi, _aureliaFramework, _aureliaValidation, _aureliaMaterializeBridge) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactNew = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var log = _aureliaFramework.LogManager.getLogger('contact-list');

  var ContactNew = exports.ContactNew = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController)), _dec(_class = function () {
    function ContactNew(api, controller) {
      _classCallCheck(this, ContactNew);

      this.rules = _aureliaValidation.ValidationRules.ensure('contactName').required().withMessage('連絡先名称は必須です').ensure('orderDisplay').required().withMessage('表示順は必須です').matches(/[0-9]+/).withMessage('数値を指定して下さい').rules;

      this.api = api;
      this.controller = controller;
      this.controller.addRenderer(new _aureliaMaterializeBridge.MaterializeFormValidationRenderer());

      this.contactName = '';
      this.orderDisplay = '';
      this.note = '';
      this.activeFlg = true;
      log.info('ContactNew-constructor');
    }

    ContactNew.prototype.validateModel = function validateModel() {
      var _this = this;

      this.controller.validate().then(function (v) {
        if (v.valid) {
          _this.message = 'All is good!';
        } else {
          _this.message = 'You have errors!';
        }
      });
    };

    ContactNew.prototype.created = function created() {
      log.info('ContactNew-created');
    };

    return ContactNew;
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
    aurelia.use.plugin('aurelia-validation');

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

    WebAPI.prototype.addContact = function addContact(postData) {
      var _this2 = this;

      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, { method: 'POST', body: postData }).then(function (response) {
        _this2.isRequesting = false;
        log.info('Success!');
        log.info(response);
        if (response.status !== 200) {
          rejected(response);
        } else {
          return response.json();
        }
      }).catch(function (error) {
        _this2.isRequesting = false;
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
define('text!styles.css', ['module'], function(module) { module.exports = ".padl {\n  margin-left: 1rem;\n}\n"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先一覧</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><md-collection><md-collection-item repeat.for=\"contact of contacts\" class=\"${contact.selected ? 'indigo white-text' : ''}\"><span click.delegate=\"onClickRow($event)\" touchstart.delegate=\"onClickRow($event)\"><i class=\"material-icons\" item.bind=\"contact\">contacts</i> </span> ${contact.MCNTCT_ContactCD} : ${contact.MCNTCT_ContactName} </md-collection-item></md-collection></div></div><div class=\"row\" style=\"text-align:center\"><div class=\"col s12\"><md-pagination md-on-page-changed.delegate=\"onPageChanged($event)\" md-pages.bind=\"maxPage\" md-active-page.bind=\"activePage\"></md-pagination></div></div><div class=\"row\"><div class=\"col s12\"><div class=\"fixed-action-btn\" style=\"bottom:5px;right:5px\"><a md-button=\"floating: true; large: true;\" md-tooltip=\"position: left; text: edit;\" md-waves=\"color: light; circle: true;\"><i class=\"large material-icons\">mode_edit</i></a><ul><li><a md-button=\"floating: true;\" md-tooltip=\"position: left; text: add;\" md-waves=\"color: light; circle: true;\" class=\"green\" route-href=\"route: contactNew;\"><i class=\"material-icons\">add</i></a></li><li><a md-button=\"floating: true;\" md-tooltip=\"position: left; text: edit;\" md-waves=\"color: light; circle: true;\" class=\"blue\"><i class=\"material-icons\">edit</i></a></li></ul></div></div></div></template>"; });
define('text!contact-new.html', ['module'], function(module) { module.exports = "<template><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先登録</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><md-input md-label=\"連絡先名称\" md-validate=\"true\" md-value.bind=\"contactName & validate:rules\"><i md-prefix class=\"material-icons\">account_circle</i></md-input><md-input md-label=\"表示順\" md-validate=\"true\" md-value.bind=\"orderDisplay & validate:rules\"><i md-prefix class=\"material-icons\">sort</i></md-input><md-input md-label=\"備考\" md-value.bind=\"note\"><i md-prefix class=\"material-icons\">note</i></md-input><md-checkbox md-checked.bind=\"activeFlg\">有効</md-checkbox></div></div><div class=\"row center\"><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" route-href=\"route: contactList;\"><i class=\"large material-icons\">arrow_back</i></a></div><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" click.delegate=\"validateModel()\"><i class=\"large material-icons\">cloud_upload</i></a></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map