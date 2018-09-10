'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
	return typeof obj;
} : function(obj) {
	return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var send = require('../utils/request.js').send;
var config = require('../utils/ulogConfig.js');

var ArrayProto = Array.prototype,
	FuncProto = Function.prototype,
	ObjProto = Object.prototype,
	slice = ArrayProto.slice,
	toString = ObjProto.toString,
	hasOwnProperty = ObjProto.hasOwnProperty;
var nativeBind = FuncProto.bind,
	nativeForEach = ArrayProto.forEach,
	nativeIndexOf = ArrayProto.indexOf,
	nativeIsArray = Array.isArray,
	breaker = {};

var source_channel_standard = 'utm_source utm_medium utm_campaign utm_content utm_term';

var referrer = '直接打开';

var mp_scene = {
	1001: '发现栏小程序主入口',
	1005: '顶部搜索框的搜索结果页',
	1006: '发现栏小程序主入口搜索框的搜索结果页',
	1007: '单人聊天会话中的小程序消息卡片',
	1008: '群聊会话中的小程序消息卡片',
	1011: '扫描二维码',
	1012: '长按图片识别二维码',
	1013: '手机相册选取二维码',
	1014: '小程序模版消息',
	1017: '前往体验版的入口页',
	1019: '微信钱包',
	1020: '公众号 profile 页相关小程序列表',
	1022: '聊天顶部置顶小程序入口',
	1023: '安卓系统桌面图标',
	1024: '小程序 profile 页',
	1025: '扫描一维码',
	1026: '附近小程序列表',
	1027: '顶部搜索框搜索结果页“使用过的小程序”列表',
	1028: '我的卡包',
	1029: '卡券详情页',
	1030: '自动化测试下打开小程序',
	1031: '长按图片识别一维码',
	1032: '手机相册选取一维码',
	1034: '微信支付完成页',
	1035: '公众号自定义菜单',
	1036: 'App 分享消息卡片',
	1037: '小程序打开小程序',
	1038: '从另一个小程序返回',
	1039: '摇电视',
	1042: '添加好友搜索框的搜索结果页',
	1043: '公众号模板消息',
	1044: '带 shareTicket 的小程序消息卡片（详情)',
	1047: '扫描小程序码',
	1048: '长按图片识别小程序码',
	1049: '手机相册选取小程序码',
	1052: '卡券的适用门店列表',
	1053: '搜一搜的结果页',
	1054: '顶部搜索框小程序快捷入口',
	1056: '音乐播放器菜单',
	1057: '钱包中的银行卡详情页',
	1058: '公众号文章',
	1059: '体验版小程序绑定邀请页',
	1064: '微信连Wi-Fi状态栏',
	1067: '公众号文章广告',
	1068: '附近小程序列表广告',
	1071: '钱包中的银行卡列表页',
	1072: '二维码收款页面',
	1073: '客服消息列表下发的小程序消息卡片',
	1074: '公众号会话下发的小程序消息卡片',
	1078: '连Wi-Fi成功页',
	1089: '微信聊天主界面下拉',
	1090: '长按小程序右上角菜单唤出最近使用历史',
	1092: '城市服务入口'
};

var getSystemInfoComplete = false;
var _queue = [];

var _ = {};
_.each = function(obj, iterator, context) {
	if (obj == null) {
		return false;
	}
	if (nativeForEach && obj.forEach === nativeForEach) {
		obj.forEach(iterator, context);
	} else if (obj.length === +obj.length) {
		for (var i = 0, l = obj.length; i < l; i++) {
			if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
				return false;
			}
		}
	} else {
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				if (iterator.call(context, obj[key], key, obj) === breaker) {
					return false;
				}
			}
		}
	}
};
_.include = function(obj, target) {
	var found = false;
	if (obj == null) {
		return found;
	}
	if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
		return obj.indexOf(target) != -1;
	}
	this.each(obj, function(value) {
		if (found || (found = value === target)) {
			return breaker;
		}
	});
	return found;
};

_.extend = function(obj) {
	this.each(slice.call(arguments, 1), function(source) {
		for (var prop in source) {
			if (source[prop] !== void 0) {
				obj[prop] = source[prop];
			};
		};
	});
	return obj;
};

_.unique = function(ar) {
	var temp,
		n = [],
		o = {};
	for (var i = 0; i < ar.length; i++) {
		temp = ar[i];
		if (!(temp in o)) {
			o[temp] = true;
			n.push(temp);
		}
	}
	return n;
};
_.isJSONString = function(str) {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};
_.isObject = function(obj) {
	return toString.call(obj) == '[object Object]' && obj != null;
};
_.isArray = nativeIsArray || function(obj) {
	return toString.call(obj) === '[object Array]';
};
_.isDate = function(obj) {
	return toString.call(obj) == '[object Date]';
};
_.formatDate = function(d) {
	function pad(n) {
		return n < 10 ? '0' + n : n;
	}

	return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '.' + pad(d.getMilliseconds());
};

_.decodeURIComponent = function(val) {
	var result = '';
	try {
		result = decodeURIComponent(val);
	} catch (e) {
		result = val;
	};
	return result;
};
_.getQueryParam = function(url, param) {
	url = this.decodeURIComponent(url);
	var regexS = "[\\?&]" + param + "=([^&#]*)",
		regex = new RegExp(regexS),
		results = regex.exec(url);
	if (results === null || results && typeof results[1] !== 'string' && results[1].length) {
		return '';
	} else {
		return this.decodeURIComponent(results[1]);
	}
};

_.searchObjDate = function(o) {
	if (_.isObject(o)) {
		_.each(o, function(a, b) {
			if (_.isObject(a)) {
				_.searchObjDate(o[b]);
			} else {
				if (_.isDate(a)) {
					o[b] = _.formatDate(a);
				}
			}
		});
	}
};
_.isString = function(obj) {
	return toString.call(obj) == '[object String]';
};

_.formatString = function(str) {
	if (str.length > config.max_string_length) {
		return str.slice(0, config.max_string_length);
	} else {
		return str;
	}
};

_.searchObjString = function(o) {
	if (_.isObject(o)) {
		_.each(o, function(a, b) {
			if (_.isObject(a)) {
				_.searchObjString(o[b]);
			} else {
				if (_.isString(a)) {
					o[b] = _.formatString(a);
				}
			}
		});
	}
};
_.isEmptyObject = function(obj) {
	if (_.isObject(obj)) {
		for (var key in obj) {
			if (hasOwnProperty.call(obj, key)) {
				return false;
			}
		}
		return true;
	}
	return false;
};
_.getUtm = function(url) {
	var campagin_w = source_channel_standard.split(' ');
	var campaign_keywords = source_channel_standard.split(' ');
	var kw = '';
	var params = {};
	url = _.decodeURIComponent(url);
	url = url.split('?');
	if (url.length === 2) {
		url = url[1];
	} else {
		return {};
	}

	url = '?' + url;
	if (_.isArray(config.source_channel) && config.source_channel.length > 0) {
		campaign_keywords = campaign_keywords.concat(config.source_channel);
		campaign_keywords = _.unique(campaign_keywords);
	}
	_.each(campaign_keywords, function(kwkey) {
		kw = _.getQueryParam(url, kwkey);
		if (kw.length) {
			if (_.include(campagin_w, kwkey)) {
				params['$' + kwkey] = kw;
			} else {
				params[kwkey] = kw;
			}
		}
	});
	return params;
};

_.getMPScene = function(key) {
	key = String(key);
	return mp_scene[key] || key;
};

_.info = {
	properties: {},
	getSystem: function getSystem() {
		var e = this.properties;
		var that = this;

		function getNetwork() {
			wx.getNetworkType({
				"success": function success(t) {
					e.$network_type = t["networkType"];
				},
				"complete": getSystemInfo
			});
		}

		function getSystemInfo() {
			try{
        let sysInfo = wx.getSystemInfoSync()
        e.$model = sysInfo['model']
        e.$screen_width = Number(sysInfo['windowWidth'])
        e.$screen_height = Number(sysInfo['windowHeight'])
        e.$os = sysInfo['system'].split(' ')[0]
        e.$os_version = sysInfo['system'].split(' ')[1]
        that.setStatusComplete()
      }catch(err){
        wx.getSystemInfo({
          success: function success(t) {
            e.$model = t['model']
            e.$screen_width = Number(t['windowWidth'])
            e.$screen_height = Number(t['windowHeight'])
            e.$os = t['system'].split(' ')[0]
            e.$os_version = t['system'].split(' ')[1]
          },
          complete: that.setStatusComplete
        })
      }
		}

		getNetwork();
	},
	setStatusComplete: function setStatusComplete() {
		getSystemInfoComplete = true;
		if (_queue.length > 0) {
			_.each(_queue, function(content) {
				prepareData.apply(null, slice.call(content));
			});
			_queue = [];
		}
	}
};

var store = {
	_state: {},
	getUUID: function getUUID() {
		return "" + Date.now() + '-' + Math.floor(1e7 * Math.random()) + '-' + Math.random().toString(16).replace('.', '') + '-' + String(Math.random() * 31242).replace('.', '').slice(0, 8);
	},
	getStorage: function getStorage() {
		return wx.getStorageSync("ulogData") || '';
	},
	getProps: function getProps() {
		return this._state.props || {};
	},
	getDistinctId: function getDistinctId() {
		return this._state.uuid;
	},
	set: function set(name, value) {
		var obj = {};
		if (typeof name === 'string') {
			obj[name] = value;
		} else if ((typeof name === 'undefined' ? 'undefined' : _typeof(name)) === 'object') {
			obj = name;
		}
		this._state = this._state || {};
		for (var i in obj) {
			this._state[i] = obj[i];
		}
		this.save();
	},
	save: function save() {
		wx.setStorageSync("ulogData", JSON.stringify(this._state));
	},
	toState: function toState(ds) {
		var state = null;
		if (_.isJSONString(ds)) {
			state = JSON.parse(ds);
			if (state.uuid) {
				this._state = state;
			} else {
				this.set('uuid', this.getUUID());
			}
		} else {
			this.set('uuid', this.getUUID());
		}
	},
	init: function init() {
		var info = this.getStorage();
		if (info) {
			this.toState(info);
		} else {
			var time = new Date();
			var visit_time = time.getTime();
			time.setHours(23);
			time.setMinutes(59);
			time.setSeconds(60);
			this.set({
        'uuid': this.getUUID(),
				'first_visit_time': visit_time,
				'first_visit_day_time': time.getTime()
			});
		}
	}
};

function prepareData(p, callback) {
	if (!getSystemInfoComplete) {
		_queue.push(arguments);
		return false;
	}

	var data = {
		uuid: store.getDistinctId(),
		properties: {}
	};

	_.extend(data, p);

	if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
		_.extend(data.properties, p.properties);
	}

	if (!p.type || p.type.slice(0, 7) !== 'profile') {
		data.properties = _.extend({}, _.info.properties, store.getProps(), data.properties);
	}

	if (data.properties.$time && _.isDate(data.properties.$time)) {
		data.time = data.properties.$time * 1;
		delete data.properties.$time;
	} else {
		if (config.use_client_time) {
			data.time = new Date() * 1;
		}
	}

	_.searchObjDate(data);
	_.searchObjString(data);

	send(data, config.server_url, callback);
};

function track(e, p, c) {
	var param = {
		type: 'track',
		event: e
	};
	if (p.evt) {
		param.evt = p.evt;
		delete p.evt;
	}
	param.properties = p;
	prepareData(param, c);
};

function autoTrackCustom(api, prop, event) {
	var temp = config.autoTrack[api];
	var tempFunc = '';
	var ev = event;
	if (config.autoTrack && temp) {
		if (typeof temp === 'function') {
			tempFunc = temp();
			if (_.isObject(tempFunc)) {
				var param = Object.assign({}, tempFunc);
				if (param.event) {
					ev = param.event;
					delete param.event;
				};

				_.extend(prop, param);
			}
		} else if (_.isObject(temp)) {
			var param = Object.assign({}, temp);
			if (param.event) {
				ev = param.event;
				delete param.event;
			};

			_.extend(prop, param);
		}
		track(ev, prop);
	}
};

function register(obj) {
	if (_.isObject(obj) && !_.isEmptyObject(obj)) {
		store.setProps(obj);
	}
};

function clearAllRegister() {
	store.setProps({}, true);
};

function init() {
	_.info.getSystem();
	store.init();
	if (_.isObject(config.register)) {
		_.info.properties = _.extend(_.info.properties, config.register);
	}
}

function appLaunch(para) {
	init();

	var prop = {};

	if (para && para.path) {
		prop.$url_path = para.path;
	}

	if (para && _.isObject(para.query) && para.query.q) {
		_.extend(prop, _.getUtm(para.query.q));
	}

	prop.$scene = _.getMPScene(para.scene);

	if (config.autoTrack && config.autoTrack.appLaunch) {
		autoTrackCustom('appLaunch', prop, '');
	}
};

function appShow(para) {};

function appHide() {};

function appError() {}

function appUnLaunch() {}

function e(t, n, o) {
	if (t[n]) {
		var e = t[n];
		t[n] = function(t) {
			if (n === 'onLaunch') {
				e.call(this, t);
				o.call(this, t, n);
			} else {
				o.call(this, t, n);
				e.call(this, t);
			}
		};
	} else {
		t[n] = function(t) {
			o.call(this, t, n);
		};
	}
}

function initApp(t, App) {
	e(t, "onLaunch", appLaunch);
	e(t, "onShow", appShow);
	e(t, "onUnLaunch", appUnLaunch);
	e(t, "onHide", appHide);
	e(t, "onError", appError);
	App(t);
};

function initPage(t, Page) {
	e(t, "onLoad", function(para) {});

	e(t, "onShow", function() {
		var router = '系统没有取到值';
		if (_typeof(this) === 'object') {
			if (typeof this.route === 'string') {
				router = this.route;
			} else if (typeof this.__route__ === 'string') {
				router = this.__route__;
			}
		}

		var prop = {};
		prop.$referrer = referrer;
		prop.$url_path = router;

		autoTrackCustom('pageShow', prop, '');

		referrer = router;
	});

	Page(t);
}

function initConfig(conf) {
	_.extend(config, conf);
};

function setObserver(clsNameArr, curCom) {
	clsNameArr.forEach(function(clsName) {
		var className = '.' + clsName;
		var observer = curCom ? curCom.createIntersectionObserver() : wx.createIntersectionObserver();

		var promise = new Promise(function(resolve, reject) {
			observer.relativeToViewport().observe(className, function(res) {
				if (res.intersectionRatio > 0) {
					resolve(res);
				};
			});
		}).then(function(res) {
			sendUlog(res);
			observer.disconnect();
		});
	});
}

function initViewUlog(query, clsNameArr) {
	setObserver(clsNameArr);
}

function initViewComUlog(query, clsNameArr, curCom) {
	setObserver(clsNameArr, curCom);
}

function sendUlog(data) {
  let city = wx.getStorageSync('city') || {}
  data.action.business_city_code = data.action.business_city_code || city.id || '110000'
	if (data.dataset && JSON.stringify(data.dataset) !== '{}') {
		send(data.dataset, config.server_url);
	} else {
		send(data, config.server_url);
	};
}

module.exports = {
	initViewUlog: initViewUlog,
	sendUlog: sendUlog,
	initViewComUlog: initViewComUlog,
	initApp: initApp,
	initPage: initPage,
  initConfig: initConfig
};