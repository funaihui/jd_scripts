/**
* @author 爱码者说
* @create_at 2022-09-09 14:13:59
* @description 统计收入京豆的详情，显示所有收入
* @version v1.0.0
* @title 京豆详情
* @platform qq wx tg pgm web cron
* @rule ^豆豆$
* @priority 100
* @cron 0 20 8 8 *
* @admin false
*/
const s = sender
function main() {
	const qinglong = new Bucket("qinglong")
	let data = qinglong.get("QLS", "")
	if (data == "") {
		s.reply("醒一醒，你都没对接青龙，使用\"青龙管理\"命令对接青龙")
		return
	}
	var QLS = JSON.parse(data)
	let bind = GetBind(s.getPlatform(), s.getUserId())//获取该用户所绑定的pin
	if (bind.length == 0) {
		s.reply("获取绑定信息失败或您未绑定本平台")
		return
	}
	for (let i = 0; i < QLS.length; i++) {
		let ql_host = QLS[i].host
		let ql_client_id = QLS[i].client_id
		let ql_client_secret = QLS[i].client_secret
		let ql_token = Get_QL_Token(ql_host, ql_client_id, ql_client_secret)
		if (ql_token == null) {
			s.reply("容器" + QLS[i].name + "token获取失败,跳过\n")
			continue
		}
		let envs = Get_QL_Envs(ql_host, ql_token)
		for (let j = 0; j < envs.length; j++) {
			if (envs[j].name != "JD_COOKIE")
				continue
			for (let k = 0; k < bind.length; k++) {
				let pin = envs[j].value.match(/(?<=pt_pin=)[^;]+/g)
				if (pin == bind[k]) {
					if (envs[j].status == 1)
						s.reply("账号" + envs[j].value.match(/(?<=pt_pin=)[^;]+/g) + "已失效")
					else {
						s.reply(BeanInfo(envs[j].value))
						sleep(Math.random() * 5000 + 1000)
						bind.splice(k, 1)//将已通知的pin从bind删除，以免重复通知，并降低代码复杂度
						break
					}
				}
			}
		}
	}
	return
}

main()


function BeanInfo(ck) {
	let flag = 0
	let page = 1
	let info = []//各项活动详情统计
	let date = new Date()
	let today = date.getDate()
	let sum = 0
	let notify = ""
	let latestInfo = "\n-最近收入\n"
	var latest = 3
	while (!flag) {
		let body = escape(JSON.stringify({
			"pageSize": "20",
			"page": page.toString()
		}
		))
		let options = {
			url: "https://api.m.jd.com/client.action?functionId=getJingBeanBalanceDetail",
			method: "post",
			dataType: "json",
			body: "body=" + body + "&appid=ld",
			headers: {
				"User-Agent": "jdltapp;iPad;3.7.0;14.4;network/wifi;hasUPPay/0;pushNoticeIsOpen/0;lang/zh_CN;model/iPad7,5;addressid/;hasOCPay/0;appBuild/1017;supportBestPay/0;pv/4.14;apprpd/MyJD_Main;ref/MyJdMTAManager;psq/3;ads/;psn/956c074c769cd2eeab2e36fca24ad4c9e469751a|8;jdv/0|;adk/;app_device/IOS;pap/JA2020_3112531|3.7.0|IOS 14.4;Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
				"Host": "api.m.jd.com",
				"Content-Type": "application/x-www-form-urlencoded",
				"Cookie": ck
			}
		}

		var beaninfo = request(options)
		beaninfo = beaninfo.body

		if (beaninfo && beaninfo.code == 0) {
			for (let i = 0; i < beaninfo.detailList.length; i++) {
				let day = beaninfo.detailList[i].date.match(/(?<=-)\d+\s/)

				if (day != today) {
					flag = 1
					break
				}

				latestInfo += beaninfo.detailList[i].amount + " " + beaninfo.detailList[i].eventMassage + " " + beaninfo.detailList[i].date.match(/(?<= )\S+/g) + "\n"

				sum += Number(beaninfo.detailList[i].amount)

				let find = 0
				for (let j = 0; j < info.length; j++) {
					if (info[j].event == beaninfo.detailList[i].eventMassage) {
						info[j].amount += Number(beaninfo.detailList[i].amount)
						find = 1
						break
					}
				}
				if (!find) {
					info.push({ event: beaninfo.detailList[i].eventMassage, amount: Number(beaninfo.detailList[i].amount) })
				}
			}
		}
		else return "京豆数据获取失败"
		page++
	}
	info.sort(function (a, b) { return a.amount - b.amount })

	for (let i = 0; i < info.length; i++) {
		if (info[i].amount >= 10)
			notify = info[i].event + " " + info[i].amount + "\n" + notify
	}
	let userdata = JD_UserInfo(ck).body
	if (userdata)
		return "--------【" + userdata.data.userInfo.baseInfo.nickname + "】--------\n" + "✧今日收入" + sum + "京豆✧\n\n" + notify + "...\n" + latestInfo
	else
		return "-----【" + ck.match(/(?<=pin=)[^;]+/g) + "】-----\n" + "✧今日收入【" + sum + "】京豆✧\n\n" + notify + "...\n" + latestInfo
}

function RealDay(date) {
	let realtime = new Date(date.getTime() + 8 * 60 * 60 * 1000)
	return realtime.getDate()
}


function GetBind(imtype, uid) {
	let allpins = []//傻妞中绑定该平台的所有pin
	let pin = []//该用户所绑定pin
	if (imtype == "qq") {
		const pinQQ = new Bucket("pinQQ")
		allpins = pinQQ.keys()
		for (let i = 0; i < allpins.length; i++)
			if (pinQQ.get(allpins[i]) == uid)
				pin.push(allpins[i])
	}
	else if (imtype == "tg") {
		const pinTG = new Bucket("pinTG")
		allpins = pinTG.keys()
		for (let i = 0; i < allpins.length; i++)
			if (pinTG.get(allpins[i]) == uid)
				pin.push(allpins[i])
	}
	else if (imtype == "wx") {
		const pinWX = new Bucket("pinWX")
		allpins = pinWX.keys()

		for (let i = 0; i < allpins.length; i++)
			if (pinWX.get(allpins[i]) == uid)
				pin.push(allpins[i])
	}
	else if (imtype == "wxmp") {
		const pinWXMP = new Bucket("pinWXMP")
		allpins = pinWXMP.keys()

		for (let i = 0; i < allpins.length; i++)
			if (pinWXMP.get(allpins[i]) == uid)
				pin.push(allpins[i])
	}
	else if (imtype == "pgm") {
		const pgm = new Bucket("pgm")
		allpins = pgm.keys()

		for (let i = 0; i < allpins.length; i++)
			if (pgm.get(allpins[i]) == uid)
				pin.push(allpins[i])
	}
	else if (imtype == "sxg") {
		const pinSXG = new Bucket("pinSXG")
		allpins = pinSXG.keys()

		for (let i = 0; i < allpins.length; i++)
			if (pinSXG.get(allpins[i]) == uid)
				pin.push(allpins[i])
	}
	return pin
}


function JD_UserInfo(ck) {
	const data = {
		url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
		method: "get",
		dataType: "json",
		headers: {
			"User-Agent": "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
			"Cookie": ck
		}
	}
	return request(data)
}

function Get_QL_Token(host, client_id, client_secret) {
	try {
		let { body } = request({ url: host + "/open/auth/token?client_id=" + client_id + "&client_secret=" + client_secret })
		return JSON.parse(body).data
	}
	catch (err) {
		return null
	}
}

function Get_QL_Envs(host, token) {
	try {
		let { body } = request({
			url: host + "/open/envs",
			method: "get",
			headers: {
				accept: "application/json",
				Authorization: token.token_type + " " + token.token
			}
		})
		return JSON.parse(body).data
	}
	catch (err) {
		return null
	}
}