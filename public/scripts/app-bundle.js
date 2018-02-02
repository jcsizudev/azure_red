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
      config.map([{ route: '', moduleId: 'contact-list', name: 'contactList', title: 'List' }, { route: 'contactNew/', moduleId: 'contact-new', name: 'contactNew' }, { route: 'contactEdit/:id/', moduleId: 'contact-edit', name: 'contactEdit' }]);
    };

    return App;
  }();
});
define('contact-edit',['exports', './web-api', 'aurelia-framework', 'aurelia-validation', 'aurelia-materialize-bridge', 'aurelia-router', 'moment'], function (exports, _webApi, _aureliaFramework, _aureliaValidation, _aureliaMaterializeBridge, _aureliaRouter, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactNew = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var log = _aureliaFramework.LogManager.getLogger('contact-edit');

  var ContactNew = exports.ContactNew = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController), _aureliaMaterializeBridge.MdToastService, _aureliaRouter.Router), _dec(_class = function () {
    function ContactNew(api, controller, toast, router) {
      _classCallCheck(this, ContactNew);

      this.rules = _aureliaValidation.ValidationRules.ensure('contactName').required().withMessage('連絡先名称は必須です').ensure('orderDisplay').required().withMessage('表示順は必須です').matches(/[0-9]+/).withMessage('数値を指定して下さい').rules;

      this.api = api;
      this.controller = controller;
      this.controller.addRenderer(new _aureliaMaterializeBridge.MaterializeFormValidationRenderer());
      this.toast = toast;
      this.router = router;

      this.advancedOptions = {
        closeOnSelect: true,
        closeOnClear: true,
        monthsFull: ['１月', '２月', '３月', '４月', '５月', '６月', '７月', '８月', '９月', '１０月', '１１月', '１２月'],
        monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        weekdaysFull: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
        weekdaysShort: ['日曜', '月曜', '火曜', '水曜', '木曜', '金曜', '土曜'],
        weekdaysLetter: ['日', '月', '火', '水', '木', '金', '土'],
        today: '今日',
        clear: '消去',
        close: '閉じる',
        selectYears: 5,
        editable: false,
        showIcon: false,
        format: 'yyyy/mm/dd',
        formatSubmit: 'yyyy/mm/dd'
      };

      this.contactName = '';
      this.orderDisplay = '';
      this.note = '';
      this.flgChangeDate = null;
      this.updateEmplyeeCD = null;
      this.updateDatetime = null;
      this.dispLoading = false;
      log.info('ContactNew-constructor');
    }

    ContactNew.prototype.activate = function activate(params) {
      var _this = this;

      log.info(params);
      this.dispLoading = true;
      this.api.getContact(params.id).then(function (results) {
        log.info('Success');
        log.info(results);
        if (results.length > 0) {
          _this.contactCd = results[0].MCNTCT_ContactCD;
          _this.contactName = results[0].MCNTCT_ContactName;
          _this.orderDisplay = results[0].MCNTCT_OrderDisplay;
          _this.note = results[0].MCNTCT_Note;
          _this.activeFlg = results[0].MCNTCT_ActiveFlg === 1 ? true : false;
          _this.updateEmplyeeCD = results[0].MCNTCT_UpdateEmployeeCD;
          _this.updateDatetime = (0, _moment2.default)(results[0].MCNTCT_UpdateDatetime).format('YYYY/MM/DD HH:mm:ss');
          if (results[0].MCNTCT_FlgChangeDate) {
            _this.flgChangeDate = (0, _moment2.default)(results[0].MCNTCT_FlgChangeDate).format('YYYY/MM/DD');
          }
        }
        _this.dispLoading = false;
      }).catch(function (error) {
        log.info('Error!');
        log.info(error);
        _this.dispLoading = false;
      });
    };

    ContactNew.prototype.validateModel = function validateModel() {
      var _this2 = this;

      this.controller.validate().then(function (v) {
        if (v.valid) {
          log.info('pass-1');
          _this2.dispLoading = true;
          var body = [{
            'contactCD': _this2.contactCd,
            'contactName': _this2.contactName,
            'orderDisplay': _this2.orderDisplay,
            'activeFlg': _this2.activeFlg ? 1 : 0,
            'flgChangeDate': _this2.flgChangeDate,
            'note': _this2.note,
            'updateEmployeeCD': 'izu_t'
          }];
          _this2.api.updateContact(body).then(function (results) {
            log.info('Success');
            log.info(results);
            _this2.dispLoading = false;
            _this2.router.navigate('/');
          }).catch(function (error) {
            log.info('Error!');
            log.info(error);
            _this2.dispLoading = false;
          });
        } else {
          _this2.toast.show('You have errors!', 4000, 'red white-text');
        }
      });
    };

    ContactNew.prototype.created = function created() {
      log.info('ContactEdit-created');
    };

    ContactNew.prototype.clearFlgChangeDate = function clearFlgChangeDate() {
      if (this.activeFlg) {
        this.flgChangeDate = null;
      } else {
        this.flgChangeDate = (0, _moment2.default)().format('YYYY/MM/DD');
      }
      return true;
    };

    return ContactNew;
  }()) || _class);
});
define('contact-list',['exports', './web-api', 'aurelia-framework', 'moment'], function (exports, _webApi, _aureliaFramework, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ContactList = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

      log.info('constructor!');
      this.api = api;
      this.contacts = [];
      this.activePage = 1;
      this.maxPage = 1;
      this.lineCount = 10;
      this.onCreating = false;
      this.selectedIdx = -1;
      this.dispLoading = false;
    }

    ContactList.prototype.showList = function showList() {
      var _this = this;

      this.dispLoading = true;
      this.api.getContactList(this.activePage, this.lineCount).then(function (contacts) {
        log.info('Success!');
        log.info(contacts);
        _this.contacts = contacts.map(function (e) {
          e.selected = false;
          e.displayUpdated = (0, _moment2.default)(e.MCNTCT_UpdateDatetime).format('YYYY/MM/DD HH:mm:ss');
          return e;
        });
        var allLineCount = contacts[0].LineCount;
        _this.maxPage = Math.floor(allLineCount / _this.lineCount);
        if (allLineCount % _this.lineCount !== 0) {
          _this.maxPage += 1;
        }
        _this.dispLoading = false;
      }).catch(function (error) {
        log.info('Error!');
        log.info(error);
        _this.dispLoading = false;
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
      if (this.selectedIdx >= 0) {
        this.contacts[this.selectedIdx].selected = false;
        this.selectedIdx = -1;
      }
    };

    ContactList.prototype.onClickRow = function onClickRow(idx) {
      log.info(idx);
      if (this.selectedIdx === idx) {
        this.contacts[this.selectedIdx].selected = false;
        this.selectedIdx = -1;
      } else {
        if (this.selectedIdx >= 0) {
          this.contacts[this.selectedIdx].selected = false;
        }
        this.contacts[idx].selected = true;
        this.selectedIdx = idx;
      }
    };

    ContactList.prototype.openDelModal = function openDelModal() {
      this.delmdl.open();
    };

    ContactList.prototype.onDelAgree = function onDelAgree() {
      var _this2 = this;

      log.info('del-agree');
      this.dispLoading = true;
      var body = [{
        'contactCD': this.contacts[this.selectedIdx].MCNTCT_ContactCD
      }];
      this.api.delContact(body).then(function (contacts) {
        log.info('Success!');
        log.info(contacts);
        _this2.contacts[_this2.selectedIdx].selected = false;
        _this2.selectedIdx = -1;
        _this2.dispLoading = false;
        _this2.showList();
      }).catch(function (error) {
        log.info('Error!');
        log.info(error);
        _this2.dispLoading = false;
      });
    };

    return ContactList;
  }()) || _class);
});
define('contact-new',['exports', './web-api', 'aurelia-framework', 'aurelia-validation', 'aurelia-materialize-bridge', 'aurelia-router'], function (exports, _webApi, _aureliaFramework, _aureliaValidation, _aureliaMaterializeBridge, _aureliaRouter) {
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

  var log = _aureliaFramework.LogManager.getLogger('contact-new');

  var ContactNew = exports.ContactNew = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI, _aureliaFramework.NewInstance.of(_aureliaValidation.ValidationController), _aureliaMaterializeBridge.MdToastService, _aureliaRouter.Router), _dec(_class = function () {
    function ContactNew(api, controller, toast, router) {
      _classCallCheck(this, ContactNew);

      this.rules = _aureliaValidation.ValidationRules.ensure('contactName').required().withMessage('連絡先名称は必須です').ensure('orderDisplay').required().withMessage('表示順は必須です').matches(/[0-9]+/).withMessage('数値を指定して下さい').rules;

      this.api = api;
      this.controller = controller;
      this.controller.addRenderer(new _aureliaMaterializeBridge.MaterializeFormValidationRenderer());
      this.toast = toast;
      this.router = router;

      this.contactName = '';
      this.orderDisplay = '';
      this.note = '';
      this.activeFlg = true;
      this.dispLoading = false;
      log.info('ContactNew-constructor');
    }

    ContactNew.prototype.validateModel = function validateModel() {
      var _this = this;

      this.controller.validate().then(function (v) {
        if (v.valid) {
          log.info('pass-1');
          _this.dispLoading = true;
          var body = [{
            'contactName': _this.contactName,
            'orderDisplay': _this.orderDisplay,
            'activeFlg': _this.activeFlg ? 1 : 0,
            'flgChangeDate': null,
            'note': _this.note,
            'updateEmployeeCD': 'izu_t'
          }];
          _this.api.addContact(body).then(function (results) {
            log.info('Success');
            log.info(results);
            _this.dispLoading = false;
            _this.router.navigate('/');
          }).catch(function (error) {
            log.info('Error!');
            log.info(error);
            _this.dispLoading = false;
          });
        } else {
          _this.toast.show('You have errors!', 4000, 'red white-text');
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

    WebAPI.prototype.getContact = function getContact(contactId) {
      var _this2 = this;

      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      strUrl += contactId;
      return fetch(strUrl).then(function (response) {
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

    WebAPI.prototype.addContact = function addContact(postData) {
      var _this3 = this;

      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }).then(function (response) {
        _this3.isRequesting = false;
        log.info('Success!');
        log.info(response);
        if (response.status !== 200) {
          rejected(response);
        } else {
          return response.json();
        }
      }).catch(function (error) {
        _this3.isRequesting = false;
        log.info('Error!');
        log.info(response);
        return error.json();
      });
    };

    WebAPI.prototype.updateContact = function updateContact(postData) {
      var _this4 = this;

      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }).then(function (response) {
        _this4.isRequesting = false;
        log.info('Success!');
        log.info(response);
        if (response.status !== 200) {
          rejected(response);
        } else {
          return response.json();
        }
      }).catch(function (error) {
        _this4.isRequesting = false;
        log.info('Error!');
        log.info(response);
        return error.json();
      });
    };

    WebAPI.prototype.delContact = function delContact(postData) {
      var _this5 = this;

      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }).then(function (response) {
        _this5.isRequesting = false;
        log.info('Success!');
        log.info(response);
        if (response.status !== 200) {
          rejected(response);
        } else {
          return response.json();
        }
      }).catch(function (error) {
        _this5.isRequesting = false;
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
define('text!contact-edit-styles.css', ['module'], function(module) { module.exports = ".valign-base {\n  display: flex;\n  align-items: baseline;\n}\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"materialize-css/css/materialize.css\"></require><require from=\"./styles.css\"></require><md-colors md-primary-color=\"#ee6e73\" md-accent-color=\"#2bbbad\" md-error-color=\"#FF0000\"></md-colors><div class=\"container\"><router-view></router-view></div></template>"; });
define('text!contact-list-styles.css', ['module'], function(module) { module.exports = "md-collection-item.collection-item:not(.active):hover {\n  background-color: initial;\n}\n\n.listStyle {\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n}\n\n.landOnly {}\n\n@media only screen and (orientation: portrait) {\n  .landOnly {\n    display: none;\n  }\n}\n"; });
define('text!loading.css', ['module'], function(module) { module.exports = ".loading{\n  position: fixed;\n  width: 100vw;\n  height: 100vh;\n  top: 0px;\n  left: 0px;\n  background: #eee;\n  z-index: 9999;\n  opacity: 0.5;\n}\n\n.progressIcon {\n  width: 80%;\n  margin: 0 auto;\n}\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = ".padl {\n  margin-left: 1rem;\n}\n"; });
define('text!contact-edit.html', ['module'], function(module) { module.exports = "<template><require from=\"./contact-edit-styles.css\"></require><require from=\"./loading.html\"></require><loading disp-loading.two-way=\"dispLoading\"></loading><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先編集</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><md-input md-label=\"連絡先コード\" md-validate=\"false\" md-value.bind=\"contactCd\" md-readonly.bind=\"true\"><i md-prefix class=\"material-icons\">format_list_numbered</i></md-input><md-input md-label=\"連絡先名称\" md-validate=\"true\" md-value.bind=\"contactName & validate:rules\"><i md-prefix class=\"material-icons\">account_circle</i></md-input><md-input md-label=\"表示順\" md-validate=\"true\" md-value.bind=\"orderDisplay & validate:rules\"><i md-prefix class=\"material-icons\">sort</i></md-input><md-input md-label=\"備考\" md-value.bind=\"note\"><i md-prefix class=\"material-icons\">note</i></md-input></div></div><div class=\"row valign-base\"><div class=\"col s2\"><md-checkbox md-checked.bind=\"activeFlg\" change.delegate=\"clearFlgChangeDate()\">有効</md-checkbox></div><div class=\"col s10\"><input md-datepicker=\"container: body; value.two-way: flgChangeDate; options.bind: advancedOptions;\" md-datepicker.ref=\"datePicker\" type=\"date\" placeholder=\"無効化日\" disabled.bind=\"activeFlg\"></div></div><div class=\"row\"><div class=\"col s6\"><span>更新者：</span><span>${updateEmplyeeCD}</span></div><div class=\"col s6\"><span>更新日：</span><span>${updateDatetime}</span></div></div><div class=\"row center\"><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" route-href=\"route: contactList;\"><i class=\"large material-icons\">arrow_back</i></a></div><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" click.delegate=\"validateModel()\"><i class=\"large material-icons\">cloud_upload</i></a></div></div></template>"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template><require from=\"./contact-list-styles.css\"></require><require from=\"./loading.html\"></require><loading disp-loading.two-way=\"dispLoading\"></loading><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先一覧</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><table><thead><th>Code</th><th>Name</th><th class=\"landOnly\">Order</th><th class=\"landOnly\">Updater</th><th class=\"landOnly\">Updated</th></thead><tr repeat.for=\"contact of contacts\" class=\"${contact.selected ? 'blue darken-2 white-text' : ''}\" click.delegate=\"onClickRow($index)\"><td>${contact.MCNTCT_ContactCD}</td><td>${contact.MCNTCT_ContactName}</td><td class=\"landOnly\">${contact.MCNTCT_OrderDisplay}</td><td class=\"landOnly\">${contact.MCNTCT_UpdateEmployeeCD}</td><td class=\"landOnly\">${contact.displayUpdated}</td></tr></table></div></div><div class=\"row\" style=\"text-align:center\"><div class=\"col s12\"><md-pagination md-on-page-changed.delegate=\"onPageChanged($event)\" md-pages.bind=\"maxPage\" md-active-page.bind=\"activePage\"></md-pagination></div></div><div class=\"row\"><div class=\"col s12\"><div class=\"fixed-action-btn click-to-toggle\" style=\"bottom:5px;right:5px\"><a md-button=\"floating: true; large: true;\" md-waves=\"color: light; circle: true;\"><i class=\"large material-icons\">mode_edit</i></a><ul><li><a md-button=\"floating: true; large: true;\" md-waves=\"color: light; circle: true;\" class=\"green\" route-href=\"route: contactNew;\"><i class=\"material-icons\">add</i></a></li><li><a md-button=\"floating: true; disabled.bind: selectedIdx < 0; large: true;\" md-waves=\"color: light; circle: true;\" class=\"blue\" route-href=\"route: contactEdit; params.bind: {id: selectedIdx >= 0 ? contacts[selectedIdx].MCNTCT_ContactCD : 0}\"><i class=\"material-icons\">edit</i></a></li><li><a md-button=\"floating: true; disabled.bind: selectedIdx < 0; large: true;\" md-waves=\"color: light; circle: true;\" class=\"red\" click.delegate=\"openDelModal()\"><i class=\"material-icons\">delete</i></a></li></ul></div></div><div id=\"delmdl\" md-modal md-modal.ref=\"delmdl\"><div class=\"modal-content\"><h5 class=\"landOnly\">削除確認</h5><p>選択した以下の連絡先を削除しますか？<br> ${contacts[selectedIdx].MCNTCT_ContactCD} : ${contacts[selectedIdx].MCNTCT_ContactName} </p></div><div class=\"modal-footer\"><a click.delegate=\"onDelAgree()\" md-button md-waves=\"color: accent;\" class=\"modal-action modal-close\">OK</a> <a md-button md-waves=\"color: accent;\" class=\"modal-action modal-close\">Cancel</a></div></div></div></template>"; });
define('text!contact-new.html', ['module'], function(module) { module.exports = "<template><require from=\"./loading.html\"></require><loading disp-loading.two-way=\"dispLoading\"></loading><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先登録</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><md-input md-label=\"連絡先名称\" md-validate=\"true\" md-value.bind=\"contactName & validate:rules\"><i md-prefix class=\"material-icons\">account_circle</i></md-input><md-input md-label=\"表示順\" md-validate=\"true\" md-value.bind=\"orderDisplay & validate:rules\"><i md-prefix class=\"material-icons\">sort</i></md-input><md-input md-label=\"備考\" md-value.bind=\"note\"><i md-prefix class=\"material-icons\">note</i></md-input><md-checkbox md-checked.bind=\"activeFlg\">有効</md-checkbox></div></div><div class=\"row center\"><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" route-href=\"route: contactList;\"><i class=\"large material-icons\">arrow_back</i></a></div><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" click.delegate=\"validateModel()\"><i class=\"large material-icons\">cloud_upload</i></a></div></div></template>"; });
define('text!loading.html', ['module'], function(module) { module.exports = "<template bindable=\"dispLoading\"><require from=\"./loading.css\"></require><div class=\"${dispLoading ? 'loading valign-wrapper center-align' : 'hide'}\"><md-progress md-type=\"circular\" md-size=\"big\" md-color=\"blue\" class.bind=\"'progressIcon'\"></md-progress></div></template>"; });
//# sourceMappingURL=app-bundle.js.map