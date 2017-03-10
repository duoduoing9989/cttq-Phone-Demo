/**
 * 上海咨果科技混合式开发移动端端js 库
 */

var MicroApp = (function namespace() {
	

	/**
	 * 设置日期的函数,其中element_id为源对象的id,如果为空,不做任何处理,
	 * 否则从这个对象内获取初始化的日期时间
	 * 默认日期为yyyy-MM-dd
	 * 
	 * 如果cbfunc不为空,用户native点击确定后会以新的时间参数调用本回调函数
	 * 参数为json格式{date='2016-01-01'}的对象
	 * 
	 * @param {Object} element_id
	 * @param {Object} cbfunc
	 */
	var setDate_ = function(element_id, cbfunc) {
		var para={"date":$("#"+element_id).val()};
		
		debug(para);
		
		callNative('setDate',para,cbfunc);
//		var date={"date":"2016-08-08"};
//		cbfunc(date);

	};
	var setDate2_ = function(element_id, cbfunc) {
		var para={"date":$("#"+element_id).text()};
		
		debug(para);
		
		callNative('setDate',para,cbfunc);
//		var date={"date":"2016-08-08"};
//		cbfunc(date);

	};

	/**
	 * 设置时间函数,其中element_id为源对象的id,如果为空,不做任何处理,
	 * 否则默认时间为此对象内获取的值为初始时间
	 * 默认时间格式为24小时
	 * 
	 * 如果cbfunc不为空,用户native点击确定后会以新的时间参数调用本回调函数
	 * 参数为json格式{time='20:00'}的对象
	 * 
	 * @param {Object} element_id
	 * @param {Object} cbfunc
	 */
	var setTime_= function(element_id, cbfunc) {
		var para = {"time":$("#"+element_id).val()};
		
		debug(para);
		
		callNative("setTime",para,cbfunc);
		
	};
	var setTime2_= function(element_id, cbfunc,url) {
		var para = {"time":$("#"+element_id).text(),"url":url};
		
		debug(para);
		
		callNative("setTime",para,cbfunc);
		
	};

	
	/**
	 * 系统通过native接口把数据保存在原生态的sqlite数据库内
	 * 如果key和account对应的记录有,那么覆盖数据,否则新增数据
	 * value内容可以包括任何对象
	 * 
	 * @param {Object} key
	 * @param {Object} account
	 * @param {Object} value
	 */
	var setValue_=function(key,account,value){
		
		
		para = {"key":key,"account":account,"value":value};
		
		callNative("setValue",para,"");
	};
	
	/**
	 * 把记录的内容原封不动的作为参数回调cbfunc,否则以null回调
	 * 调用者需要根据参数判断业务逻辑
	 * 
	 * @param {Object} key
	 * @param {Object} account
	 * @param {Object} cbfunc
	 */
	var getValue_=function(key,account,cbfunc){
		
		para = {"key":key,"account":account};
		callNative("getValue",para,cbfunc);
	};
	
	/**

	 * 如果key和account对应的记录有,那么覆盖数据,否则新增数据
	 * value内容可以包括任何对象
	 * 
	 * @param {Object} key
	 * @param {Object} account
	 * @param {Object} value
	 */
	var setValueH5_=function(key,account,value){
		localStorage.setItem(key+account,value);
	};
	
	/**
	 * 根据key和account去原生态的系统获取对应的缓存记录,如果记录存在
	 * 把记录的内容原封不动的作为参数回调cbfunc,否则以null回调
	 * 调用者需要根据参数判断业务逻辑
	 * 
	 * @param {Object} key
	 * @param {Object} account
	 * @param {Object} cbfunc
	 */
	var getValueH5_=function(key,account,cbfunc){
		var val=localStorage.getItem(key+account);
		cbfunc(val);
	};
	
	/**
	 * 从相册获取照片,原生态获取照片后会把照片在本地访问的文件路径作为参数传递给cbfunc
	 * 如果路径为空,用户没有选择获取取消图片
	 * cbfunc([{"file":'/var/xxxx'},{}])
	 * 
	 * @param {Object} cbfunc
	 */
	var getImage_=function(cbfunc){
		
		callNative("getImage","",cbfunc);
	};
	
	/**
	 * 从相机获取照片,原生态获取照片后会把照片在本地访问的文件路径作为参数传递给cbfunc
	 * 如果路径为空,用户没有选择获取取消图片
	 * 
	 * @param {Object} cbfunc
	 */
	var getCamera_=function(cbfunc){
		
		callNative("getCamera","",cbfunc);
	};
	
	/**
	 * 从原生态的相册或者相机选择一张照片,用户选择任何来源都可以,回调参数同从相册选择
	 * 
	 * @param {Object} cbfunc
	 */
	var getPicutre_=function(cbfunc){
		
		callNative("getPicutre","",cbfunc);
	};
	
	/*
	 * 如果cbfunc不为空,用户native点击确定后会以新的时间参数调用本回调函数
	 * 参数为json格式{result='http://***'}的对象
	 */
	var scanQrcode_=function(cbfunc){
		
		callNative("scanQrcode","",cbfunc);
	};
	
	/**
	 * 获取城市接口,原生态接口动态显示省市区的三级联动信息
	 * 参数para如果不为空,原生态系统默认值为para
	 * 用户选择后以标准的格式反馈到cbfunc回调函数
	 * 
	 * @param {Object} para  {city={code='123',name='南京'},prov={code='1111',name='江苏'},area={code='11',name='秦淮区'}}
	 * @param {Object} cbfunc
	 */
	var getCity_=function(para,cbfunc){
		
		var para = {"city":{"code":"123","name":"南京"},"prov":{"code":"1111","name":"江苏"},"area":{"code":"11","name":"秦淮区"}};
		
		callNative("getCity",para,cbfunc);
	};
	
	/**
	 * 获取系统地址的原生态接口,原始程序通过第三方原始sdk接口获取地址和经纬度信息
	 * 获取之后通过回调接口通知h5
	 * @param {Object} para {"addr":"shanghai",lat:121,lon:212}
	 * @param {Object} cbfunc  cbfunc(addr,lat,lon); 
	 */
	var getAddress_=function(para,cbfunc){
		
		var para = {"addr":"上海","lat":"123","lon":"222"};
		
		callNative("getAddress",para,cbfunc);
	};
	
	/**
	 * 设置右上角菜单
	 * 每个菜单有名称,图标,回调函数
	 * 图片和名称可以为空,但是不能都为空
	 * icon 参数为本地的图标或者远程的一个图标连接
	 * @param {Object} para[{name='22',icon='',cbfunc=xxx},{name='333',icon='',cbfunc=xxx}]
	 */
	var setRightMenu_=function(para){
//		var para = [{"name":"姓名","icon":"","cbfunc":"cb"},{"name":"姓名","icon":"","cbfunc":"cb"}];
		callNative("setRightMenu",para,"");
	};

	/**
	 * 设置底部弹出菜单
	 * 每个菜单有名称,图标,回调函数
	 * 图片和名称可以为空,但是不能都为空
	 * icon 参数为本地的图标或者远程的一个图标连接
	 * @param {Object} para[{name='22',icon='',cbfunc=xxx},{name='333',icon='',cbfunc=xxx}]
	 */
	var setBottomMenu_=function(para){
//		var para = [{"name":"姓名","icon":"","cbfunc":"cb"},{"name":"姓名","icon":"","cbfunc":"cb"}];
		callNative("setBottomMenu",para,"");
	};
	var setLeftRightMenu_= function(para){
		callNative("setLeftRightMenu",para,"");
	};
	/**
	 * 下一页
	 */
	var nextPage_ = function(url){
		var url = url+"?action=nextPage";
		window.location.href=url;
	};
	
	/**
	 * 关闭本页
	 */
	var closePage_=function(){
		notifyNative("closePage");
	};
	
	/**
	 * 关闭本页并且刷新之前的页面
	 */
	var closePageAndRefresh_=function(){
		notifyNative("closePageAndRefresh");
	};
	
	/**
	 * 回到首页
	 */
	var homePage_=function(){
		notifyNative("homePage");
	};
	
	/**
	 * 显示比例
	 * @param {Object} progress 0.0-1.0
	 */
	var showProgressRatio_=function(progress){
		cmd = "showProgressRatio_";
		var para={"progress":progress};
		callNative(cmd,para,'');
	};
	
	/**
	 * 显示进度条
	 */
	var showProgress_=function(){
		callNative("showProgress",'','');
	};
	
	/**
	 * 禁止显示
	 */
	var hideProgress_=function(){
		callNative("hideProgress",'','');
	};
	
	/**
	 * 强制全屏界面
	 */
	var showModelPage_=function(){
		callNative("showModelPage",'','');
	};
	/**
	 * 强制全屏搜索界面
	 */
	var showModelSearchPage_=function(){
		callNative("showModelSearchPage",'','');
	};
	/**
	 * 关闭全屏界面
	 */
	var closeModelPage_=function(){
		callNative("closeModelPage",'','');
	};
	var showhud_=function(param){
		callNative("showhud",param,'');
	};
	var pagetips_=function(param){
		callNative("pagetips",param,'');
	};
	var pagetips2_=function(param,cb){
		callNative("pagetips",param,cb);
	};
	/**
	 * 发送消息
	 */
	var sendMessage_=function(param){
		callNative("sendMessage", param, "");
	}	
	/**
	 * 接收消息
	 */
	var recvMessage_=function(param, cb){
		callNative("recvMessage", param, cb);
	}

	/**
	 * 设置标题
	 * MicroApp().setTitle("这个是标题");
	 * {"title":"这个是标题"}
	 */
	var setTitle_=function(param){
		if (typeof (param) == "string") {
			param = {title:param};
		}
		callNative("setTitle",param,'');
	}
	/**
	 * 图片浏览器
	 * { item:[ { url:string, name:string } ] }
	 */
	var imgBrowse_ = function(param) {
		callNative("imgBrowse",param,'');
	}
	                       
	/*
	 * 与native交互
	 */
	function callNative(cmd, para, cb) {
		var hasCallback = cb && typeof cb == "function";
		var callbackId = hasCallback ? NativeBridge.callbacksCount++ : 0;
		if(hasCallback)
			NativeBridge.callbacks[callbackId] = cb;
		var iframe = document.createElement("IFRAME");
		var url = 'kitapps://' + cmd + '?para=' + encodeURIComponent(JSON.stringify(para)) + '&callback=' + cb + '&sn=' + (new Date()).getTime();
		console.log(url);
		iframe.setAttribute("src", url);
		// For some reason we need to set a non-empty size for the iOS6 simulator...
		iframe.setAttribute("height", "1px");
		iframe.setAttribute("width", "1px");
		document.documentElement.appendChild(iframe);
		iframe.parentNode.removeChild(iframe);
		iframe = null;
	}
	function notifyNative(url){
		var url = "/prj/product/show&action="+url;
		console.log(url);
		window.location.href = url;
	}
	/*
	 * 打印日志
	 */
	function debug(info){
		console.log("MicroApp Debug:"+JSON.stringify(info));
	}
	
	/**
	 * 禁止刷新
	 */
	var forbidRefresh_=function(){
		callNative('forbidRefresh','','');
	};
    
    /**
	 * 调用手机
	 */
	var cellphone_=function(param){
		callNative("cellphone",param,'');
	};
	
	/**
	 * 下载图片
	 */
	var savePicture_=function(param, cb){
		callNative("savePicture",param,cb);
	}
	/**
	 * 对象返回函数接口
	 */
	return {
		/**
		 * 公共操作
		 */
		setDate: 	setDate_,
		setDate2: 	setDate2_,
		setTime: 	setTime_,
		setTime2: 	setTime2_,
		getImage:	getImage_,
		getCamera:	getCamera_,
		getPicture:	getPicutre_,
		getCity:		getCity_,
		getAddress:	getAddress_,
		scanQrcode: scanQrcode_,
		
		/**
		 * 缓存机制
		 */
		setValue:	setValue_,
		getValue:	getValue_,
		setValueH5:	setValueH5_,
		getValueH5:	getValueH5_,
		
		/**
		 * 菜单
		 */
		setRightMenu:setRightMenu_,
		setBottomMenu:setBottomMenu_,
		setLeftRightMenu:setLeftRightMenu_,
		
		/**
		 * 页面跳转
		 */
		nextPage: nextPage_,
		closePage: closePage_,
		closePageAndRefresh:closePageAndRefresh_,
		homePage:homePage_,
		
		/**
		 * 进度条
		 */
		showProgress:showProgress_,
		showProgressRatio:showProgressRatio_,
		hideProgress:hideProgress_,
		
		/**
		 * 模块化界面
		 */
		showModelPage:showModelPage_,
		showModelSearchPage:showModelSearchPage_,
		closeModelPage:closeModelPage_,
		
		/**
		 * 加载转圈
		 */
		showhud:showhud_,
		
		/**
		 * 提示框
		 */
		pagetips:pagetips_,
		pagetips2:pagetips2_,
		
		/**
		 * 禁止刷新
		 */
		forbidRefresh:forbidRefresh_,
		
		/**
		 * 调用手机
		 */
		cellphone:cellphone_,
		
		/**
		 * 消息
		 */
		sendMessage:sendMessage_,
		recvMessage:recvMessage_,
		
		/**
		 * 标题
		 */
		setTitle:setTitle_,
		/**
		 * 图片浏览器
		 */
		imgBrowse:imgBrowse_,
		/**
		 * 下载图片
		 */
		savePicture:savePicture_
	};
});