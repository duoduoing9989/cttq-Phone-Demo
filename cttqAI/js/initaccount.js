var myaccount="";

function initaccount(account){
	myaccount=account;
	setLocVal("userName",myaccount);
	
}


function setLocVal(key,value){
	window.localStorage[key]=value;
}

function getLocVal(key){
	return window.localStorage[key];
}

function loading_state(content,action){
	var paramJson={
		content:content,
		action:action
	}
	MicroApp().showhud(paramJson);
	
}
    	
function tips_state(title,content,yes_action,no_action){
	var paramJson={
		title:title,
		content:content,
		yes_action:yes_action,
		no_ation:no_action
	}
	
	MicroApp().pagetips(paramJson);
}

//兼容火狐、IE8   
//显示遮罩层    
function showMask(){
    $("#mask").css("height",$(document).height());     
    $("#mask").css("width",$(document).width());     
    $("#mask").show();   
}  
//隐藏遮罩层  
function hideMask(){
    $("#mask").hide();     
}  