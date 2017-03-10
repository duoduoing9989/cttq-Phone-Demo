+function($) {
	//显示
	$('input.do-speakIn').after('<span class="speak-btn-small do-speak-btn"></span>');
	$('textarea.do-speakIn').after('<div class="speak-box"><span class="speak-btn do-speak-btn">语音便捷输入</span></div>');
	
	//input输入和清空时显示和隐藏语音图标
	$(document).on('input focus tap click change', 'input.do-speakIn', function(){
		var me = $(this);
		var value = me.val();
		if(value){
			me.nextAll('.mui-icon-clear').removeClass('hide');
			me.nextAll('.do-speak-btn').addClass('hide');
		}else{
			me.nextAll('.mui-icon-clear').addClass('hide');
			me.nextAll('.do-speak-btn').removeClass('hide');
		}
	});
	
	//按住说话的键盘
	$(document).on('tap', '.do-speak-btn', function(e){
		var me = $(this);
		e.stopPropagation();
		e.preventDefault();
		var speakIn = me.prevAll('.do-speakIn');
		speakIn.blur();
		Utils.app.speechRecognition({"content":"语音识别"}, function(text){
			if(speakIn.length == 0){
				speakIn = me.closest('div.speak-box').prevAll('.do-speakIn');
			}
			speakIn.val(speakIn.val()+text);
			speakIn.change();
		});
	});
}(jQuery);