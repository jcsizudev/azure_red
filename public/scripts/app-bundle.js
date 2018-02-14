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
        _this.dlgerr.setMessage(error.message);
        _this.dlgerr.openDialog();
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
            _this2.dlgerr.setMessage(error.message);
            _this2.dlgerr.openDialog();
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
define('contact-list',['exports', './web-api', 'aurelia-framework', 'moment', './sesStorage', 'aurelia-router'], function (exports, _webApi, _aureliaFramework, _moment, _sesStorage, _aureliaRouter) {
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

  var ContactList = exports.ContactList = (_dec = (0, _aureliaFramework.inject)(_webApi.WebAPI, _sesStorage.SesStorage, _aureliaRouter.Router, _aureliaFramework.TaskQueue), _dec(_class = function () {
    function ContactList(api, storage, router, taskQueue) {
      _classCallCheck(this, ContactList);

      log.info('constructor!');
      this.api = api;
      this.storage = storage;
      this.router = router;
      this.taskQueue = taskQueue;

      this.contacts = [];
      this.activePage = 1;
      this.maxPage = 1;
      this.lineCount = 10;

      this.selectedIdx = -1;
      this.dispLoading = false;

      this.orderClass = null;
      this.orderItem = null;
      this.displaySortingMark = false;

      this.dispSearchPanel = false;
      this.srchContactName = null;
      this.srchActiveFlg = false;
      this.condContactName = null;
      this.condActiveFlg = false;

      this.restoreOptions();
    }

    ContactList.prototype.showList = function showList() {
      var _this = this;

      this.dispLoading = true;
      this.api.getContactList(this.activePage, this.lineCount, this.orderClass, this.orderItem, this.condContactName, this.condActiveFlg).then(function (contacts) {
        log.info('Success!');
        log.info(contacts);
        _this.contacts = contacts.map(function (e) {
          e.selected = false;
          e.displayUpdated = (0, _moment2.default)(e.MCNTCT_UpdateDatetime).format('YYYY/MM/DD HH:mm:ss');
          return e;
        });
        if (contacts.length === 0) {
          log.info('no data! ' + _this.activePage + ' ' + _this.maxPage);
        } else {
          var allLineCount = contacts[0].LineCount;
          _this.maxPage = Math.floor(allLineCount / _this.lineCount);
          if (allLineCount % _this.lineCount !== 0) {
            _this.maxPage += 1;
          }

          if (_this.displaySortingMark) {
            var te = $("i[name='" + _this.orderItem + "']");
            if (te) {
              if (_this.orderClass % 2 === 0) {
                te.text('arrow_upward');
              } else {
                te.text('arrow_downward');
              }
            }
            _this.displaySortingMark = false;
          }

          if (_this.selectedIdx >= 0 && _this.selectedIdx < _this.contacts.length) {
            _this.contacts[_this.selectedIdx].selected = true;
          } else {
            _this.selectedIdx = -1;
          }
        }

        _this.dispLoading = false;
      }).catch(function (error) {
        log.info('Error!');
        log.info(error);
        _this.dispLoading = false;
        _this.dlgerr.setMessage(error.message);
        _this.dlgerr.openDialog();
      });
    };

    ContactList.prototype.retryShowList = function retryShowList() {
      var self = this;
      return function () {
        self.showList();
      };
    };

    ContactList.prototype.created = function created() {
      log.info('created!');
      this.showList();
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

    ContactList.prototype.saveOptions = function saveOptions() {
      var options = {};
      var optionsJson = '';

      options = {
        activePage: this.activePage,
        maxPage: this.maxPage,
        selectedIdx: this.selectedIdx,
        orderClass: this.orderClass,
        orderItem: this.orderItem,
        condContactName: this.condContactName,
        condActiveFlg: this.condActiveFlg
      };
      optionsJson = JSON.stringify(options);
      this.storage.set('options', optionsJson);
    };

    ContactList.prototype.restoreOptions = function restoreOptions() {
      var optionsJson = null;
      var options = null;

      optionsJson = this.storage.get('options');
      log.info(optionsJson);
      if (optionsJson) {
        options = JSON.parse(optionsJson);
        log.info(options);
        this.activePage = options.activePage;
        this.maxPage = options.maxPage;
        this.selectedIdx = options.selectedIdx;
        this.orderClass = options.orderClass;
        this.orderItem = options.orderItem;
        this.displaySortingMark = this.orderClass ? true : false;
        this.condContactName = options.condContactName;
        this.condActiveFlg = options.condActiveFlg;
      }
    };

    ContactList.prototype.onAdd = function onAdd() {
      this.saveOptions();
      this.router.navigate('/contactNew/');
    };

    ContactList.prototype.onEdit = function onEdit() {
      if (this.selectedIdx >= 0) {
        this.saveOptions();
        this.router.navigate('/contactEdit/' + this.contacts[this.selectedIdx].MCNTCT_ContactCD);
      }
    };

    ContactList.prototype.openDelModal = function openDelModal() {
      $('.fixed-action-btn').closeFAB();
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
        _this2.dlgerr.setMessage(error.message);
        _this2.dlgerr.openDialog();
      });
    };

    ContactList.prototype.sortClick = function sortClick(e) {
      var targ = $(e.target);
      var elem = null;
      if (targ && targ.prop('tagName').toUpperCase() === 'I') {
        elem = targ;
      } else if (targ.find('i') && targ.find('i').prop('tagName').toUpperCase() === 'I') {
        elem = targ.find('i');
      } else {
        return;
      }

      if (this.orderItem === null) {
        elem.text('arrow_downward');
        this.orderItem = elem.attr('name');
        this.orderClass = 1;
      } else if (this.orderItem === elem.attr('name')) {
        if (elem.text() === 'arrow_downward') {
          elem.text('arrow_upward');
          this.orderClass = 2;
        } else {
          elem.text('arrow_downward');
          this.orderClass = 1;
        }
      } else {
        var te = $("i[name='" + this.orderItem + "']");
        if (te) {
          te.text('sort');
        }
        elem.text('arrow_downward');
        this.orderItem = elem.attr('name');
        this.orderClass = 1;
      }

      if (this.orderItem === 'MCNTCT_ContactName' || this.orderItem === 'MCNTCT_UpdateEmployeeCD') {
        this.orderClass += 2;
      }
      this.showList();

      log.info(elem);
      log.info(elem.attr('name'));
    };

    ContactList.prototype.openSearchPanel = function openSearchPanel() {
      if (this.dispSearchPanel) {
        this.dispSearchPanel = false;
      } else {
        this.srchContactName = this.condContactName;
        this.srchActiveFlg = this.condActiveFlg;
        this.dispSearchPanel = true;
      }
    };

    ContactList.prototype.changeSearchCondition = function changeSearchCondition() {
      var strContactName = this.srchContactName ? this.srchContactName : '';
      if (strContactName.trim().length === 0) {
        this.condContactName = null;
      } else {
        this.condContactName = strContactName.trim();
      }
      this.condActiveFlg = this.srchActiveFlg;
      this.dispSearchPanel = false;
      this.showList();
    };

    ContactList.prototype.changePageByPagingPanel = function changePageByPagingPanel() {
      log.info('changePageByPagingPanel');
      if (this.selectedIdx >= 0 && this.contacts.length > 0) {
        this.contacts[this.selectedIdx].selected = false;
      }
      this.selectedIdx = -1;
      this.showList();
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
      $('.modal').modal();
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
            log.info('new-Success');
            log.info(results);
            _this.dispLoading = false;
            _this.router.navigate('/');
          }).catch(function (error) {
            log.info('new-Error');
            log.info(error);
            _this.dispLoading = false;
            _this.dlgerr.setMessage(error.message);
            _this.dlgerr.openDialog();
          });
        } else {
          _this.toast.show('入力項目に誤りがあります。', 4000, 'red white-text');
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
define('page-panel',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.PagePanelCustomElement = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor, _descriptor2, _descriptor3;

  var log = _aureliaFramework.LogManager.getLogger('page-panel');

  var PagePanelCustomElement = exports.PagePanelCustomElement = (_dec = (0, _aureliaFramework.inject)(_aureliaFramework.TaskQueue), _dec2 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec3 = (0, _aureliaFramework.bindable)({ defaultBindingMode: _aureliaFramework.bindingMode.twoWay }), _dec(_class = (_class2 = function () {
    function PagePanelCustomElement(taskQueue) {
      _classCallCheck(this, PagePanelCustomElement);

      _initDefineProp(this, 'activePage', _descriptor, this);

      _initDefineProp(this, 'maxPage', _descriptor2, this);

      _initDefineProp(this, 'changePage', _descriptor3, this);

      this.taskQueue = taskQueue;
      this.pageSelector = false;

      this.subPaging(this.activePage, this.maxPage);
    }

    PagePanelCustomElement.prototype.subPaging = function subPaging(activePage, maxPage) {
      var _this = this;

      var pagingSize = 10;
      var startP = Math.floor(activePage / pagingSize) - (activePage % pagingSize === 0 ? 1 : 0);
      var endp = Math.floor(maxPage / pagingSize) - (maxPage % pagingSize === 0 ? 1 : 0);
      var is = startP < 0 ? 0 : startP * pagingSize;
      var ie = is + pagingSize;

      this.pages = [];
      if (startP > 0) {
        this.pages.push({ disp: '<', page: is - 1 < 0 ? 0 : is - 1, act: function act(x, y) {
            _this.subPaging(x, y);
          } });
      }
      for (var i = is; i < ie; i++) {
        if (i < maxPage) {
          this.pages.push({ disp: i + 1, page: i + 1, act: function act(x, y) {
              _this.directPageChange(x, y);
            } });
        }
      }
      if (startP < endp) {
        this.pages.push({ disp: '>', page: ie + 1, act: function act(x, y) {
            _this.subPaging(x, y);
          } });
      }
    };

    PagePanelCustomElement.prototype.directPageChange = function directPageChange(x, y) {
      this.activePage = x;
      log.info('changed->(' + this.activePage + ',' + this.maxPage + ')');
      this.taskQueue.queueMicroTask(this.changePage);
      this.pageSelector = false;
    };

    PagePanelCustomElement.prototype.onFirstPage = function onFirstPage() {
      log.info('onFirstPage(' + this.activePage + ',' + this.maxPage + ')');
      if (this.activePage > 1) {
        this.activePage = 1;
        log.info('changed->(' + this.activePage + ',' + this.maxPage + ')');
        this.taskQueue.queueMicroTask(this.changePage);
      }
      this.pageSelector = false;
    };

    PagePanelCustomElement.prototype.onPrevPage = function onPrevPage() {
      log.info('onPrevPage(' + this.activePage + ',' + this.maxPage + ')');
      if (this.activePage > 1) {
        this.activePage = this.activePage - 1;
        log.info('changed->(' + this.activePage + ',' + this.maxPage + ')');
        this.taskQueue.queueMicroTask(this.changePage);
      }
      this.pageSelector = false;
    };

    PagePanelCustomElement.prototype.onNextPage = function onNextPage() {
      log.info('onNextPage(' + this.activePage + ',' + this.maxPage + ')');
      if (this.activePage < this.maxPage) {
        this.activePage = this.activePage + 1;
        log.info('changed->(' + this.activePage + ',' + this.maxPage + ')');
        this.taskQueue.queueMicroTask(this.changePage);
      }
      this.pageSelector = false;
    };

    PagePanelCustomElement.prototype.onLastPage = function onLastPage() {
      log.info('onLastPage(' + this.activePage + ',' + this.maxPage + ')');
      if (this.activePage < this.maxPage) {
        this.activePage = this.maxPage;
        log.info('changed->(' + this.activePage + ',' + this.maxPage + ')');
        this.taskQueue.queueMicroTask(this.changePage);
      }
      this.pageSelector = false;
    };

    PagePanelCustomElement.prototype.onPageSelect = function onPageSelect() {
      this.subPaging(this.activePage, this.maxPage);
      this.pageSelector = !this.pageSelector;
    };

    return PagePanelCustomElement;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'activePage', [_dec2], {
    enumerable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'maxPage', [_dec3], {
    enumerable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, 'changePage', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('sesStorage',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SesStorage = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var log = _aureliaFramework.LogManager.getLogger('session-storage');

  var SesStorage = exports.SesStorage = function () {
    function SesStorage() {
      _classCallCheck(this, SesStorage);
    }

    SesStorage.prototype.hasSessionStorage = function hasSessionStorage() {
      return window.sessionStorage !== undefined;
    };

    SesStorage.prototype.set = function set(key, value) {
      if (this.hasSessionStorage()) {
        window.sessionStorage.setItem(key, value);
      } else {
        log.info('no sessionStorage');
      }
    };

    SesStorage.prototype.get = function get(key) {
      var rv = null;
      if (this.hasSessionStorage()) {
        rv = window.sessionStorage.getItem(key);
      } else {
        log.info('no sessionStorage');
      }
      return rv;
    };

    SesStorage.prototype.del = function del(key) {
      if (this.hasSessionStorage()) {
        window.sessionStorage.removeItem(key);
        log.info('del:' + key);
      } else {
        log.info('no sessionStorage-del');
      }
    };

    return SesStorage;
  }();
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

    WebAPI.prototype.resCheck = function resCheck(res) {
      if (!res.ok) {
        throw new Error(res.statusText);
      } else {
        return res.json();
      }
    };

    WebAPI.prototype.jsonCheck = function jsonCheck(json) {
      if (json.error) {
        throw new Error('[' + json.error.source.name + ']' + json.error.message);
      } else {
        return json;
      }
    };

    WebAPI.prototype.errorHandler = function errorHandler(error) {
      log.info(error);
      throw new Error(error.message);
    };

    WebAPI.prototype.getContactList = function getContactList(page, lineCount, orderClass, orderItem, contactName, activeFlg) {
      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      var skipRows = (page - 1) * lineCount;
      strUrl += skipRows + '/' + lineCount + (orderClass || orderItem || contactName || activeFlg ? '?' : '');
      if (orderClass) {
        strUrl += 'orderClass=' + orderClass + (orderItem ? '&' : '');
      }
      if (orderItem) {
        strUrl += 'orderItem=' + orderItem + (contactName ? '&' : '');
      }
      if (contactName !== null) {
        strUrl += 'contactName=' + contactName + (activeFlg ? '&' : '');
      }
      if (activeFlg) {
        strUrl += 'activeFlg=1';
      }
      return fetch(strUrl).then(this.resCheck).then(this.jsonCheck).catch(this.errorHandler);
    };

    WebAPI.prototype.getContact = function getContact(contactId) {
      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      strUrl += contactId;
      return fetch(strUrl).then(this.resCheck).then(this.jsonCheck).catch(this.errorHandler);
    };

    WebAPI.prototype.addContact = function addContact(postData) {
      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }).then(this.resCheck).then(this.jsonCheck).catch(this.errorHandler);
    };

    WebAPI.prototype.updateContact = function updateContact(postData) {
      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }).then(this.resCheck).then(this.jsonCheck).catch(this.errorHandler);
    };

    WebAPI.prototype.delContact = function delContact(postData) {
      this.isRequesting = true;
      var strUrl = 'https://izufr01.azurewebsites.net/api/SA21/01/';
      return fetch(strUrl, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      }).then(this.resCheck).then(this.jsonCheck).catch(this.errorHandler);
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
define('dialog-error',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogError = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var log = _aureliaFramework.LogManager.getLogger('dialog-error');

  var DialogError = exports.DialogError = function () {
    function DialogError() {
      _classCallCheck(this, DialogError);

      this.mdlmessage = '';
    }

    DialogError.prototype.setMessage = function setMessage(msg) {
      this.mdlmessage = msg;
    };

    DialogError.prototype.openDialog = function openDialog() {
      log.info('openDialog');
      this.mdlerr.open();
    };

    return DialogError;
  }();
});
define('ex-error',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ExError = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var log = _aureliaFramework.LogManager.getLogger('ex-error');

  var ExError = exports.ExError = function (_Error) {
    _inherits(ExError, _Error);

    function ExError(msg) {
      _classCallCheck(this, ExError);

      var _this = _possibleConstructorReturn(this, _Error.call(this));

      _this.message = '';
      if (msg instanceof ExError) {
        log.info('ExError');
        _this.message = msg.message;
      } else {
        log.info('Error');
        _this.message = msg;
      }
      return _this;
    }

    return ExError;
  }(Error);
});
define('text!contact-edit-styles.css', ['module'], function(module) { module.exports = ".valign-base {\n  display: flex;\n  align-items: baseline;\n}\n"; });
define('text!app.html', ['module'], function(module) { module.exports = "<template><require from=\"materialize-css/css/materialize.css\"></require><require from=\"./styles.css\"></require><md-colors md-primary-color=\"#ee6e73\" md-accent-color=\"#2bbbad\" md-error-color=\"#FF0000\"></md-colors><div class=\"container\"><router-view></router-view></div></template>"; });
define('text!contact-list-styles.css', ['module'], function(module) { module.exports = "md-collection-item.collection-item:not(.active):hover {\n  background-color: initial;\n}\n\n.touchTarget {\n  cursor: pointer;\n}\n\n.landOnly {}\n\n@media only screen and (orientation: portrait) {\n  .landOnly {\n    display: none;\n  }\n}\n\n.right_adjust {\n  text-align: right;\n}\n"; });
define('text!contact-edit.html', ['module'], function(module) { module.exports = "<template><require from=\"./contact-edit-styles.css\"></require><require from=\"./loading.html\"></require><require from=\"./dialog-error\"></require><loading disp-loading.two-way=\"dispLoading\"></loading><dialog-error view-model.ref=\"dlgerr\"></dialog-error><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先編集</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><md-input md-label=\"連絡先コード\" md-validate=\"false\" md-value.bind=\"contactCd\" md-readonly.bind=\"true\"><i md-prefix class=\"material-icons\">format_list_numbered</i></md-input><md-input md-label=\"連絡先名称\" md-validate=\"true\" md-value.bind=\"contactName & validate:rules\"><i md-prefix class=\"material-icons\">account_circle</i></md-input><md-input md-label=\"表示順\" md-validate=\"true\" md-value.bind=\"orderDisplay & validate:rules\"><i md-prefix class=\"material-icons\">sort</i></md-input><md-input md-label=\"備考\" md-value.bind=\"note\"><i md-prefix class=\"material-icons\">note</i></md-input></div></div><div class=\"row valign-base\"><div class=\"col s4\"><md-checkbox md-checked.bind=\"activeFlg\" change.delegate=\"clearFlgChangeDate()\">有効</md-checkbox></div><div class=\"col s8\"><input md-datepicker=\"container: body; value.two-way: flgChangeDate; options.bind: advancedOptions;\" md-datepicker.ref=\"datePicker\" type=\"date\" placeholder=\"無効化日\" disabled.bind=\"activeFlg\"></div></div><div class=\"row\"><div class=\"col s6\"><span>更新者：</span><span>${updateEmplyeeCD}</span></div><div class=\"col s6\"><span>更新日：</span><span>${updateDatetime}</span></div></div><div class=\"row center\"><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" route-href=\"route: contactList;\"><i class=\"large material-icons\">arrow_back</i></a></div><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" click.delegate=\"validateModel()\"><i class=\"large material-icons\">cloud_upload</i></a></div></div></template>"; });
define('text!loading.css', ['module'], function(module) { module.exports = ".loading{\n  position: fixed;\n  width: 100vw;\n  height: 100vh;\n  top: 0px;\n  left: 0px;\n  background: #eee;\n  z-index: 9999;\n  opacity: 0.5;\n}\n\n.progressIcon {\n  width: 80%;\n  margin: 0 auto;\n}\n"; });
define('text!page-panel.css', ['module'], function(module) { module.exports = ".paging_pad {\n  padding: 0px 10px;\n}\n\n.paging_font {\n  font-size: 2rem;\n}\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = ".padl {\n  margin-left: 1rem;\n}\n"; });
define('text!contact-list.html', ['module'], function(module) { module.exports = "<template><require from=\"./contact-list-styles.css\"></require><require from=\"./page-panel\"></require><require from=\"./loading.html\"></require><require from=\"./dialog-error\"></require><loading disp-loading.two-way=\"dispLoading\"></loading><dialog-error view-model.ref=\"dlgerr\"></dialog-error><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先一覧</span></a><ul class=\"right\"><li md-waves><a click.delegate=\"openSearchPanel()\">Search</a></li></ul><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><md-card class=\"${dispSearchPanel ? '' : 'hide'}\"><div class=\"row\"><div class=\"col s12\"><md-input md-label=\"連絡先名称\" md-value.bind=\"srchContactName\"></md-input></div></div><div class=\"row\"><div class=\"col s6\">Active Only:<md-switch md-checked.bind=\"srchActiveFlg\"></md-switch></div><div class=\"col s6 right_adjust\"><a md-button=\"floating: true; large: true;\" md-waves=\"color: light; circle: true;\" click.delegate=\"dispSearchPanel = false\"><i class=\"large material-icons\">arrow_back</i> </a>&nbsp;&nbsp;&nbsp;&nbsp; <a md-button=\"floating: true; large: true;\" md-waves=\"color: light; circle: true;\" click.delegate=\"changeSearchCondition()\"><i class=\"large material-icons\">search</i></a></div></div></md-card><div class=\"row\"><div class=\"col s12\"><table class=\"striped\"><thead><th class=\"right touchTarget\" click.delegate=\"sortClick($event)\"><i name=\"MCNTCT_ContactCD\" class=\"tiny material-icons\">sort</i>Code</th><th class=\"center touchTarget\" click.delegate=\"sortClick($event)\"><i name=\"MCNTCT_ContactName\" class=\"tiny material-icons\">sort</i>Name</th><th class=\"landOnly right touchTarget\" click.delegate=\"sortClick($event)\"><i name=\"MCNTCT_OrderDisplay\" class=\"tiny material-icons\">sort</i>Order</th><th class=\"landOnly center touchTarget\" click.delegate=\"sortClick($event)\"><i name=\"MCNTCT_UpdateEmployeeCD\" class=\"tiny material-icons\">sort</i>Updater</th><th class=\"landOnly center touchTarget\" click.delegate=\"sortClick($event)\"><i name=\"MCNTCT_UpdateDatetime\" class=\"tiny material-icons\">sort</i>Updated</th></thead><tbody><tr repeat.for=\"contact of contacts\" class=\"${contact.selected ? 'blue darken-2 white-text touchTarget' : 'touchTarget'}\" click.delegate=\"onClickRow($index)\"><td class=\"right\">${contact.MCNTCT_ContactCD}</td><td class=\"center\">${contact.MCNTCT_ContactName}</td><td class=\"landOnly right\">${contact.MCNTCT_OrderDisplay}</td><td class=\"landOnly center\">${contact.MCNTCT_UpdateEmployeeCD}</td><td class=\"landOnly center\">${contact.displayUpdated}</td></tr></tbody></table></div></div><div class=\"row valign-wrapper\"><div class=\"col s12\"><page-panel active-page.bind=\"activePage\" max-page.bind=\"maxPage\" change-page.call=\"changePageByPagingPanel()\"></page-panel></div></div><div class=\"row\"><div class=\"col s12\"><div class=\"fixed-action-btn click-to-toggle\" style=\"bottom:23px;right:12px\"><a md-button=\"floating: true; large: true;\" md-waves=\"color: light; circle: true;\"><i class=\"large material-icons\">mode_edit</i></a><ul><li><a md-button=\"floating: true; large: true;\" md-waves=\"color: light; circle: true;\" class=\"green\" click.delegate=\"onAdd()\"><i class=\"material-icons\">add</i></a></li><li><a md-button=\"floating: true; disabled.bind: selectedIdx < 0; large: true;\" md-waves=\"color: light; circle: true;\" class=\"blue\" click.delegate=\"onEdit()\"><i class=\"material-icons\">edit</i></a></li><li><a md-button=\"floating: true; disabled.bind: selectedIdx < 0; large: true;\" md-waves=\"color: light; circle: true;\" class=\"red\" click.delegate=\"openDelModal()\"><i class=\"material-icons\">delete</i></a></li></ul></div></div></div><div id=\"delmdl\" md-modal md-modal.ref=\"delmdl\"><div class=\"modal-content\"><h5 class=\"landOnly\">削除確認</h5><p>選択した以下の連絡先を削除しますか？<br> ${contacts[selectedIdx].MCNTCT_ContactCD} : ${contacts[selectedIdx].MCNTCT_ContactName} </p></div><div class=\"modal-footer\"><a click.delegate=\"onDelAgree()\" md-button md-waves=\"color: accent;\" class=\"modal-action modal-close\">OK</a> <a md-button md-waves=\"color: accent;\" class=\"modal-action modal-close\">Cancel</a></div></div></template>"; });
define('text!contact-new.html', ['module'], function(module) { module.exports = "<template><require from=\"./loading.html\"></require><require from=\"./dialog-error\"></require><loading disp-loading.two-way=\"dispLoading\"></loading><dialog-error view-model.ref=\"dlgerr\"></dialog-error><md-navbar><a href=\"#\" class=\"brand-logo left\"><span class=\"padl\">連絡先登録</span></a><ul class=\"hide-on-med-and-down right\"><li md-waves><a>About</a></li><li md-waves><a>Installation</a></li><li md-waves><a>Project Status</a></li></ul></md-navbar><div class=\"row\"><div class=\"col s12\"><md-input md-label=\"連絡先名称\" md-validate=\"true\" md-value.bind=\"contactName & validate:rules\"><i md-prefix class=\"material-icons\">account_circle</i></md-input><md-input md-label=\"表示順\" md-validate=\"true\" md-value.bind=\"orderDisplay & validate:rules\"><i md-prefix class=\"material-icons\">sort</i></md-input><md-input md-label=\"備考\" md-value.bind=\"note\"><i md-prefix class=\"material-icons\">note</i></md-input><md-checkbox md-checked.bind=\"activeFlg\">有効</md-checkbox></div></div><div class=\"row center\"><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" route-href=\"route: contactList;\"><i class=\"large material-icons\">arrow_back</i></a></div><div class=\"col s6\"><a md-button=\"floating: true; large: true; pulse.bind: pulse;\" md-waves=\"color: light; circle: true;\" click.delegate=\"validateModel()\"><i class=\"large material-icons\">cloud_upload</i></a></div></div></template>"; });
define('text!loading.html', ['module'], function(module) { module.exports = "<template bindable=\"dispLoading\"><require from=\"./loading.css\"></require><div class=\"${dispLoading ? 'loading valign-wrapper center-align' : 'hide'}\"><md-progress md-type=\"circular\" md-size=\"big\" md-color=\"blue\" class.bind=\"'progressIcon'\"></md-progress></div></template>"; });
define('text!page-panel.html', ['module'], function(module) { module.exports = "<template><require from=\"./page-panel.css\"></require><md-card class=\"${pageSelector ? '' : 'hide'}\"><div style=\"text-align:center\"><span repeat.for=\"page of pages\"><a md-waves class=\"black-text paging_pad paging_font\" click.delegate=\"page.act(page.page, maxPage)\"> ${page.disp} </a></span></div></md-card><div style=\"text-align:center\"><a md-waves class=\"${activePage === 1 ? 'grey-text paging_pad' : 'black-text paging_pad'}\" click.delegate=\"onFirstPage()\"><i class=\"small material-icons\">first_page</i> </a><a md-waves class=\"${activePage === 1 ? 'grey-text paging_pad' : 'black-text paging_pad'}\" click.delegate=\"onPrevPage()\"><i class=\"small material-icons\">chevron_left</i> </a><a md-waves class=\"${maxPage > 1 ? 'black-text paging_pad' : 'grey-text paging_pad'}\" click.delegate=\"onPageSelect()\"><span class=\"paging_pad paging_font\">${activePage}</span></a><a md-waves class=\"${activePage === maxPage ? 'grey-text paging_pad' : 'black-text paging_pad'}\" click.delegate=\"onNextPage()\"><i class=\"small material-icons\">chevron_right</i> </a><a md-waves class=\"${activePage === maxPage ? 'grey-text paging_pad' : 'black-text paging_pad'}\" click.delegate=\"onLastPage()\"><i class=\"small material-icons\">last_page</i></a></div></template>"; });
define('text!dialog-error.html', ['module'], function(module) { module.exports = "<template><div id=\"mdlerr\" md-modal md-modal.ref=\"mdlerr\"><div class=\"modal-content\"><h5 class=\"landOnly\">エラー</h5><p>${mdlmessage}</p></div><div class=\"modal-footer\"><a md-button md-waves=\"color: accent;\" class=\"modal-action modal-close\">OK</a></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map