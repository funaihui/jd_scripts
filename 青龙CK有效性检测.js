/**
* @author 爱码者说
* @create_at 2022-09-09 11:44:11
* @description 京东CK检测。
* @version v1.0.0
* @title CK检测
* @platform qq wx tg pgm web cron
* @rule CK检测
* @rule 检测
* @priority 66
* @cron 1 8,12,17,21 * * *
* @admin false
*/

//sender
const s = sender;
const qinglong = new Bucket("qinglong");

check();
function check() {
	let ql_name = "";
	let adminMsg = "";
	let base = 1;
	var sxck = "";
	var cknum = "";
	let ql_json = qinglong.get("QLS", "");
	var ql_NO = "1"; //自动检测时你想检测那个容器的CK，【青龙管理】返回的容器编号，建议填写聚合容器。
	var ql_data = JSON.parse(ql_json);
	var ql_total = ql_data.length;

	if (s.getPlatform() == "fake") {
		var i = Number(ql_NO) - Number("1");
		notifyMasters("自动检测开始执行……");
	} else {
		if (!s.isAdmin()) {
			s.reply("你没有权限操作。");
			return;
		}

		if (!ql_total) {
			s.reply("你没有配置青龙，请先发【青龙管理】配置后再来。");
			return;
		} else {
			for (var i = 0; i < ql_total; i++) {
				var name = ql_data[i].name;
				var ii = i + 1;
				ql_name += ii + "." + name + "\n";
			}

			s.reply(
				"共有" +
					ql_total +
					"个青龙容器，请选择你要检测那个容器。(发编号)\n" +
					ql_name
			);
			var newS = s.listen(10000);
			var ii = newS.getContent();
			if (ii == "" || isNaN(ii)) {
				s.reply("输入错误或超时，已退出。");
				return;
			}
		}
		var i = ii - 1;
	}
	//青龙参数
	let ql_ipport = ql_data[i].host;
	let client_id = ql_data[i].client_id;
	let client_secret = ql_data[i].client_secret;
	var {body} = request({
		// 内置http请求函数
		url:
			ql_ipport +
			"/open/auth/token?client_id=" +
			client_id +
			"&client_secret=" +
			client_secret,
		//请求链接
		method: "get",
		//请求方法
		dataType: "json",
		//这里接口直接返回文本
	});

	let token = body.data.token;
	var url = ql_ipport + "/open/envs?searchValue=&t=" + Date.now();
	var json = request({
		url: url,
		method: "get",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
			Authorization: "Bearer " + token,
		},
	});
	
	json = json.body
	var CKarray = JSON.parse(json);
	var total = CKarray.data.length;
	if (!total) {
		s.reply("抱歉，没有找到数据。");
		return;
	}
	for (var i = 0; i < total; i++) {
		var variable = CKarray.data[i].name;
		if (variable == "JD_COOKIE") {
			cknum = Number(cknum) + Number(base);
		}
	}
	s.reply("开始检测，共有" + cknum + "个JD_COOKIE。");

	for (var i = 0; i < total; i++) {
		var cookie = CKarray.data[i].value;
		var pin = decodeURIComponent(
			cookie.match(/pt_pin=([^; ]+)(?=;?)/) &&
				cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]
		);

		if (pin != "null" && pin != "" && pin) {
			var statejson = request({
				url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
				method: "get",
				headers: {
					"User-Agent":
						"Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
					Cookie: cookie,
				},
			});
			statejson=statejson.body;
			var data = JSON.parse(statejson);
			var state = data.msg;
			if (state == "not login") {
				const sillyGirl = new SillyGirl()
				//QQ绑定
				const pinQQ = new Bucket("pinQQ");
				let user_id = pinQQ.get(encodeURIComponent(pin));
				//tg绑定
				const pinTG = new Bucket("pinTG");
				let tg_user_id = pinTG.get( encodeURIComponent(pin));
				//wx绑定
				const pinWX = new Bucket("pinWX");
				let wx_user_id = pinWX.get(encodeURIComponent(pin));
				let msg =
					"您的账号: " +
					pin +
					" ，已过期；\n为了不影响你的收益请及时更新。";

				console.log(msg);

				sxck = Number(sxck) + Number(base);
				adminMsg += sxck + "." + pin + "\n";
				//给QQ发
				if (user_id) {
					sillyGirl.push({
    					platform: "qq",
    					userId: user_id,
    					content: msg,
					})
				}
				//给TG发
				if (tg_user_id) {
					sillyGirl.push({
						platform: "tg",
						userID: tg_user_id,
						content: msg,
					});
				}
				//给WX发
				if (wx_user_id) {
					sillyGirl.push({
						platform: "wx",
						userID: wx_user_id,
						content: msg,
					});
				}
			}
		}
		sleep(5000); // 5秒后检测下一个
	}
	if (s.getPlatform()== "fake") {
		if (sxck == "") {
			notifyMasters("太棒了👏！所有cookie全部有效！");
		} else {
			notifyMasters(
				"已经给以下" +
					sxck +
					"个账号\n" +
					adminMsg +
					"用户发送账号登陆提醒"
			);
		}
	} else {
		if (sxck == "") {
			s.reply("太棒了👏！所有cookie全部有效！");
		} else {
			s.reply(
				"已经给以下" +
					sxck +
					"个账号\n" +
					adminMsg +
					"用户发送账号登陆提醒"
			);
		}
	}
}
