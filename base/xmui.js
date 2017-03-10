/**
 * mui功能增强和封装
 * zhaohuihua, 2016-11-08
 */




/**
 * 正在加载提示框
 * 依赖样式mui.css, common.css
 * $.zloading("show"); // 显示正在加载
 * $.zloading("hide"); // 关闭正在加载
 * $.zloading("正在提交，请稍候...");
 * $.zloading(options);
	options = {
		show: true, // 显示
		hide: true, // 隐藏
		text: "", // 提示文字
		icon: "", // 图标的内容
		cls: { // 自定义样式名
			panel:"", // panel的样式名
			icon:"", // 图标的样式名
			text:"" // 提示文字的样式名
		}
	}
 */
+function($) {
	"use strict"
	$.zloading = function(options) {
		var container = document.body;
		if ($.isPlainObject(options) && options.container) {
			container = options.container;
			delete options.container;
		}
		$(container).zloading(options);
	};
	$.bloading = function(options) {
		return '<div class="line-scale-pulse-out '+options+'"><i></i><i></i><i></i><i></i><i></i></div>'
	};
}(jQuery);
+function($) {
	"use strict"

	var API_KEY = 'zloading';
	var CLASS_NAME = 'line-loading';
	var CLASS_HIDE = 'hide';
	$.fn.zloading = function(options) {
		if (options === 'api') {
			return this.data(API_KEY);
		} else if (typeof(options) == 'string' && Loading.prototype[options]) {
			var api = this.data(API_KEY);
			if (!api) { $(this).data(API_KEY, api = new Loading(this)); }
			return api[options].apply(api, Array.prototype.splice.call(arguments, 1));
		}

		if (options == undefined) { options = { show:true }; }
		else if (typeof(options) == 'string') { options = { text:options, show:true }; }

		return this.each(function() {
			var api = $(this).data(API_KEY);
			if (api) {
				api.refresh(options);
			} else {
				$(this).data(API_KEY, new Loading(this, options));
			}
		});
	};
	
	$.fn.zloading.defaults = {
		options: {
			// show: true,
			// hide: true,
			text: "正在加载，请稍候...", // 提示文字
			icon: "<i></i><i></i><i></i><i></i><i></i>",
			cls: { // 自定义样式名
				panel:"line-loading",
				text:"",
				icon:"line-scale-pulse-out"
			}
		},
		template:
			'<div class="mui-toast-outerBox ' +CLASS_HIDE+ '">' +
				'<div class="mui-toast-container mui-active {cls.panel}">' +
				'	<div class="mui-toast-message">' +
				'		<div class="icon {cls.icon}">' +
				'			{icon}' +
				'		</div>' +
				'		<div class="text {cls.text}">' +
				'			{text}' +
				'		</div>' +
				'	</div>' +
				'</div>' +
			'</div>'
	};

	// 构造函数
	var Loading = function(element, options) {
		this.template = $.fn.zloading.defaults.template;
		this.$element = $(element);
	    this.options = $.fn.zloading.defaults.options;
	    this.init();
	    this.refresh(options);
	};
	// 初始化
	Loading.prototype.init = function() {
		this.$element.find(CLASS_NAME).remove();
		var tpl = $.zhh.format(this.template, this.options);
		var $panel = $(tpl).appendTo(this.$element);
		this.$panel = $panel;
	};
	// 面板
	Loading.prototype.panel = function() {
		return this.$panel;
	};
	// 显示
	Loading.prototype.show = function() {
	    var e = $.Event('show.zloading');
	    this.$panel.trigger(e);
	    if (e.isDefaultPrevented()) { return; }
	    this.$panel.removeClass(CLASS_HIDE);
	};
	// 隐藏
	Loading.prototype.hide = function() {
	    var e = $.Event('hide.zloading');
	    this.$panel.trigger(e);
	    if (e.isDefaultPrevented()) { return; }
		this.$panel.addClass(CLASS_HIDE);
	};
	// 刷新
	Loading.prototype.refresh = function(options) {
		if (options && typeof(options) == 'string') { options = { text:options }; }
		if (!$.isPlainObject(options)) { return; }

		var $panel = $(this.panel);
		switchInnerHtml($panel.find(".text"), this.options, options, "text");
		switchInnerHtml($panel.find(".icon"), this.options, options, "icon");
		if (options.cls) {
			switchClassName($panel, this.options.cls, options.cls, "panel");
			switchClassName($panel.find(".text"), this.options.cls, options.cls, "text");
			switchClassName($panel.find(".icon"), this.options.cls, options.cls, "icon");
		}
		if (options.show == true) {
			this.show();
		} else if (options.hide == true) {
			this.hide();
		}
	};
	var switchInnerHtml = function($elem, older, newer, field) {
		if (older[field] != newer[field]) {
			$elem.html(newer[field]);
			older[field] = newer[field];
		}
	};
	var switchClassName = function($elem, older, newer, field) {
		if (older[field] != newer[field]) {
			if (older[field]) { $elem.removeClass(older[field]); }
			if (newer[field]) { $elem.addClass(newer[field]); }
			older[field] = newer[field];
		}
	};

}(window.jQuery);
var zloading = function(options){
    $.zloading(options);
};





/**
 * 下拉刷新, 下拉加载
 * 
 * @param $
 * @param mui
 */
+function($, mui) {
	"use strict"

	/** 加载数据 **/
	var loadData = function(refresh, fn) {
		var api = this;
		var o = api.options;
		var listSelector = o.listSelector;
		if ($.isFunction(o.listSelector)) {
			listSelector = o.listSelector.call(api.element, o);
		}
		var table = $(api.element).find(listSelector);
		o.page = refresh ? 1 : (o.page || 0) * 1 + 1;
		table.children('.load-error').remove();
		var ajax = o.ajax;
		if ($.isFunction(o.ajax)) {
			ajax = o.ajax.call(api.element, o);
		}
		var paging = o.paging == "auto" ? false : o.paging; // auto:如果没有{options:page}这个占位符, 则不分页
		var params = $.extend(true, {}, ajax.data);
		// 替换占位符, 如  { pageNumber:'{options:page}', pageSize:'{options:limit}' }
		if( Utils.cache.get('initStartPage') == 'true' ){
			params.input.startPage = 1;
		}
		Utils.cache.del('initStartPage');
		var handleInnerPlaceholder = function(params) {
			if ($.isPlainObject(params)) {
				for (var key in params) {
					var value = params[key];
					if ($.isPlainObject(value) || $.isArray(value)) {
						handleInnerPlaceholder(value);
					} else {
						var m = /^\s*\{\s*options\s*\:\s*(\w+)\s*\}\s*$/.exec(value);
						if (!m) { continue; }
						var field = m[1];
						var ov = $.zhh.field(o, field);
						if (ov != undefined) {
							params[key] = ov;
						}
						if (o.paging == "auto" && field == "page") {
							paging = true;
						}
					}
				}
			} else if ($.isArray(params)) {
				for (var i = 0; i < params.length; i++) {
					handleInnerPlaceholder(params[i]);
				}
			}
		};
		handleInnerPlaceholder(params);

		var template = o.template;
		if ($.isFunction(o.template)) {
			template = o.template.call(api.element, o);
		}
		var options = $.extend(true, {}, ajax, {
			succ: function(json) {
				o.ajax.result = json;
				$.isFunction(o.callback.before) && o.callback.before.call(api.element, { options:api.options }, json);
				var listField = o.listField;
				if ($.isFunction(o.listField)) {
					listField = o.listField.call(api.element, o);
				}
				var list = Utils.getArray($.zhh.field(json, listField));
				if (refresh) { table.empty(); }
				var finished = !paging || list.length < o.limit;
				var empty = o.page == 1 && list.length == 0;
				if (list.length && template.list) {
					// 根据模板格式将数据加载到列表
					var temp = [];
					temp.json = json; // 模板的this.json指向json数据
					// 复制数组
					$.each(list, function(i, v) {
						temp.push(v);
					});
					var html = Utils.baidu.template(template.list, temp);
					table.append(html).zinit();
				} else if (empty && template.empty) {
					// 第1页, 无结果
					var html = Utils.baidu.template(template.empty);
					table.append(html).zinit();
				}
				var event = { succ:true, paging:paging, reload:o.page == 1, refresh:refresh, finished:finished, empty:empty, options:api.options };
				$.isFunction(o.callback.after) && o.callback.after.call(api.element, event, json);
				$.isFunction(fn) && fn.call(api, event);
			},
			fail: function(json) {
				var event = { succ:false, paging:paging, reload:o.page == 1, refresh:refresh, options:api.options };
				if (event.reload) { table.empty(); }
				$.isFunction(o.callback.after) && o.callback.after.call(api.element, event, json);
				$.isFunction(fn) && fn.call(api, event);
			}
		});
		delete options.url;
		delete options.data;
		$.zajax(ajax.url, params, options);
	};
	var pullDownRefresh = function() {
		loadData.call(this, true, function(e) {
			this.endPulldownToRefresh();
			if (e.finished) {
				if (!e.paging || e.empty && this.options.template.empty) {
					this.bottomCaption.innerHTML = '';
				} else {
					this.bottomCaption.innerHTML = this.options.up.contentnomore;
				}
			} else {
				this.enablePullupToRefresh();
				this.finished = false;
			}
		});
	};
	var pullUpRefresh = function() {
		loadData.call(this, false, function(e) {
			if (!e.paging || e.empty && this.options.template.empty) {
				var old = this.options.up.contentnomore;
				this.options.up.contentnomore = '';
				this.endPullupToRefresh(e.finished);
				this.options.up.contentnomore = old;
			} else {
				this.endPullupToRefresh(e.finished);
			}
		});
	};
	$.fn.pullRefresh = function(options) {
		if (options === undefined) {
			return mui(this[0]).pullRefresh();
		} else {
			var fns = { down:{callback:pullDownRefresh}, up:{callback:pullUpRefresh} };
			return this.each(function() {
				var o = $.extend(true, {}, $.fn.pullRefresh.defaults, options, fns);
				if (!o.template) { o.template = {}; }
				else if ($.dt.isString(o.template)) { o.template = {list:o.template}; }
				if (!o.callback) { o.callback = {}; }
				else if (!$.isPlainObject(o.callback)) { o.callback = {after:o.callback}; }
				var api = mui(this).pullRefresh(o);
				api.options.up.auto = false;
			});
		}
	};
	// listField, listSelector, template, ajax支持function
	$.fn.pullRefresh.defaults = {
		scrollY: true,
		scrollX: false,
		indicators: true,
		deceleration: 0.003,
		up: {
			height: 50,
			auto: true,
			contentinit: '上拉显示更多',
			contentdown: '上拉显示更多',
			contentrefresh: '正在加载...',
			contentnomore: '没有更多数据了',
			duration: 300
		},
		down: {
			height: 50,
			contentinit: '下拉可以刷新',
			contentdown: '下拉可以刷新',
			contentover: '释放立即刷新',
			contentrefresh: '正在刷新...'
		},

		// callback: function|json, // 数据加载后的回调函数, json={before:function,after:function}
		// listField: string, // ajax返回数据的列表字段
		// listSelector: string, // 数据列表的选择符
		paging: "auto", // 是否分页, true|false|auto, auto根据请求参数中的占位符判断
		// page: 0, // 当前页数, 会自动递增
		limit: 10, // 每页行数
		// template: string|json, // 模板名称, json={list:string,empty:string}
		ajax: { // 见$.zajax
			// url:string,
			// data:json
		}
	};
}(window.jQuery, window.mui);
