'use strict';

function utf8Encode(string) {
	string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

	var utftext = '',
		start,
		end;
	var stringl = 0,
		n;

	start = end = 0;
	stringl = string.length;

	for (n = 0; n < stringl; n++) {
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode(c1 >> 6 | 192, c1 & 63 | 128);
		} else {
			enc = String.fromCharCode(c1 >> 12 | 224, c1 >> 6 & 63 | 128, c1 & 63 | 128);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.substring(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.substring(start, string.length);
	}

	return utftext;
};

function base64Encode(data) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var o1,
		o2,
		o3,
		h1,
		h2,
		h3,
		h4,
		bits,
		i = 0,
		ac = 0,
		enc = '',
		tmp_arr = [];
	if (!data) {
		return data;
	}
	data = utf8Encode(data);
	do {
		o1 = data.charCodeAt(i++);
		o2 = data.charCodeAt(i++);
		o3 = data.charCodeAt(i++);

		bits = o1 << 16 | o2 << 8 | o3;

		h1 = bits >> 18 & 0x3f;
		h2 = bits >> 12 & 0x3f;
		h3 = bits >> 6 & 0x3f;
		h4 = bits & 0x3f;
		tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
	} while (i < data.length);

	enc = tmp_arr.join('');

	switch (data.length % 3) {
		case 1:
			enc = enc.slice(0, -2) + '==';
			break;
		case 2:
			enc = enc.slice(0, -1) + '=';
			break;
	}

	return enc;
};

function isObject(obj) {
	return toString.call(obj) == '[object Object]' && obj != null;
};

function getPid(path) {//修改
	/*// 仅针对贝壳找房
	let arr = ['pages/index/index', 'pages/profile/index', 'pages/common/citys/index', 'pages/favorite/index'];
	var pid = '';
	if (!path) return;
	if (arr.indexOf(path) > -1) {
		pid = 'bigc_xcx';
	} else {
		pid = 'bigc_xcx_ershou';
	}*/
	return 'bigc_xcx_rent';
}

function getTimeStamp() {
	var t = new Date();
	return t.getTime();
}

var para = {
	"pid": 'bigc_xcx_rent',//修改
	"uicode": '',
	"ssid": '',
	"uuid": '',
	"ucid": '',
	"cid": '',
	"f": '',
	"$screen_height": '',
	"$screen_width": '',
	"key": "",
	"token": ""
};

var autoExeQueue = {
	items: [],
	enqueue: function enqueue(val) {
		this.items.push(val);
		this.start();
	},
	dequeue: function dequeue() {
		return this.items.shift();
	},
	getCurrentItem: function getCurrentItem() {
		return this.items[0];
	},

	isRun: false,
	start: function start() {
		if (this.items.length > 0 && !this.isRun) {
			this.isRun = true;
			this.getCurrentItem().start();
		}
	},
	close: function close() {
		this.dequeue();
		this.isRun = false;
		this.start();
	}
};

function requestQueue(para) {
	this.url = para.url;
	this.data = para.data;
}

requestQueue.prototype.isEnd = function() {
	if (!this.received) {
		this.received = true;
		this.close();
	}
};

requestQueue.prototype.start = function() {
	var me = this;
	setTimeout(function() {
		me.isEnd();
	}, 300);
	wx.request({
		url: this.url,
		method: 'GET',
		data: this.data,
		complete: function complete() {
			me.isEnd();
		}
	});
};

requestQueue.prototype.close = function() {
	autoExeQueue.close();
};

function prepareData(data) {
  var param = {}

  if (data.uuid) {
    para.uuid = param.uuid = data.uuid
    para.device_id = para.uuid
    delete data.uuid
  }

  if (wx.getStorageSync('token')) {//修改request.js的seesion_id为tokeb
    para.token = param.token = wx.getStorageSync('token')
  } else {
    para.token = param.token = ''
  }

  if (data.properties && isObject(data.properties) && data.properties.$url_path) {
    param.pid = para.pid = getPid(data.properties.$url_path)
    param.key = para.key = para.uicode = data.properties.$url_path

    delete data.properties.$url_path
  }

  if (data.properties && isObject(data.properties)) {

    if (data.properties.$referrer) {
      param.f = para.f = data.properties.$referrer

      delete data.properties.$referrer
    };

    para = Object.assign(para, data.properties)
    param = Object.assign({}, para)

    delete data.properties

    param = Object.assign(param, {
      evt: data.evt || '',
      event: data.event || '',
      action: JSON.stringify(data.action) !== '{}' ? data.action : {}
    })

    data.evt ? delete data.evt : ''
    data.event ? delete data.event : ''
    JSON.stringify(data.action) !== '{}' ? delete data.action : ''
  };

  if (data.evt && data.event) {
    param = Object.assign({}, para, {
      evt: data.evt || '',
      event: data.event || '',
      uicode: data.uicode || para.uicode || '',
      action: JSON.stringify(data.action) !== '{}' ? data.action : {}
    })
  }
  return param
}

function send(t, server_url) {
	var url = '';
	var param = {};
  param = prepareData(t);

	// if (param.uuid === '') {//修改
	// 	return false;
	// }
  
  if (JSON.stringify(param) == '{}' || param.event === '') {
    return false
  }

  param._nocache = (String(Math.random()) + String(Math.random()) + String(Math.random())).slice(2, 15)
  
  param = JSON.stringify(param)

  var timeStamp = getTimeStamp()

	if (server_url.indexOf('?') !== -1) {
		url = server_url + '&t=' + timeStamp + '&d=' + encodeURIComponent(base64Encode(param));
	} else {
		url = server_url + '?t=' + timeStamp + '&d=' + encodeURIComponent(base64Encode(param));
	}
	var instance = new requestQueue({
		url: url,
		data: {
			t: timeStamp,
			d: param
		}
	});

	autoExeQueue.enqueue(instance);
};

module.exports = {
  send: send
};