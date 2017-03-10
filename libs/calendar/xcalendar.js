
/*------------------------------------------------------------
 // Copyright (C) 2015 正大天晴药业集团股份有限公司  版权所有。
 // 文件名：xcalendar.js
 // 文件功能描述：日历插件
 //
 // 创 建 人：贾韦韦
 // 创建日期：16/12/06
 //
 // 修 改 人：赵卉华
 // 修改描述：2016-11-01 去appcan, 模块化, 浮窗调用, 简化调用方式
 // 修改描述：2016-11-02 逻辑全面优化, 原先的逻辑只剩html模板和农历, 其他全改掉了
 //-----------------------------------------------------------*/

+function($) {
	"use strict"
	// options = { range:true, beginDate:-7, endDate:+7, minDate:-60, maxDate:+60, callback:callback, bindEvent:{ click:"tap" } }
	$.xcalendar = function(options) {
		var $container = $(options.container || document.body);
		var $wrapper = $container.find(".xcalendar-wrapper");
		if ($wrapper.length == 0) {
			$wrapper = $(o.template).appendTo($container);
			var height = $container.height();
			if ($container.get(0) == document.body) { 
				height = window.screen.availHeight;
				$wrapper.css({ height:height, bottom:'auto' });
			}
			$wrapper.find(".xcalendar-container").css({ height:height * 0.8, bottom:-height * 0.8  });
			var bindEvent = $.extend(true, {}, $.fn.xcalendar.options.bindEvent, options.bindEvent);
			if (bindEvent.click) {
				$wrapper.on(bindEvent.click + ".xcalendar", ".xcalendar-shadow", function() {
					$wrapper.find(".xcalendar-container").xcalendar('callback', true);
				});
			}
		}
		var callback = options.callback;
		options.callback = function(e) {
			if (e.changed || e.cancel) {
				$wrapper.removeClass("show");
				// 等动画效果结束后隐藏掉
				setTimeout(function() { $wrapper.hide(); }, 500);
			}
			$.isFunction(callback) && callback(e);
		};
		$wrapper.show().find(".xcalendar-container").xcalendar(options);
		setTimeout(function() { $wrapper.addClass("show"); }, 0);
	};
	var o = $.xcalendar.defaults = {
		template:'<div class="xcalendar-wrapper"><div class="xcalendar-shadow"></div><div class="xcalendar-container"></div></div>'
	};
}(jQuery);

+function($) {
	"use strict"

	var API_KEY = 'xcalendar';
	$.fn.xcalendar = function(options) {
		if (options === 'api') {
			return this.data(API_KEY);
		} else if (typeof(options) == 'string') {
			var api = this.data(API_KEY);
			if (!api) { throw Error("xcalendar not yet initialized!"); }
			if (!api[options]) { throw Error("xcalendar method '" + options + "' not found!"); }
			return api[options].apply(api, Array.prototype.splice.call(arguments, 1));
		} else {
			return this.each(function() {
				var api = $(this).data(API_KEY);
				if (api) {
					api.refresh(options);
				} else {
					$(this).data(API_KEY, new Calendars(this, options));
				}
			});
		}
	};
	$.fn.xcalendar.options = {
		range: false,
		bindEvent:{ click:"click", scroll:"scroll" }
	};
	/**
	 *	构造函数
	 * 	element = 日历渲染到哪个DOM节点
	 *	options = {
	 *		range:boolean, // 是否允许选择日期范围(如果=false,只能选择一个日期;如果=true,则允许选择开始和结束日期)
	 *		minDate:%date%, // 允许选择的最小日期
	 *		maxDate:%date%, // 允许选择的最大日期
	 *		beginDate:%date%, // 初始打开时选中的开始日期
	 *		endDate:%date%, // 初始打开时选中的结束日期, 如果range=false, 该参数无效
	 *		callback:function(e) // 回调函数, e={ cancel:boolean, changed:boolean, beginDate:Date, endDate:Date }, 如果range=false, 则beginDate和endDate的日期部分相同
	 *	}
	 *	%date%=int|string|Date, int=根据当前日期计算的相对天数(+30/-30), string="-3d"/"-2m"/"+1y"之类的相对日期
	 *	例如: options = { range:true, beginDate:-7, endDate:+7, minDate:-60, maxDate:+60, callback:callback }
	 */
	var Calendars = function(element, options) {
		this.element = element;
		var bindEvent = $.extend(true, {}, $.fn.xcalendar.options.bindEvent, options.bindEvent);
	    this.bind(bindEvent);
	    this.refresh(options);
	};

	var MONTH_TEXTS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

	// 日历刷新
	Calendars.prototype.refresh = function(options) { // 这里的options.bindEvent不会生效
		this.options = $.extend(true, {}, $.fn.xcalendar.options, options);
		var today = new Date();
		checkOptions(this.options, today);
		// { date:Date, selected:{ begin:date, end:date }, original:{ begin:date, end:date }, drawing:boolean, drawed:{min:yyyymm, max:yyyymm}, ... }
	    this.vars = { date: today };
	    this.vars.original = { begin:this.options.beginDate, end:this.options.endDate };
	    this.vars.selected = { begin:this.options.beginDate, end:this.options.endDate };
		var $elem = $(this.element);
		var $panel = this.panel().empty();
		// 渲染未来的几个月
		do {
			var $calendar = this.draw(this.calcClosestYyyyMm(1));
			if (!$calendar || !$calendar.length) { break; }
		} while($panel.height() <= $elem.height());
		// 渲染之前的一个月
		this.draw(this.calcClosestYyyyMm(-1));
		// 滚动条滚动到合适的位置
		this.scrollTo(this.calcClosestYyyyMm());
		// 初始选中
		if (this.options.beginDate && this.options.endDate) {
			this.setSelectedStyle(this.options.beginDate, this.options.endDate);
		}
	};
	// 日历面板
	Calendars.prototype.panel = function() {
		var $elem = $(this.element);
		var $panel = $elem.find('.CalendarBox');
		if (!$panel.length) {
			$panel = $('<div class="CalendarBox"></div>').appendTo($elem);
		}
		return $panel;
	};
	// 滚动到指定月份
	Calendars.prototype.scrollTo = function(yyyymm) {
		var $month = this.panel().find('.CalendarMonth[data-month=' +yyyymm+ ']');
		var $elem = $(this.element);
		$elem.scrollTop($month.offset().top + $elem.scrollTop() - $elem.offset().top);
	};
	// 日历渲染
	Calendars.prototype.draw = function(yyyymm) {
		if (!yyyymm || this.vars.drawing) { return; }
		this.vars.drawing = true;

		var method;
		if (!this.vars.drawed) {
			method = 'appendTo';
			this.vars.drawed = { min:yyyymm, max:yyyymm };
		} else {
			if (yyyymm > this.vars.drawed.max) {
				method = 'appendTo';
				this.vars.drawed.max = yyyymm;
			} else if (yyyymm < this.vars.drawed.min) {
				method = 'prependTo';
				this.vars.drawed.min = yyyymm;
			} else {
				return; // 该月份已经渲染过了
			}
		}

		var html = generateCalendarHtml(yyyymm, this.vars.date, this.options.minDate, this.options.maxDate);
		var $calendar = $(html);
		$calendar[method](this.panel());

		this.vars.drawing = false;
		return $calendar;
	};
	// 绑定事件
	Calendars.prototype.bind = function(bindEvent) {
		var self = this;
		var $elem = $(self.element);
		var $panel = self.panel();
		$panel.off(".xcalendar");
		if (bindEvent.click) {
			$panel.on(bindEvent.click + ".xcalendar", ".day-can", function() {
				self.select($(this).attr("data-day"));
			});
		}
		if (bindEvent.scroll) {
			$elem.on(bindEvent.scroll + ".xcalendar", function(e) {
				e.stopPropagation();
				var me = $(this);
				var time = new Date().getTime();
				var delay = 100; // 100毫秒内只加载一次
				if (me.scrollTop() < 100) {
					if (!self.vars.toTopTime || time - self.vars.toTopTime > delay) {
						self.vars.toTopTime = time;
						var $calendar = self.draw(self.calcClosestYyyyMm(-1));
						if ($calendar && $calendar.length) {
							// 保持加载之前的滚动条位置
							me.scrollTop(me.scrollTop() + $calendar.height());
						}
					}
				} else if ($panel.height() - me.scrollTop() - me.height() < 100) {
					if (!self.vars.toEndTime || time - self.vars.toEndTime > delay) {
						self.draw(self.calcClosestYyyyMm(1));
						self.vars.toEndTime = time;
					}
				}
	
				// scrollTop到顶或到底之后就不会再触发scroll事件了, 设置一个定时器修正一下
				// clearTimeout(self.vars.scrollTimer);
				// self.vars.scrollTimer = setTimeout(function() { checkScrollPosition(self); }, 100);
			});
		}
	};
	var checkScrollPosition = function(api) {
		var $elem = $(api.element);
		var $panel = api.panel();
		if ($elem.scrollTop() == 0) {
			$elem.scrollTop(1);
		} else if ($panel.height() - $elem.scrollTop() - $elem.height() <= 10) { // 10=margin-bottom
			$elem.scrollTop($panel.height() - $elem.scrollTop() - $elem.height() - 11);
		}
	};
	// 计算本月最后一天
	var getLastDayOfMonth = function(date) {
		// 设置为下一个月的第一天的前一天, 即本月最后一天
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	};
	// 是不是同一天
	var isSameDay = function(one, two) {
		if (one == undefined || two == undefined) { return false; }
		return one.getFullYear() == two.getFullYear() && one.getMonth() == two.getMonth() && one.getDate() == two.getDate();
	};
	var isEnabled = function(date, min, max) {
		var d = dateToYyyyMmDd(date);
		if (min && d < dateToYyyyMmDd(min)) { return false; }
		if (max && d > dateToYyyyMmDd(max)) { return false; }
		return true;
	};
	// 生成日历的HTML
	var generateCalendarHtml = function(yyyymm, today, minDate, maxDate) {
		var year = Math.floor(yyyymm / 100);
		var month = yyyymm % 100;

		var temp = new Date(year, month - 1, 1);
		var beginPointer = temp.getDay(); // 开始位置, 即第一天是星期几
		var lastDay = getLastDayOfMonth(temp); // 本月最后一天
		var line = Math.ceil((beginPointer + lastDay) / 7.0); // 一共需要占用几行

		var html = '';
		// .CalendarMonth开始
		html += '<div class="ub ub-ver monthBox CalendarMonth" data-month="'+yyyymm+'">';
		// 年月
		html += '<div class="ub ub-pc ai-bgc-ff monthTitle">' +
					'<span>'+year+'年</span>&nbsp;<span>'+MONTH_TEXTS[month - 1]+'</span>' +
				'</div>';
		// 星期
		html += '<div class="ub ai-ubb ub-pc ai-bgc-ff weekTitleBox">' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle weekendColor">日</div>' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle">一</div>' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle">二</div>' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle">三</div>' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle">四</div>' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle">五</div>' +
					'<div class="ub ub-ac ub-pc ub-f1 weekTitle weekendColor">六</div>' +
				'</div>';

		html += '<div class="ub ai-ubb ub-pc ai-bgc-ff">'; // 第一行开始
		for (var i = 1, end = line * 7; i <= end; i++) {
			// 每隔7天插入分行
			if (i > 1 && i < end && i % 7 == 1) {
				html += '</div><div class="ub ai-ubb ub-pc ai-bgc-ff">';
			}

			var day = i - beginPointer;
			var weekIndex = ( i - 1 ) % 7;
			var firstDay = 1;
			if (day < 1 || day > lastDay) { // 空单元格
				html += '<div class="ub ub-pc ub-f1 day-box day-ban"></div>';
			} else { // 日期单元格
				var lunar = getLunarCalendar(year, month, day); // 农历
				var weekend = weekIndex == 0 || weekIndex == 6 ? "weekendColor" : "";
				var currDate = new Date(year, month - 1, day);
				var yyyymmdd = dateToYyyyMmDd(currDate);
				var isToday = isSameDay(today, currDate);
				if (isToday) { weekend += "day-today"; }
				var dayText = isToday ? '今天' : day;
				var enabled = isEnabled(currDate, minDate, maxDate) ? 'day-can' : 'day-ban';
				html += '<div class="ub ub-ac ub-pc ub-f1 day-box '+weekend+' '+enabled+'" data-day="'+yyyymmdd+'">' + 
							'<div class="ub ub-ver ub-ac ub-pc CalendarDate">' + 
								'<div>'+dayText+'</div><div class="CalendarOnTag '+lunar.class+'">'+lunar.text+'</div><div class="CalendarMark"></div>' + 
							'</div>' + 
						'</div>';
			}
		}
		html += '</div>'; // 最后一行结束
		html += '</div>'; // .CalendarMonth结束
		return html;
	};
	Calendars.prototype.setSelectedStyle = function(beginDate, endDate) {
		var $panel = this.panel();
		$panel.find('.day-can.day-selected').removeClass('day-selected begin end');
		var begin = dateToYyyyMmDd(beginDate);
		var end = dateToYyyyMmDd(endDate);
		var temp = begin;
		do {
			$panel.find('.day-can[data-day=' + temp + ']').addClass('day-selected');
			temp = calcOffsetYyyyMmDd(temp, 1);
		} while (temp <= end);
		$panel.find('.day-can[data-day=' + begin + ']').addClass('begin');
		$panel.find('.day-can[data-day=' + end + ']').addClass('end');
	};
	// 选中某一天, date=Date/yyyymmdd
	Calendars.prototype.select = function(date) {
		var yyyymmdd = $.dt.isDate(date) ? dateToYyyyMmDd(date) : date * 1;
		if (isNaN(yyyymmdd)) { throw Error('Calendars.select() Date format error : ' + date); }
		var $panel = this.panel();
		var $day = $panel.find('.day-can[data-day=' + yyyymmdd + ']');
		if ($day.length) {
			var s = this.vars.selected;
			var date = yyyyMmDdToDate(yyyymmdd);
			if (!this.options.range) { // 选择单个日期
				$panel.find('.day-can.day-selected').removeClass('day-selected begin end');
				$day.addClass('day-selected begin end');
				s.begin = s.end = date;
				this.callback();
			} else { // 选择日期范围
				// 之前未选择, 或者已经选择了开始和结束日期
				if (!s.begin || s.begin && s.end) {
					// 先取消选择, 再选择开始日期
					this.unselect();
					$day.addClass('day-selected begin');
					s.begin = date; s.end = undefined;
				} else { // 之前已经选择了开始日期
					s.end = date;
		    		if (s.begin.getTime() > s.end.getTime()) {
		    			var temp = s.begin;
		    			s.begin = s.end;
		    			s.end = temp;
		    		}
		    		this.setSelectedStyle(s.begin, s.end);
					this.callback();
				}
			}
		}
	};
	// 取消选中
	Calendars.prototype.unselect = function() {
		this.panel().find('.day-can.day-selected').removeClass('day-selected begin end');
		this.vars.selected.begin = undefined;
		this.vars.selected.end = undefined;
	};
	// 回调
	Calendars.prototype.callback = function(cancel) {
		if (!$.isFunction(this.options.callback)) { return; }
		var o = this.vars.original;
		var s = this.vars.selected;
		if (s.begin && s.end) {
			var changed;
			if (!o.begin || !o.end) {
				changed = true;
			} else {
				changed = !isSameDay(o.begin, s.begin) || !isSameDay(o.end, s.end);
			}
			var event = { cancel:cancel, changed:changed, beginDate:toBeginDate(s.begin), endDate:toEndDate(s.end) };
			this.options.callback.call(this, event);
		} else if (cancel) {
			var event = { cancel:true, changed:false, beginDate:toBeginDate(o.begin), endDate:toEndDate(o.end) };
			this.options.callback.call(this, event);
		}
	};
	var toBeginDate = function(date) {
		return !date ? undefined : new Date(date.getFullYear(), date.getMonth(), date.getDate());
	};
	var toEndDate = function(date) {
		return !date ? undefined : new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
	};

	// 计算最靠近的月份
	// 初始化时和滚动到底时用来计算draw的月份: calcClosestMonth(1);
	// 滚动到顶时用来计算draw的月份: calcClosestMonth(-1);
	// 重新打开时用来计算scrollTo的月份: calcClosestMonth();
	// @return yyyymm
	Calendars.prototype.calcClosestYyyyMm = function(offset) {
		if (!this.vars.drawed || !offset) { // 还没有渲染, 或者只是计算当前月份
			if (this.options.beginDate && this.options.endDate) { // 有开始结束时间
				return calcClosestYyyyMm(this.vars.date, this.options.beginDate, this.options.endDate);
			} else if (this.options.minDate && this.options.maxDate) { // 有最小最大时间
				return calcClosestYyyyMm(this.vars.date, this.options.minDate, this.options.maxDate);
			} else {
				return dateToYyyyMm(this.vars.date);
			}
		} else {
			if (offset < 0) { // 计算上一月份
				return calcOffsetYyyyMm(this.vars.drawed.min, offset);
			} else { // 计算下一月份
				return calcOffsetYyyyMm(this.vars.drawed.max, offset);
			}
		}
	};
	var dateToYyyyMm = function(date) {
		return Dates.format(date, 'yyyyMM') * 1;
	};
	var dateToYyyyMmDd = function(date) {
		return Dates.format(date, 'yyyyMMdd') * 1;
	};
	var yyyyMmDdToDate = function(yyyymmdd) {
		var year = Math.floor(yyyymmdd / 10000);
		var month = Math.floor(yyyymmdd % 10000 / 100);
		var day = yyyymmdd % 100;
		return new Date(year, month - 1, day);
	};
	// calcOffsetYyyyMm(201512, +1) = 201601
	// calcOffsetYyyyMm(201601, -1) = 201512
	var calcOffsetYyyyMm = function(yyyymm, offset) {
		var m = Math.floor(yyyymm / 100) * 12 + yyyymm % 100 - 1;
		m += offset;
		return Math.floor(m / 12) * 100 + m % 12 + 1;
	};
	// calcOffsetYyyyMmDd(20160301, -1) = 20160229
	// calcOffsetYyyyMmDd(20160229, +1) = 20160301
	var calcOffsetYyyyMmDd = function(yyyymmdd, offset) {
		var temp = yyyyMmDdToDate(yyyymmdd);
		temp.setDate(temp.getDate() + offset);
		return dateToYyyyMmDd(temp);
	};
	// 计算最靠近的月份
	// date在最大值和最小值之间, 返回date
	// 否则返回最大值和最小值与date比较靠近的那个
	// @return yyyymm
	var calcClosestYyyyMm = function(date, min, max) {
		var d = dateToYyyyMm(date);
		var mn = dateToYyyyMm(min);
		var mx = dateToYyyyMm(max);
		if (d >= mn && d <= mx) {
			return d;
		} else if (Math.abs(d - mn) < Math.abs(d - mx)) {
			return mn;
		} else {
			return mx;
		}
	};
	var checkOptions = function(options, today) {
	    // 计算相对日期
	    $.each(['beginDate', 'endDate', 'minDate', 'maxDate'], function(i, name) {
	    	if (options[name] != undefined && !$.dt.isDate(options[name])) {
	    		options[name] = Dates.calculate(today, options[name]);
	    	}
	    });
	    // 检查选项, 保证minDate/maxDate, beginDate/endDate成对出现, 且min小于max, begin小于end
	    if (!options.maxDate) {
    		options.maxDate = new Date(2099, 12, 31);
    	}
	    if (!options.minDate) {
    		options.minDate = new Date(0); // 1970-01-01
    	}
    	if (options.minDate && options.maxDate) {
    		if (options.minDate.getTime() > options.maxDate.getTime()) {
    			var temp = options.minDate;
    			options.minDate = options.maxDate;
    			options.maxDate = temp;
    		}
    	}
    	if (!options.range) { // range=false则endDate无效
    		options.endDate = options.beginDate;
    	} else {
	    	if (options.beginDate && !options.endDate) {
	    		options.endDate = options.beginDate;
	    	}
	    	if (!options.beginDate && options.endDate) {
	    		options.beginDate = options.endDate;
	    	}
	    	if (options.beginDate && options.endDate) {
	    		if (options.beginDate.getTime() > options.endDate.getTime()) {
	    			var temp = options.beginDate;
	    			options.beginDate = options.endDate;
	    			options.endDate = temp;
	    		}
	    	}
    	}
	};



	//格式化返回数据
	function checkNoChar(returnObj){
	    return ((typeof returnObj) == 'object' || (typeof returnObj) == 'undefined' || returnObj == '[object Object]')?'':returnObj;
	}
	// 返回农历
	function getLunarCalendar(year,month,day){
		var LunarCalendarJson = calendar.solar2lunar(year, month, day);
		var LunarCalendar = {
			"class": 'festivalColor',
			"text": ''
		};
		/**
		 * 优先显示农历节日
		 */
		if( LunarCalendarJson.IMonthCn == '腊月' && LunarCalendarJson.IDayCn == '三十' ){
			LunarCalendar.text = '除夕';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '正月' && LunarCalendarJson.IDayCn == '初一' ){
			LunarCalendar.text = '春节';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '正月' && LunarCalendarJson.IDayCn == '十五' ){
			LunarCalendar.text = '元宵节';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '五月' && LunarCalendarJson.IDayCn == '初五' ){
			LunarCalendar.text = '端午节';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '七月' && LunarCalendarJson.IDayCn == '初七' ){
			LunarCalendar.text = '七夕节';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '八月' && LunarCalendarJson.IDayCn == '十五' ){
			LunarCalendar.text = '中秋节';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '九月' && LunarCalendarJson.IDayCn == '初九' ){
			LunarCalendar.text = '重阳节';
			return LunarCalendar;
		}else if( LunarCalendarJson.IMonthCn == '腊月' && LunarCalendarJson.IDayCn == '初八' ){
			LunarCalendar.text = '腊八节';
			return LunarCalendar;
		}
		/**
		 * 其次显示阳历节日
		 */
		else if( month == 1 && day == 1 ){
			LunarCalendar.text = '元旦节';
			return LunarCalendar;
		}else if( month == 2 && day == 14 ){
			LunarCalendar.text = '情人节';
			return LunarCalendar;
		}else if( month == 3 && day == 8 ){
			LunarCalendar.text = '妇女节';
			return LunarCalendar;
		}else if( month == 3 && day == 15 ){
			LunarCalendar.text = '消费者';
			return LunarCalendar;
		}else if( month == 5 && day == 1 ){
			LunarCalendar.text = '劳动节';
			return LunarCalendar;
		}else if( month == 6 && day == 1 ){
			LunarCalendar.text = '儿童节';
			return LunarCalendar;
		}else if( month == 7 && day == 1 ){
			LunarCalendar.text = '建党节';
			return LunarCalendar;
		}else if( month == 8 && day == 1 ){
			LunarCalendar.text = '建军节';
			return LunarCalendar;
		}else if( month == 9 && day == 10 ){
			LunarCalendar.text = '教师节';
			return LunarCalendar;
		}else if( month == 10 && day == 1 ){
			LunarCalendar.text = '国庆节';
			return LunarCalendar;
		}else if( month == 10 && day == 31 ){
			LunarCalendar.text = '万圣节';
			return LunarCalendar;
		}else if( month == 11 && day == 11 ){
			LunarCalendar.text = '光棍节';
			return LunarCalendar;
		}else if( month == 12 && day == 24 ){
			LunarCalendar.text = '平安夜';
			return LunarCalendar;
		}else if( month == 12 && day == 25 ){
			LunarCalendar.text = '圣诞节';
			return LunarCalendar;
		}
		/**
		 * 最后显示农历、节气
		*/
		else{
			if( LunarCalendarJson.Term == null ){
				LunarCalendar.class = '';
				LunarCalendar.text = checkNoChar(LunarCalendarJson.IDayCn == '初一' ? LunarCalendarJson.IMonthCn : LunarCalendarJson.IDayCn);
				return LunarCalendar;
			}else{
				if( LunarCalendarJson.Term == '清明' ){
					LunarCalendar.text = '清明节';
					return LunarCalendar;
				}else{
					LunarCalendar.class = '';
					LunarCalendar.text = checkNoChar(LunarCalendarJson.Term);
					return LunarCalendar;
				}
			}
		}
	}

}(jQuery);
