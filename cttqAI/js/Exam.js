/**
 * 混合型业务开发控制器参考代码
 * 
 */

var Exam = ( function namespace(){
	
	/**
	 * 用户参数
	 */
	var req;
	
	var quotation_=function(){
		
	}
	/**
	 * 设置日期
	 */
	function setStartDate(elementId){
		MicroApp().setDate(elementId,'Exam.setStartDateCB("'+elementId+'",');
	}
	function setStartDateCB(elementId,val){
		
		$("#"+elementId).val(val.date);
	}
    function setStartDate2(elementId){
    	
		MicroApp().setDate2(elementId,'Exam.setStartDateCB2("'+elementId+'",');
	}
	function setStartDateCB2(elementId,val){
		
        $(window.frames[0].document).find("#"+elementId).text(val.date);
	}
	/**
	 * 设置时间
	 */
	function setStartTime(elementId){
//		var cb = function (val){
//			$("#"+elementId).val(val.time);
//		}
		MicroApp().setTime(elementId,'Exam.setStartTimeCB("'+elementId+'",');
	}
	function setStartTimeCB(elementId,val){
		
		$("#"+elementId).val(val.time);

	}
    function setStartTime2(elementId){
        
		MicroApp().setTime2(elementId,'Exam.setStartTimeCB2("'+elementId+'",');
	}
	function setStartTimeCB2(elementId,val){
 
		$(window.frames[0].document).find("#"+elementId).text(val.time);
        
	}
	
	/**
	 * 向native传递参数
	 */
//	function setValue(key,account,value){
//		MicroApp().setValue(key,account,value);
//	}
	
	/**
	 * 从native获取参数
	 */
	function getValue(key,account){
		MicroApp().getValue(key,account,'Exam.getValueCB(');
	}
	function getValueCB(val){
		alert(val);
	}
	/**
	 * h5做set缓存
	 */
//	function setValueH5(key,account,value){
//		MicroApp().setValueH5(key,account,value);
//	}
	
	/**
	 * h5本地获取数据
	 */
	function getValueH5(key,account){
		var cb = function (val){
			return val;
		}
		MicroApp().getValueH5(key,account,cb);
	}
	
	/**
	 * 从相册获取图片
	 */
	function getImage(){
		var cb = function (val) {
			
		}
		MicroApp().getImage(cb);
	}
	
	/**
	 * 从相机获取图片
	 */
	function getCamera(){
		var cb = function (val){
			
		}
		MicroApp().getCamera(cb);
	}
	
	/*
	 * 从原生态的相册或者相机选择一张照片
	 */
	function getPicutre(){
		var cb = function (val){
			
		}
		MicroApp().getPicture(cb);
	}
	/*
	 * 获取城市
	 */
	function getCity(elementId){
		MicroApp().getCity(elementId,'Exam.getCityCB("'+elementId+'",');
	}
	function getCityCB(elementId,val){
		$("#"+elementId).val(val.city.name+val.prov.name+val.area.name);
	}
	
	/*
	 * 获取系统地址
	 */
	function getAddress(elementId){
		MicroApp().getAddress(elementId,'Exam.getAddreeCB("'+elementId+'",');
	}
	function getAddreeCB(elementId,val){
		$("#"+elementId).val(val.addr+val.lat+val.lon);
	}
	
	function init(){
		MicroApp().getValue('order_123','012345678912','Exam.initCb(');
	}
	function initCb(val){
		alert(val);
	}
	
	return {
//		init();
		setReq: function(r){
			req=r;
		},
		getReq:function(){
			return req;
		},
		quotation:quotation_,
		setStartDate:setStartDate,
		setStartDate2:setStartDate2,
		setStartTime:setStartTime,		
		setStartTime2:setStartTime2,
		getValue:getValue,
		getValueH5:getValueH5,
		getImage:getImage,
		getCamera:getCamera,
		getPicutre:getPicutre,
		getCity:getCity,
		getAddress:getAddress,
		setStartDateCB:setStartDateCB,
		setStartDateCB2:setStartDateCB2,
		setStartTimeCB:setStartTimeCB,
		setStartTimeCB2:setStartTimeCB2,
		getValueCB:getValueCB,
		getCityCB:getCityCB,
	};
}());


