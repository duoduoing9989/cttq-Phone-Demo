var version = '1.0.0';
//var server = 'http://218.92.66.228';
//var server = 'http://aiqas.cttq.com';
var server = 'http://ai.cttq.com:1443';
// appID,三个环境不同
var ApplicationId = "20000062";
/* 天知道Search路径
 * dev
 * qas
 * prd
 * */
//var cttq_knows_search_path = "../aaaah10074/search.html";
//var cttq_knows_search_path = "../aaaao20074/search.html";
var cttq_knows_search_path =   "../20000074/search.html";
//alihost
var alihost = "http://upload.media.aliyun.com/api/proxy/upload";
/*
 * accessid
 * prd
 * dev,qas
 * */
var accessid = "23255733";
//var accessid = "23180619";
/*
 * accesskey
 * prd
 * dev,qas
 * */
var accesskey = "bae4d0a7acca52012069422807116473";
//var accesskey = "2e8da0ce8705494afabc2e3bd57ce5d1";
/*
 * uploadPolicy
 * prd
 * dev,qas
 * */
var uploadPolicy = {
    "namespace" : "anyinfo-its",
    //"namespace" : "my-cttq-it",
    "bucket" : null,
    "insertOnly" : 0,
    "expiration" : -1,
    "detectMime" : 1,
    "dir" : null,
    "name" : "${uuid}.${ext}",
    "sizeLimit" : null,
    "mimeLimit" : null,
    "callbackUrl" : null,
    "callbackHost" : null,
    "callbackBody" : null,
    "callbackBodyType" : null,
    "returnUrl" : null,
    "returnBody" : null
};

Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth() + 1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}

Date.prototype.addDays = function(d) {
    this.setDate(this.getDate() + d);
};

Date.prototype.addWeeks = function(w) {
    this.addDays(w * 7);
};

Date.prototype.addMonths = function(m) {
    var d = this.getDate();
    this.setMonth(this.getMonth() + m);
    if (this.getDate() < d)
        this.setDate(0);
};

Date.prototype.addYears = function(y) {
    var m = this.getMonth();
    this.setFullYear(this.getFullYear() + y);
    if (m < this.getMonth()) {
        this.setDate(0);
    }
};

function showTime(t) {
    var curTime = new Date();
    var timespan = curTime.getTime() - t.getTime();
    //相差天数
    var days = Math.floor(timespan / (24 * 3600 * 1000));
    if (days > 2) {//显示具体日期
        return t.format("yyyy/MM/dd");
    } else if (curTime.getDate() != t.getDate()) {//显示昨天
        return "昨天";
    } else {//显示具体时间
        return t.format("hh:mm");
    }
}
function showVal(val) {
    if (val != {} && val != undefined && val != null) {
        return val;
    } else {
        return "";
    }
}
var isPhone = (window.navigator.platform != "Win32"),
    isAndroid = (window.navigator.userAgent.indexOf('Android') >= 0) ? true : false;

//本地存储Key
Enum_StorageKey = {
    LoginUser : "LoginUser", //当前登录用户
};

//提醒
function openAlert(content) {
    appcan.window.alert({
        title : "系统提示",
        content : content,
        buttons : '确定',
        callback : function(err, data, dataType, optId) {
            //console.log(err, data, dataType, optId);
        }
    });
}

function openConfirm(content, cb) {
    appcan.window.alert({
        title : "系统提示",
        content : content,
        buttons : '确定',
        callback : function(err, data, dataType, optId) {
            cb();
        }
    });
}

function openToast(content, t) {
    if (t) {
        appcan.window.openToast(content, t, '5');
    } else {
        appcan.window.openToast(content, 2000, '5');
    }
}

function getStorage(key) {
    return appcan.locStorage.getVal(key);
}

function setStorage(key, value) {
    appcan.locStorage.setVal(key, value);
}

//参数key为空会清除所有存储
function removeStorage(key) {
    appcan.locStorage.remove(key);
}

function getStoredJson(key) {
    var val = appcan.locStorage.getVal(key);
    return JSON.parse(val);
}

function setStoredJson(key, data) {
    appcan.locStorage.setVal(key, JSON.stringify(data));
}

if (getStorage("IOS7fg") == 1) {
    document.getElementById('header').style.paddingTop = '20px';
}

//窗口
function openWin(name, url) {
    appcan.window.open(name, url, 10, 4);
}

function closeWin() {
    appcan.window.close(-1);
}

function evaluateScript(name, scriptContent) {
    appcan.window.evaluateScript(name, scriptContent);
}

function evaluatePopoverScript(name, popName, scriptContent) {
    appcan.window.evaluatePopoverScript(name, popName, scriptContent);
}

function initBounce(cbUp, cbDown) {
    appcan.window.setBounce({
        bounceType : [0, 1],
        color : '',
        startPullCall : function(type) {
            //do somethings
            //alert(type);
        },
        downEndCall : function(type) {
            //下拉加载
            if (type) {
                cbUp();
                appcan.window.resetBounceView(1);
            }
        },
        upEndCall : function(type) {
            //上拉刷新
            if (!type) {
                cbDown();
                appcan.window.resetBounceView(0);
            }
        }
    });

    appcan.window.setBounceParams({
        position : 0,
        data : {
            imagePath : "res://arrow.png",
            textColor : "#530606",
            pullToReloadText : "\u4e0b\u62c9\u5237\u65b0\u6570\u636e", //下拉刷新数据
            releaseToReloadText : "\u91ca\u653e\u5237\u65b0\u6570\u636e", //释放刷新数据
            loadingText : "\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u7b49"//加载中，请稍候
        }
    });
    appcan.window.setBounceParams({
        position : 1,
        data : {
            imagePath : "res://arrow.png",
            textColor : "#530606",
            pullToReloadText : "\u4e0b\u62c9\u52a0\u8f7d\u6570\u636e", //下拉加载数据
            releaseToReloadText : "\u91ca\u653e\u52a0\u8f7d\u6570\u636e", //释放加载数据
            loadingText : "\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u7b49"//加载中，请稍候
        }
    });
}

//ajax
function getJson(url, data, cb) {
    //url += '?jsoncallback=?';

    appcan.request.ajax({
        url : url,
        type : 'GET',
        data : data,
        dataType : "json",
        cache : false,
        success : function(data) {
            cb(data);
        },
        error : function(e) {
            canclick = 1;
            openAlert("请求失败");
        }
    });
}

function postJson(url, data, cb) {
    //url += '?jsoncallback=?';
    console.log(data);
    appcan.window.openToast("数据加载中，请稍候...", 0, 5);
    appcan.request.ajax({
        url : url,
        type : 'POST',
        data : data,
        dataType : "json",
        contentType : "application/json",
        cache : false,
        success : function(data) {
            appcan.window.closeToast();
            //alert(JSON.stringify(data));
            cb(data);
        },
        error : function(xhr, erroType, error, msg) {
            appcan.window.closeToast();
            canclick = 1;
            openAlert("请求失败");
            setStorage("cttq_itservice_issubmitnow", false);
            //alert("xhr:" + JSON.stringify(xhr));
            //alert("erroType:" + erroType);
            //alert("error:" + error);
            //alert("msg:" + msg);
        }
    });
}

function postJsonUseCache(url, data, cb, errcb) {
    //url += '?jsoncallback=?';
    console.log(data);
    appcan.window.openToast("数据加载中，请稍候...", 0, 5);
    appcan.request.ajax({
        url : url,
        type : 'POST',
        data : data,
        dataType : "json",
        contentType : "application/json",
        cache : false,
        success : function(data) {
            appcan.window.closeToast();
            //alert(JSON.stringify(data));
            cb(data);
        },
        error : function(xhr, erroType, error, msg) {
            appcan.window.closeToast();
            canclick = 1;
            errcb(error);
            setStorage("cttq_itservice_issubmitnow", false);
        }
    });
}

function postJsonNoToast(url, data, cb) {
    //url += '?jsoncallback=?';
    //appcan.window.openToast("处理中,请稍候", 0, 5);
    appcan.request.ajax({
        url : url,
        type : 'POST',
        data : data,
        dataType : "json",
        contentType : "application/json",
        cache : false,
        success : function(data) {
            //appcan.window.closeToast();
            //alert(JSON.stringify(data));
            cb(data);
        },
        error : function(xhr, erroType, error, msg) {
            appcan.window.closeToast();
            canclick = 1;
            openAlert("请求失败");
            setStorage("cttq_itservice_issubmitnow", false);
            //alert("xhr:" + JSON.stringify(xhr));
            //alert("erroType:" + erroType);
            //alert("error:" + error);
            //alert("msg:" + msg);
        }
    });
}

function formatDateByTimestamp(timestamp) {
    if (timestamp == null || timestamp == "" || timestamp == "null") {
        return "";
    }
    var date = new Date(timestamp);
    var now = new Date();
    if ((date.getFullYear() == now.getFullYear()) && (date.getMonth() == now.getMonth()) && (date.getDate() == now.getDate())) {
        //今天
        return timestamp.format("hh:mm");
    }
    if ((date.getFullYear() == now.getFullYear()) && (date.getMonth() == now.getMonth()) && (now.getDate() - date.getDate() == 1)) {
        //昨天
        return "昨天";
    }
    return timestamp.format("MM月dd日");
}

function formatDateByString(value) {
    if (value == null || value == "" || value == "null") {
        return "";
    }
    var date = date = new Date(Date.parse(value.replace(/-/g, "/")));
    var now = new Date();
    if ((date.getFullYear() == now.getFullYear()) && (date.getMonth() == now.getMonth()) && (date.getDate() == now.getDate())) {
        //今天
        return date.format("hh:mm");
    }
    if ((date.getFullYear() == now.getFullYear()) && (date.getMonth() == now.getMonth()) && (now.getDate() - date.getDate() == 1)) {
        //昨天
        return "昨天";
    }
    return date.format("MM月dd日");
}

function getJsonCache(url, data, cb) {
    url += '?jsoncallback=?';

    appcan.request.ajax({
        url : url,
        type : 'GET',
        data : data,
        dataType : "json",
        offline : true,
        offlineDataPath : 'wgt://tmp/',
        expires : 3600000,
        success : function(data) {
            cb(data);
        },
        error : function(e) {
            canclick = 1;
            openAlert("请求失败");
        }
    });
}

function postJsonCache(url, data, cb) {
    url += '?jsoncallback=?';

    appcan.request.ajax({
        url : url,
        type : 'POST',
        data : data,
        dataType : "json",
        offline : true,
        offlineDataPath : 'wgt://tmp/',
        expires : 3600000,
        success : function(data) {
            cb(data);
        },
        error : function(e) {
            canclick = 1;
            openAlert("请求失败");
        }
    });
}

function clearOffline(url, cb) {
    appcan.request.clearOffline(url, cb);
}

// appcan.request.clearOffline({
// url : 'http://weixin.appcan.cn:8086/test/get',
// callback : function(err, data, dataType, optId) {
// if (err) {
// //清除缓存错误
// return;
// }
// if (data == 0) {
// //清除缓存成功
// } else {
// //清除缓存失败
// }
// }
// });

function int(obj) {
    return parseInt(obj);
}

function getNo(no) {
    var todayDate = new Date();
    //var year = todayDate.getFullYear();
    //var date = todayDate.getDate();
    //var month = todayDate.getMonth() + 1;
    //var hour = todayDate.getHours();
    //var mininutes = todayDate.getMinutes();
    //var seconds = todayDate.getSeconds();
    var ran = Math.round((Math.random()) * 1000000);
    return todayDate.format("yyyyMMddhhmmssS") + ran + no;
}

function getInv(epid) {
    var result = {
        ZEPID : "",
        ZBIID : "",
        ZBINM : ""
    };

    var ZBCM_EXP_BILL = getStoredJson("cost_ZBCM_EXP_BILL");
    var ZBCM_BILLTYPE = getStoredJson("cost_ZBCM_BILLTYPE");

    $.each(ZBCM_EXP_BILL, function(n, v) {
        if (v.ZEPID == epid && v.ZMITP != "D") {
            $.each(ZBCM_BILLTYPE, function(nn, vv) {
                if (v.ZBIID == vv.ZBIID && v.ZMITP != "D") {
                    result = {
                        ZEPID : v.ZEPID,
                        ZBIID : vv.ZBIID,
                        ZBINM : vv.ZBINM
                    };
                }
            });
        }
    });

    return result;
}

function gotoTop() {
    console.log('goto top');
    document.body.scrollTop = 0;
}

/**
 * 功能日志
 * @param subModule
 */
function functionLog(subModule) {
    console.log(subModule);
    var option = {
        url : server + "/app/addAppFuncUseLog",
        data : {
            userId : appcan.locStorage.getVal("userName"),
            module : "ITService",
            subModule : subModule
        },
        successCb : function(data) {
            if ( typeof cb == 'function') {
                cb(data);
            }
        }
    };
    commonRequest(option);
}
/**
 * 通用的请求
 *
 * @param option
 */
function commonRequest(option) {
    if (option.url == "") {
        alert("url 为空");
        return;
    }
    var defaultOption = {
        type : 'POST',
        contentType : 'application/json',
        dataType : 'json',
        success : function(data, status, requestCode, response, xhr) {
            alert("default option:" + JSON.stringify({
                data : data,
                status : status,
                requestCode : requestCode,
                response : response,
                xhr : xhr
            }));
        },
        error : function(xhr, errorType, error, msg) {
        },
        complete : function(xhr, status) {
        }
    };
    option = $.extend({}, defaultOption, option);
    if ( typeof option.successCb == 'function') {
        option.success = function(data, status, requestCode, response, xhr) {
            option.successCb(data, status, requestCode, response, xhr);
        };
    }
    if ( typeof option.errorCb == 'function') {
        option.error = function(xhr, errorType, error, msg) {
            option.errorCb(xhr, errorType, error, msg);
        };
    }
    if ( typeof option.completeCb == 'function') {
        option.complete = function(xhr, status) {
            option.completeCb(xhr, status);
        };
    }
    appcan.request.ajax(option);
}
/*

 *
 * it service cache
 *
 * */

function getIndexCache(uid) {
    return JSON.parse(getStorage("cttq_itservice_indexcache_" + uid));
}

function setIndexCache(d,uid) {
    setStorage("cttq_itservice_indexcache_" + uid, JSON.stringify(d));
}

function getItemCache(qid,uid) {
    return JSON.parse(getStorage("cttq_itservice_itemcache_" + qid + "_" + uid));
}

function setItemCache(d, qid,uid) {
    setStorage("cttq_itservice_itemcache_" + qid + "_" + uid, JSON.stringify(d));
}
