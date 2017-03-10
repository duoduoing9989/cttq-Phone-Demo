/**
 * 在mui基础上封装的xview框架
 * 实现多页面的前进后退/多页面状态保持/多页面间方法调用/通过ajax加载子页面/转场动画等功能
 * @param {Object} jQuery
 * @param {Object} mui
 * @param {Object} window
 * zhaohuihua, 2016-11-24
 */
(function($, mui, window) {
	var ATTR_PAGE = "data-page";
	var CLASS_PAGE = mui.className('page');
	var CLASS_PAGE_LEFT = mui.className('page-left');
	var CLASS_PAGE_CENTER = mui.className('page-center');
	var CLASS_PAGE_SHADOW = mui.className('page-shadow');

	var CLASS_TRANSITIONING = mui.className('transitioning');

	var TEMPLATE_PAGE =
		'<div class="mui-page mui-iframe-wrapper" ' + ATTR_PAGE + '="{id}">' +
		'	<iframe src="{url}"/>' +
		'</div>';

	var View = mui.Class.extend({
		init: function(element, options) {
			this.element = element;
			$(this.element).addClass("mui-fullscreen");
			if (!options.root) { options.root = "./" }
			else if (!options.root.endsWith("/")) { options.root += "/"; }

			this.options = mui.extend({
				swipeBackPageActiveArea: 30,
				hardwareAccelerated: true
			}, options);

			this.maxScrollX = this.element.offsetWidth;
			this.x = this.y = 0;
			this.translateZ = this.options.hardwareAccelerated ? ' translateZ(0)' : '';
			this.ratio = 0;
			this.isBack = true;
			this.moved = this.dragging = false;

			this.activePage = this.previousPage = null;

			this._initPageEventMethod();

			this._initDefaultPage();

			this.initEvent();
		},
		_initPageEventMethod: function() {
			var self = this;
			mui.each(['onPageBeforeShow', 'onPageShow', 'onPageBeforeBack', 'onPageBack'], function(index, event) {
				self[event + 'Callbacks'] = {};
				self[event] = function(page, callback) {
					var eventCallbacks = event + 'Callbacks';
					if (!self[eventCallbacks].hasOwnProperty(page)) {
						self[eventCallbacks][page] = [callback];
					} else {
						self[eventCallbacks][page].push(callback);
					}
				};
			});
		},
		_initDefaultPage: function() {
			var page = this.options.page;
			if (!page) { return; }

			var defaultPage = this._findPage(page);
			// 如果不存在, 通过iframe加载
			if (!defaultPage) { defaultPage = this._createRemotePage(page); }

			this._appendPage(defaultPage);
		},
		_findPage: function(page) {
			var view = $(this.element).children('.' + CLASS_PAGE).filter(function() {
				return page === $(this).attr(ATTR_PAGE);
			});
			return view.length ? view[0] : undefined;
		},
		_getPageId: function(page) {
			return page.replace(/[\?\#].*/, "");
		},
		_getPageUrl: function(page, hashParams) {
			var pageid = this._getPageId(page);
			var params = hashParams ? "#" + $.param(hashParams) : "";
			return this.options.root + pageid + params;
		},
		_createRemotePage: function(page, hashParams) {
			var url = this._getPageUrl(page, hashParams);
			var $page = $($.zhh.format(TEMPLATE_PAGE, { id:page, url:url }));
			$page.appendTo(this.element);
			return $page[0];
		},
		initEvent: function() {
			this.element.addEventListener('drag', this);
			this.element.addEventListener('dragend', this);
			this.element.addEventListener('webkitTransitionEnd', this);
		},
		handleEvent: function(event) {
			switch (event.type) {
				case 'drag':
					this._drag(event);
					break;
				case 'dragend':
					this._dragend(event);
					break;
				case 'webkitTransitionEnd':
					this._webkitTransitionEnd(event);
					break;
			}
		},
		shadow: function() {
			var shadow = document.createElement('div');
			shadow.className = CLASS_PAGE_SHADOW;
			return shadow;
		}(),
		_appendPage: function(page) {
			page.classList.add(CLASS_PAGE_CENTER);
			this.element.appendChild(page);
		},
		_cleanPageClass: function(page) {
			page.classList.remove(CLASS_PAGE_CENTER);
			page.classList.remove(CLASS_PAGE_LEFT);
		},
		_cleanStyle: function(el) {
			if (el) {
				el.style.webkitTransform = '';
				el.style.opacity = '';
			}
		},
		_webkitTransitionEnd: function(event) {
			this.dragging = this.moved = false;
			if (this.activePage !== event.target) {
				return;
			}

			this.isInTransition = false;

			this.shadow.parentNode === this.activePage && this.activePage.removeChild(this.shadow);
			this.previousPage.classList.remove(CLASS_TRANSITIONING);
			this.activePage.classList.remove(CLASS_TRANSITIONING);

			var self = this;

			this._cleanStyle(this.previousPage);
			this._cleanStyle(this.activePage);

			if (this.ratio <= 0.5) {
				return;
			}
			if (this.isBack) {
				// 动画结束后删除当前激活的页面
				this.activePage.remove();

				// previousPage变成activePage
				this.previousPage.classList.remove(CLASS_PAGE_LEFT);
				this.previousPage.classList.add(CLASS_PAGE_CENTER);
				// 上一个页面变成previousPage
				$(this.previousPage).prev('.' + CLASS_PAGE).addClass(CLASS_PAGE_LEFT);
				this._trigger('pageShow', this.previousPage);
			} else {
				this.previousPage.classList.add(CLASS_PAGE_LEFT);
				this.activePage.classList.add(CLASS_PAGE_CENTER);
				this._trigger('pageShow', this.activePage);
			}


		},
		_trigger: function(eventType, page) {
			var eventCallbacks = 'on' + eventType.charAt(0).toUpperCase() + eventType.slice(1) + 'Callbacks';
			if (this[eventCallbacks].hasOwnProperty(page.id)) {
				var callbacks = this[eventCallbacks][page.id];
				var event = new CustomEvent(eventType, {
					detail: {
						page: page
					},
					bubbles: true,
					cancelable: true
				});
				for (var len = callbacks.length; len--;) {
					callbacks[len].call(this, event);
				}
			}
			mui.trigger(this.element, eventType, {
				page: page
			});
		},
		_initPageTransform: function() {
			this.previousPage = this.element.querySelector('.' + CLASS_PAGE_LEFT);
			this.activePage = this.element.querySelector('.' + CLASS_PAGE_CENTER);
			if (this.previousPage && this.activePage) {
				this.activePage.appendChild(this.shadow);

				this.previousPageStyle = this.previousPage.style;
				this.activePageStyle = this.activePage.style;

				this.previousPage.classList.remove(CLASS_TRANSITIONING);
				this.activePage.classList.remove(CLASS_TRANSITIONING);

				this.x = 0;
				this.dragging = true;
				return true;
			}
			return false;
		},
		_drag: function(event) {
			if (this.isInTransition) {
				return;
			}
			var detail = event.detail;
			if (!this.dragging) {
				if ((mui.gestures.session.firstTouch.center.x - this.element.offsetLeft) < this.options.swipeBackPageActiveArea) {
					this.isBack = true;
					this._initPageTransform();
				}
			}
			if (this.dragging) {
				var deltaX = 0;
				if (!this.moved) { //start
					deltaX = detail.deltaX;
					mui.gestures.session.lockDirection = true; //锁定方向
					mui.gestures.session.startDirection = detail.direction;
				} else { //move
					deltaX = detail.deltaX - (mui.gestures.session.prevTouch && mui.gestures.session.prevTouch.deltaX || 0);
				}
				var newX = this.x + deltaX;
				if (newX < 0 || newX > this.maxScrollX) {
					newX = newX < 0 ? 0 : this.maxScrollX;
				}

				event.stopPropagation();
				detail.gesture.preventDefault();

				if (!this.requestAnimationFrame) {
					this._updateTranslate();
				}

				this.moved = true;
				this.x = newX;
				this.y = 0;
			}
		},
		_dragend: function(event) {
			if (!this.moved) {
				return;
			}

			event.stopPropagation();

			var detail = event.detail;

			this._clearRequestAnimationFrame();

			this._prepareTransition();

			this.ratio = this.x / this.maxScrollX;
			if (this.ratio === 1 || this.ratio === 0) {
				mui.trigger(this.activePage, 'webkitTransitionEnd');
				return;
			}
			if (this.ratio > 0.5) {
				this.setTranslate(this.maxScrollX, 0);
			} else {
				this._cleanStyle(this.previousPage);
				this._cleanStyle(this.activePage);
			}
		},
		_prepareTransition: function() {
			this.isInTransition = true;
			this.previousPage.classList.add(CLASS_TRANSITIONING);
			this.activePage.classList.add(CLASS_TRANSITIONING);
		},
		_clearRequestAnimationFrame: function() {
			if (this.requestAnimationFrame) {
				cancelAnimationFrame(this.requestAnimationFrame);
				this.requestAnimationFrame = null;
			}
		},
		_getTranslateStr: function(x, y) {
			if (this.options.hardwareAccelerated) {
				return 'translate3d(' + x + 'px,' + y + 'px,0px) ' + this.translateZ;
			}
			return 'translate(' + x + 'px,' + y + 'px) ';
		},

		_updateTranslate: function() {
			var self = this;
			if (self.x !== self.lastX || self.y !== self.lastY) {
				self.setTranslate(self.x, self.y);
			}
			self.requestAnimationFrame = requestAnimationFrame(function() {
				self._updateTranslate();
			});
		},
		_blurActiveElement: function() {
			var iframe = this.subwindow();
			if (iframe && iframe.document.activeElement) {
				var element = iframe.document.activeElement;
				if (element.tagName == "INPUT" || element.tagName == "TEXTAREA") {
					element.blur();
				}
			}
		},
		setTranslate: function(x, y) {
			this.x = x;
			this.y = y;
			this.previousPage.style.opacity = 0.9 + 0.1 * x / this.maxScrollX;
			this.previousPage.style['webkitTransform'] = this._getTranslateStr((x / 6 - this.maxScrollX / 6), y);
			this.activePage.style['webkitTransform'] = this._getTranslateStr(x, y);

			this.lastX = this.x;
			this.lastY = this.y;
		},
		_getPage: function(page) { // return $view
			if (!page) {
				return $(this.element).find('.' + CLASS_PAGE_CENTER);
			} else if (typeof(page) == "number") {
				if (page > 0) { // subwindow(+n)
					var views = $(this.element).children('.' + CLASS_PAGE);
					return views.eq(page - 1);
				} else { // subwindow(-n)
					var curr = $(this.element).find('.' + CLASS_PAGE_CENTER);
					var views = $(this.element).children('.' + CLASS_PAGE);
					var index = views.index(curr);
					return views.eq(index + page);
				}
			} else {
				return $(this.element).children('.' + CLASS_PAGE).filter(function() {
					return page === $(this).attr(ATTR_PAGE);
				});
			}
		},
		// var iframe = xview.subwindow('list.html');
		// var xxx = $(iframe.document.body).find("xxx");
		// xview.subwindow(-n); == 上n个页面
		// xview.subwindow(+n); == 第n个页面
		subwindow: function(page) {
			var view = this._getPage(page);
			iframe = view.children("iframe");
			return iframe && iframe.length ? iframe[0].contentWindow : undefined;
		},
		// xview.invoke('list.html', method, argument 1, ..., argument n);
		// xview.invoke(-n, method, argument 1, ..., argument n); // 执行上n个页面的方法
		// xview.invoke(+n, method, argument 1, ..., argument n); // 执行第n个页面的方法
		invoke: function(page, method) {
			var iframe = this.subwindow(page);
			if (iframe && $.isFunction(iframe[method])) {
				iframe[method].apply(iframe, Array.prototype.splice.call(arguments, 2));
			}
		},
		canBack: function() {
			return !!this.element.querySelector('.' + CLASS_PAGE_LEFT);
		},
		// xview.back(); // 返回至上一个页面
		// xview.back('list.html'); // 返回至指定页面
		// xview.back(-n); // 返回至上n个页面
		// xview.back(+n); // 返回至第n个页面
		back: function(page) {
			if (this.isInTransition) {
				return;
			}
			this._blurActiveElement();
			if (page) {
				// 删除从目标页面到当前页面之前的页面
				var $target = this._getPage(page);
				// 目标页面不是上一页也不是当前页
				if ($target && $target.length && !$target.hasClass(CLASS_PAGE_LEFT) && !$target.hasClass(CLASS_PAGE_CENTER)) {
					$target.addClass(CLASS_PAGE_LEFT);
					this.previousPage = $target[0];
					var $next = $target.next('.' + CLASS_PAGE);
					while ($next.length && !$next.hasClass(CLASS_PAGE_CENTER)) {
						var $temp = $next.next('.' + CLASS_PAGE);
						$next.remove();
						$next = $temp;
					}
				}
			}

			this.isBack = true;
			this.ratio = 1;
			if (this._initPageTransform()) {
				this._trigger('pageBeforeBack', this.activePage);
				this._trigger('pageBeforeShow', this.previousPage);
				this._prepareTransition();
				this.previousPage.offsetHeight;
				this.activePage.offsetHeight;
				this.setTranslate(this.maxScrollX, 0);
			}
		},
		go: function(page, hashParams) {
			if (this.isInTransition) {
				return;
			}

			var nextPage = this._findPage(page);
			// 如果不存在, 通过ajax加载
			if (!nextPage) { nextPage = this._createRemotePage(page, hashParams); }

			if (nextPage) {
				this._blurActiveElement();

				var previousPage = this.element.querySelector('.' + CLASS_PAGE_LEFT);
				var activePage = this.element.querySelector('.' + CLASS_PAGE_CENTER);

				if (previousPage) {
					this._cleanPageClass(previousPage);
				}

				if (activePage) {
					activePage.classList.remove(CLASS_PAGE_CENTER);
					activePage.style.webkitTransform = 'translate3d(0,0,0)';
					activePage.classList.add(CLASS_PAGE_LEFT);
				}


				nextPage.style.webkitTransform = 'translate3d(100%,0,0)';
				this._appendPage(nextPage);
				nextPage.appendChild(this.shadow); //shadow
				nextPage.offsetHeight; //force
				this.isBack = false;
				this.ratio = 1;

				this._initPageTransform();

				//force
				this.previousPage.offsetHeight;
				this.activePage.offsetHeight;

				this._trigger('pageBeforeShow', this.activePage);
				this._prepareTransition();
				this.setTranslate(0, 0);
			}
		},
		replace: function(page, hashParams) {
			if (this.isInTransition) {
				return;
			}

			this._blurActiveElement();

			var pageid = this._getPageId(page);
			var url = this._getPageUrl(page, hashParams);

			var $activePage = $(this.element).find('.' + CLASS_PAGE_CENTER);
			$activePage.attr("data-page", pageid);
			$activePage.html('<iframe src="' + url + '"/>');
		}

	});


	var API_KEY = '__xview__';
	$.fn.xview = function(options) {
		if (options === 'api') {
			return this.data(API_KEY);
		} else if (typeof(options) == 'string' && View.prototype[options]) {
			var api = this.data(API_KEY);
			if (!api) { throw Error("xview not yet initialized!"); }
			return api[options].apply(api, Array.prototype.splice.call(arguments, 1));
		}
		return this.each(function() {
			var api = $(this).data(API_KEY);
			if (!api) {
				$(this).data(API_KEY, new View(this, options));
			}
		});
	}
})(jQuery, mui, window);