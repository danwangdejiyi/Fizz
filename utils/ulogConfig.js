var conf = {
	// 分析数据接收地址
	server_url: 'https://dig.lianjia.com/bigc.gif',
	// 传入的字符串最大长度限制
	max_string_length: 300,
	// 发送事件的时间使用客户端时间还是服务端时间
	use_client_time: false,
	// 是否自动采集如下事件
	autoTrack: {
		//$MPLaunch
		appLaunch: true,
		//$MPShow
		appShow: true,
		//$MPHide
		appHide: true,
		//$MPViewScreen
		pageShow: true
	}
};

module.exports = conf;