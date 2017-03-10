/**
 * 配置项
 * zhaohuihua, 2016-10-29
 */
+function($) {
	var concatUrl = function(base, uri) {
		if (!base.endsWith('/')) { base += '/'; }
		if (uri == undefined) {
			return base;
		} else if (/^https?:/.test(uri) || uri.charAt(0) == '/') {
			return uri;
		} else {
			return base + uri;
		}
	};
	
	var getBaseUrl = function(uri) {
		var url = window.location.href;
		var matcher = /^(https?:\/\/[^\/]+\/)/.exec(url);
		return concatUrl(matcher[1], uri);
	};
	
	window.Config = window.top.Config || {
		version: '1.0.0',
		ApplicationId: "20000062",
		itsHotline : "400-182-0660", // IT服务热线
		upload: {
			ak: "23255733",
			sk: "bae4d0a7acca52012069422807116473",
			namespace: "anyinfo-its",
			sizeLimit: 100 * 1024 * 1024, // 100MB
			// dir/name支持以下自定义占位符 {yy} {yyyy} {MM} {dd} {HH} {mm} {ss} {SSS} {random-1}~{random-10}
			dir : "${yyyy}/${MM}/${dd}/",
			name : "${HH}${mm}${ss}${SSS}${random-6}.${ext}",
			url: {
				// 附件OSS接口地址修改前：http://121.40.171.99:8080/cttq.com~portal~base~oss_web/
				base: getBaseUrl("oss/"),
				auth: "AssumeRoleQry",
				query: "AttachmentListQry",
				relate: "AttachmentRelationUpt",
				remark: "AttachmentRemarkUpt",
				del: "AttachmentDel"
			}
		}
	};
}(jQuery);
