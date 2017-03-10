/*------------------------------------------------------------
// Copyright (C) 2015 正大天晴药业集团股份有限公司  版权所有。
// 文件名：cttqAI.js
// 文件功能描述：cttq公共js文件
// 创 建 人：贾韦韦
// 创建日期：2016/03/02
// 修 改 人：
// 修改日期：
// 修改描述：
//-----------------------------------------------------------*/
/**
 * 格式化返回数据
 */
function cttqAI_CheckNoChar( returnObj ){
    return ((typeof returnObj) == 'object' || (typeof returnObj) == 'undefined' || returnObj == 'undefined' || returnObj == '[object Object]')?'':returnObj;
}
/**
 * 滚动设置
*/
function cttqAI_SetScroll(scrollTag){
    if( scrollTag == false ){
        $("body").bind("touchmove",function(e){
                e.preventDefault();
                e.stopPropagation();
        },false);
    }else{
        $("body").unbind("touchmove");
    }
}
/**
 * 防止冒泡事件
 * @param e
 */
function cttqAI_StopPropagation(e) {
    if (e.stopPropagation)
        e.stopPropagation();
    else
        e.cancelBubble = true;
}
/**
 * 流水号
 * @param e
 */
function cttqAI_GetSerialNum(no) {
    var todayDate = new Date();
    var ran = Math.round((Math.random()) * 1000000);
    var serialNum = ''+nowTime.getTime()+''+ran+''+no+'';
    return serialNum;
}
/**
 * 流水号的存储、唯一性
 * @param e
 */
function cttqAI_SoleSerialNum(){
    var serialNum = Utils.cache.get('serialNum');
    if( serialNum == undefined || serialNum == null || serialNum == "" ){
        serialNum = cttqAI_GetSerialNum(Utils.cache.get('WorkCode'));
    }
    Utils.cache.set("serialNum", serialNum);
    return serialNum;
}
/**
 * 根据方法名获取入参
 * @param fn
 */
function getParameterNames( fn ){
    // console.log(fn);
    if(typeof fn !== 'function') return [];
    var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    var code = fn.toString().replace(COMMENTS, '');
    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? [] : result;
}
/**
 * 将Unix时间戳格式化成 json格式时间
 * @param time Unix时间戳，单位ms
 * @returns json{}
 */
function cttqAI_FormatUnix( time ) {
    var date         = new Date(parseInt(time));
    var year         = date.getFullYear();
    var month        = (date.getMonth() + 101 + '').substr(1);
    var day          = (date.getDate() + 100 + '').substr(1);
    var hour         = (date.getHours() + 100 + '').substr(1);
    var minute       = (date.getMinutes() + 100 + '').substr(1);
    var seconds      = (date.getSeconds() + 100 + '').substr(1);
    var milliseconds = (date.getMilliseconds() + '').substr(0);
    var timeJson     = {
        "year": ''+year+'',
        "month": month,
        "day": day,
        "hour": hour,
        "minute": minute,
        "seconds": seconds,
        "milliseconds": milliseconds
    }
    return timeJson;
}
/**
 * 将yyyy,mm,dd,hh,mm,ss,mms格式化成Unix时间戳，ms为单位
 * @param string yyyy,mm,dd,hh,mm,ss,mms 格式的字符串
 * @returns {number}
 */
function cttqAI_GetToUnix(year,month,day,hours,minutes,seconds,milliseconds) {
    milliseconds = milliseconds ? milliseconds : 000;
    seconds      = seconds ? seconds : 00;
    minutes      = minutes ? minutes : 00;
    hours        = hours ? hours : 00;
    // if( !day ){
    //     return '请传入正确日期';
    // }
    // if( !month ){
    //     return '请传入正确日期';
    // }
    // if( !year ){
    //     return '请传入正确日期';
    // }
    var timeNum = new Date(year,month,day,hours,minutes,seconds,milliseconds);
    return timeNum.getTime();
}
/**
 * 遮罩层
 */
function cttqAI_Backdrop_Hide(){
    $(".cttqAI_backdropBg").remove();
    $("body").css("overflow", "auto");
}
function cttqAI_Backdrop_Show( num, num1, text, color ){
    if( !$(".cttqAI_backdropBg").exist() ){
        $("body").append('<div class="cttqAI_backdropBg ub ub-ver ub-ac ub-pc"></div>');
        $("body").css("overflow", "hidden");
        $(".cttqAI_backdropBg").css("background-color",'rgba(0,0,0,'+num+')');
        if( num1 != undefined && text != undefined && color != undefined ){
            cttqAI_Animation(num1, text, color);
        }
    }
}
/**
 * 加载动画
 */
function cttqAI_Animation(num1, text, color){
    var str = '<div class="ub ub-ver ub-ac ub-pc loader" style="background-color: rgba(0,0,0,'+num1+');">'
                +'<div class="ub loader-inner line-scale-pulse-out ">'
                    +'<div></div>'
                    +'<div></div>'
                    +'<div></div>'
                    +'<div></div>'
                    +'<div></div>'
                +'</div>'
               +'<div class="promptText ub ub-ac ub-pc" style="color: '+color+';">'+text+'...</div>'
            +'</div>';
    $(".cttqAI_backdropBg").append(str);
}
/**
 * 弹出选择项
 */
function cttqAI_SelectInit(option, cb) {
    var str = '<div class="ub ub-ver cttqAI_SelectBox">'
                +'<div class="ub ub-ac ub-pc bg-f choice-ft choice-ph choice-ubb">'+option.title+'</div>'
                +'<div class="ub bg-f menuBox">'
                    +'<ul class="ub ub-ver ub-f1 select_inner ai-mal choie-h cttqAI_Select">'
                        for (i = 0; i < option.listContent.length; i++) {
                            str += '<li rel="1" class="ub ub-ac choice-bc choice choice-ubb" data-type="'+i+'" data-text='+option.listContent[i]+'>'
                                        +'<div class="ub ub-ac ub-pc choice-patb choice-ph ub-f1">'+option.listContent[i]+'</div>'
                                    +'</li>'
                        }
                    str += '</ul>'
                +'</div>'
                +'<div class="ub ub-pc bg-f ulev1 cancelB owTouchAct closeSelect">取消</div>'
            +'</div>'
    $(document.body).append(str);
    cttqAI_Backdrop_Show(0.54);
    $(".cttqAI_backdropBg").bind('click', function(){
        cttqAI_Backdrop_Hide();
        $(".cttqAI_SelectBox").remove();
    });
    $(".closeSelect").on('click', function(){
        cttqAI_Backdrop_Hide();
        $(".cttqAI_SelectBox").remove();
    });
    var LiH = $(".cttqAI_Select li").height();
    if( $(".cttqAI_Select li").length > option.listnum ){
        $(".cttqAI_Select").height((Number(option.listnum) + Number(0.5)) * LiH);
    }else{
        $(".cttqAI_Select").height(Number($(".cttqAI_Select li").length) * LiH);
        $(".cttqAI_Select").css("overflow","hidden");
    }
    $(".cttqAI_Select li").on('click', function(){
        var optData = {
            "type": $(this).data("type"),
            "text": $(this).data("text")
        }
        cb(optData);
        cttqAI_Backdrop_Hide();
        $(".cttqAI_SelectBox").remove();
    });
    if( option.currentType != '' ){
        $(".cttqAI_Select li").each(function () {
            if ($(this).data('type') == option.currentType) {
                $(this).append('<div class="ub-img yesTick"></div>');
                var typeNum = option.currentType.substring(Number(option.currentType.length - 1),option.currentType.length);
                var number = $(this).parent("ul").children().length;
                if( typeNum == 0 || typeNum == 1 || typeNum == 2 ){
                }else if( typeNum == number - 1 || typeNum == number - 2 || typeNum == number - 3 ){
                    $(this).parent('ul').scrollTop($(this).height() * number);
                }else{
                    $(this).parent('ul').scrollTop($(this).height() * Number(typeNum - 1.5));
                }
            }
        });
    }
}
/**
 * 防止重复点击
 */
var clickVal = {};
function restoreClick(own, name){
    $(own).attr("onclick", clickVal[name]);
}
function deleteClick(own, name){
    if( $(own).attr("onclick") != undefined ){
        clickVal[name] = $(own).attr("onclick");
    }
    $(own).removeAttr("onclick");
}
/**
 * 判断节点是否存在
 */
$.fn.exist = function(){ 
    if($(this).length>=1){
        return true;
    }
    return false;
};
/**
 * 统一网络请求POST
 * paramJSon：接口入参
 * paramURL: 接口地址 
 * paramtTimeOut：接口超时时间
 * cb：回调函数
 * paramWayName：当前方法名
 * paramWayJson：当前方法入参json格式  {type:***}
 */
function ajaxPost(paramJSON, paramURL, paramtTimeOut, cb, paramWayName, paramWayJson){
    $.ajax({ type: 'POST', contentType: 'application/json', dataType: 'json',
        url: paramURL,
        data: JSON.stringify(paramJSON),
        timeout: paramtTimeOut,
        success: function(data, status, xhr) {
            if( cb ){
                // 获取项目根目录以判断是否是待办项目
                var strFullPath = window.document.location.href;  
                var strPath = window.document.location.pathname;  
                var pos = strFullPath.indexOf(strPath);  
                var prePath = strFullPath.substring(0,pos);  
                var postPath = strPath.substring(0,strPath.substr(1).indexOf('/')+1);  
                var basePath = prePath;  
                basePath = prePath + postPath;
                if( basePath.indexOf('app_NTBDealtWith') > 0 ){
                    //停机公告
                    if( data.status && data.status == -9999 ){
                        Utils.cache.set("downtimeNoticeData", data.data);
                        window.parent.location.href = "../downtimeNotice/downtimeNotice.html"+"?action=nextPage";
                        return;
                    }
                }else{
                    //停机公告
                    if( data.status && data.status == -9999 ){
                        Utils.cache.set("downtimeNoticeData", data.data);
                        console.log("停机：", data.data);
                        Utils.nav.next("downtimeNotice.html");
                        return;
                    }
                }
                cb(data);
            }
            // setTimeout(function(){
            //     if( $(".mui-toast-outerBox").exist() ){
            //         $.zloading("hide");
            //     }
            // }, 500);
        },
        error: function(xhr, errorType, error) {
            console.log("接口error信息：", errorType, "接口地址："+paramURL+"", "重试方法名："+paramWayName+"", "重试方法入参："+paramWayJson+"");
            var unKnown = {
                "abnormalUnknownText": "可能遇到了其他未知的问题，请稍后重试或拨打400-182-0660获取技术支持！",
                "function": paramWayName,
                "portUrl": paramURL,
                "paramWayJson": paramWayJson ? paramWayJson : undefined
            }
            if( errorType == "timeout" ){
                // 超时
                unKnown.abnormalUnknownText = "您的请求已超时，可能是网络问题，请稍后重试！";
            }
            Utils.cache.set("unKnown", unKnown);
            setTimeout(function(){
                if( $(".mui-toast-outerBox").exist() ){
                    $.zloading("hide");
                }
                Utils.nav.next('abnormalUnknown.html');
            }, 500);
        }
    });
}
/**
 * 统一网络请求错误函数
 */
function ajaxWrong(message, paramURL, paramWayName, paramWayJson){
    $.zloading("hide");
    var unKnown = {
        "abnormalUnknownText": message,
        "function": paramWayName,
        "portUrl": paramURL,
        "paramWayJson": paramWayJson ? paramWayJson : undefined
    }
    Utils.cache.set("unKnown", unKnown);
    console.log("报错信息：", unKnown);
    setTimeout(function(){
        Utils.nav.next('abnormalUnknown.html');
    }, 500);
}
/**
 * 文字超出省略号
 */
jQuery.fn.limit=function(){
    //这里的div去掉的话，就可以运用li和其他元素上了，否则就只能div使用。
    var self = $(this).find("[limit]");
      self.each(function(){
           var objString = $(this).text();
           var objLength = $(this).text().length;
           var num = $(this).attr("limit");
           $(this).attr("title",objString);
           if(objLength > num){
            //这里可以设置鼠标移动上去后显示标题全文的title属性，可去掉。
            objString = $(this).text(objString.substring(0,num) + "...");
           }
      })
}
$(document.body).limit();
/*
用途：检查输入字符串是否符合金额格式,格式定义为正整数或者是两位正小数
输入：s：字符串
返回：如果通过验证返回true,否则返回false
*/
function isMoney(s){
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if (s.search(re) != - 1) {
        if( s.length > 11 ){
            return false;
        }else{
            return true;
        }
    }
    else {
        var regu1 = "^[0-9]+[\.][0-9]{0,2}$";
        var re1 = new RegExp(regu1);
        if (re1.test(s)) {
            if( s.length > 13 ){
                return false;
            }else{
                return true;
            }
        }
        else {
            return false;
        }
    }
}
function isMoney1(s){
    var regu = "^[0-9]+$";
    var re = new RegExp(regu);
    if (s.search(re) != - 1) {
        if( s.length > 11 ){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
/**
 * js精确计算
 */
// 加法
function accAdd(arg1,arg2){
    var r1,r2,m;
    try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
    try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
    m = Math.pow(10,Math.max(r1,r2));
    return (accMul(arg1,m)+accMul(arg2,m))/m;
}
// 减法
function accSub(arg1,arg2){
     var r1,r2,m,n;
     try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
     try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
     m=Math.pow(10,Math.max(r1,r2));
     //last modify by deeka
     //动态控制精度长度
     n=(r1>=r2)?r1:r2;
     return ((arg2*m-arg1*m)/m).toFixed(n);
}
// 乘法
function accMul(arg1,arg2){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
}
// 除法
function accDiv(arg1,arg2){
    var t1=0,t2=0,r1,r2;
    try{t1=arg1.toString().split(".")[1].length}catch(e){}
    try{t2=arg2.toString().split(".")[1].length}catch(e){}
    with(Math){
        r1=Number(arg1.toString().replace(".",""));
        r2=Number(arg2.toString().replace(".",""));
        return (r1/r2)*pow(10,t2-t1);
    }
}
/**
 * 数字补零
 */
function fillZero(num){
    var zero = "";
    if( num.length != 8 ){
        for( i=1; i <=( 8 - num.length ); i++ ){
            zero = ''+zero+'0';
        }
        num = ''+zero+''+num+'';
    }
    return num;
}
function ridZero(num){
    if( num.length == 8 ){
        num = num.substring(1,8);
    }
    return num;
}
/**
 * 数字去零
 */
function quZero(num){
    return num.replace(/\b(0+)/gi,"");
}
/**
 * 将千分位格式的数字字符串转换为浮点数
 * @public
 * @param string sVal 数值字符串
 * @return float
 */
function unformatMoney(sVal){
    var fTmp = parseFloat(sVal.replace(/,/g, ''));
    return (isNaN(fTmp) ? 0 : fTmp);
}
function GetDay(startDate,endDate){
    var arrDate, objDate1, objDate2, intDays;
    objDate1 = new Date();
    objDate2 = new Date();

    arrDate = startDate.split("-");
    objDate1.setFullYear(arrDate[0], arrDate[1], arrDate[2]);

    arrDate = endDate.split("-");
    objDate2.setFullYear(arrDate[0], arrDate[1], arrDate[2]);

    intDays = parseInt(Math.abs(objDate1 - objDate2) / 1000 / 60 / 60 / 24);
    return intDays;
} 
/**
 * 返回农历
 */
function cttqAI_GetCalendarLunar( year, month, day ){
    month = Number(month + 1);
    var LunarCalendarJson = calendar.solar2lunar(year,month,day);
    var LunarCalendar = {
        "class": 'festivalColor',
        "text": ''
    };
    /**
     * 优先显示农历节日
    */
    // if( LunarCalendarJson.IMonthCn == '腊月' && LunarCalendarJson.IDayCn == '三十' ){
    //     LunarCalendar.text = '除夕';
    //     return LunarCalendar;
    // }
    if( LunarCalendarJson.IMonthCn == '正月' && LunarCalendarJson.IDayCn == '初一' ){
        LunarCalendar.text = '春节';
        LunarCalendar.text = '春节';
        return LunarCalendar;
    }
    // if( LunarCalendarJson.IMonthCn == '正月' && LunarCalendarJson.IDayCn == '十五' ){
    //     LunarCalendar.text = '元宵节';
    //     return LunarCalendar;
    // }
    if( LunarCalendarJson.IMonthCn == '五月' && LunarCalendarJson.IDayCn == '初五' ){
        LunarCalendar.text = '端午';
        return LunarCalendar;
    }
    // if( LunarCalendarJson.IMonthCn == '七月' && LunarCalendarJson.IDayCn == '初七' ){
    //     LunarCalendar.text = '七夕节';
    //     return LunarCalendar;
    // }
    if( LunarCalendarJson.IMonthCn == '八月' && LunarCalendarJson.IDayCn == '十五' ){
        LunarCalendar.text = '中秋';
        return LunarCalendar;
    }
    // if( LunarCalendarJson.IMonthCn == '九月' && LunarCalendarJson.IDayCn == '初九' ){
    //     LunarCalendar.text = '重阳节';
    //     return LunarCalendar;
    // }
    // if( LunarCalendarJson.IMonthCn == '腊月' && LunarCalendarJson.IDayCn == '初八' ){
    //     LunarCalendar.text = '腊八节';
    //     return LunarCalendar;
    // }
    /**
     * 其次显示阳历节日
    */
    if( month == 1 && day == 1 ){
        LunarCalendar.text = '元旦';
        return LunarCalendar;
    }
    // if( month == 2 && day == 14 ){
    //     LunarCalendar.text = '情人节';
    //     return LunarCalendar;
    // }
    // if( month == 3 && day == 8 ){
    //     LunarCalendar.text = '妇女节';
    //     return LunarCalendar;
    // }
    // if( month == 3 && day == 15 ){
    //     LunarCalendar.text = '消费者';
    //     return LunarCalendar;
    // }
    if( month == 5 && day == 1 ){
        LunarCalendar.text = '劳动';
        return LunarCalendar;
    }
    // if( month == 6 && day == 1 ){
    //     LunarCalendar.text = '儿童节';
    //     return LunarCalendar;
    // }
    // if( month == 7 && day == 1 ){
    //     LunarCalendar.text = '建党节';
    //     return LunarCalendar;
    // }
    // if( month == 8 && day == 1 ){
    //     LunarCalendar.text = '建军节';
    //     return LunarCalendar;
    // }
    // if( month == 9 && day == 10 ){
    //     LunarCalendar.text = '教师节';
    //     return LunarCalendar;
    // }
    if( month == 10 && day == 1 ){
        LunarCalendar.text = '国庆';
        return LunarCalendar;
    }
    // if( month == 10 && day == 31 ){
    //     LunarCalendar.text = '万圣节';
    //     return LunarCalendar;
    // }
    // if( month == 11 && day == 11 ){
    //     LunarCalendar.text = '光棍节';
    //     return LunarCalendar;
    // }
    // if( month == 12 && day == 24 ){
    //     LunarCalendar.text = '平安夜';
    //     return LunarCalendar;
    // }
    // if( month == 12 && day == 25 ){
    //     LunarCalendar.text = '圣诞节';
    //     return LunarCalendar;
    // }
    /**
     * 最后显示农历、节气
    */
    if( LunarCalendarJson.Term == null ){
        LunarCalendar.class = '';
        LunarCalendar.text = cttqAI_CheckNoChar(LunarCalendarJson.IDayCn == '初一' ? LunarCalendarJson.IMonthCn : LunarCalendarJson.IDayCn);
        return LunarCalendar;
    }else{
        if( LunarCalendarJson.Term == '清明' ){
            LunarCalendar.text = '清明';
            return LunarCalendar;
        }
        else{
            LunarCalendar.class = '';
            LunarCalendar.text = cttqAI_CheckNoChar(LunarCalendarJson.Term);
            return LunarCalendar;
        }
    }
}
// 判断数据类型
var getTypeOf = Object.prototype.toString;
/**
 * 添加动画
 */
var testAnim = function(object, animated, x, cb){
    if( animated == "" ){
        animated = "animated"
    }
    $(object).addClass(x + ' '+ animated).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
        if( cb ){cb(object, animated, x);};
    });
};