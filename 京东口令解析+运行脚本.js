/**
* @author 爱码者说
* @create_at 2022-09-09 10:32:51
* @description 防止失恋，关注（https://t.me/iCoderSay），解析京东口令并根据ql spy配置的内容，自动运行相应的jd脚本。
* @version v1.0.0
* @title 京东口令解析+运行脚本
* @platform qq wx tg pgm web cron
* @rule [\s\S]*[(|)|#|@|$|%|¥|￥|!|！]([0-9a-zA-Z]{12,14})[(|)|#|@|$|%|¥|￥|!|！][\s\S]*
* @rule [\s\S]*[(|)|#|@|$|%|¥|￥|!|！]([0-9a-zA-Z]{10})[(|)|#|@|$|%|¥|￥|!|！][\s\S]*
* @rule jx ?
* @priority 6666666
* @cron 0 20 8 8 *
* @admin false
*/

//sender
const s = sender
const jd_command = new Bucket("jd_command")
const qinglong = new Bucket("qinglong");
const jd_cookie = new Bucket("jd_cookie");

var api = jd_command.get("api", "") // 对机器人发送指令 set jd_command api http://ip:port/jd/jKeyCommand?key=
var filters = [{
    'reg': RegExp(/https:\/\/cjhydz-isv.isvjcloud.com\/wxTeam\/activity/),
    'msg': "CJ组队瓜分变量】",
    'env': "jd_cjhy_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxTeam\/activity/),
    'msg': "【LZ组队瓜分变量】",
    'env': "jd_zdjr_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/cjhydz-isv.isvjcloud.com\/microDz\/invite\/activity\/wx\/view\/index/),
    'msg': "【微定制瓜分变量】",
    'env': "jd_wdz_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkj-isv.isvjd.com\/wxCollectionActivity\/activity2/),
    'msg': "【M加购任务变量】",
    'env': "M_WX_ADD_CART_URL",
    'type': 'url'
},
{
    'reg': RegExp(/https:\/\/cjhy-isv.isvjcloud.com\/wxDrawActivity\/activity\/867591/),
    'msg': "【M转盘抽奖变量】",
    'env': "LUCK_DRAW_URL",
    'type': 'url'
},
{
    'reg': RegExp(/cjwx\/common\/entry.html/),
    'msg': "【M转盘抽奖变量】",
    'env': "LUCK_DRAW_URL",
    'type': 'url'
},
{
    'reg': RegExp(/https:\/\/lzkj-isv.isvjcloud.com\/wxgame\/activity/),
    'msg': "【通用游戏变量】",
    'env': "WXGAME_ACT_ID",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxShareActivity/),
    'msg': "【Kr分享有礼变量】",
    'env': "jd_wxShareActivity_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxSecond/),
    'msg': "【读秒变量】",
    'env': "jd_wxSecond_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/jinggengjcq-isv.isvjcloud.com/),
    'msg': "【大牌联合开卡变量】",
    'env': "DPLHTY",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxCartKoi\/cartkoi/),
    'msg': "【购物车鲤鱼变量】",
    'env': "jd_wxCartKoi_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxCollectCard/),
    'msg': "【集卡抽奖变量】",
    'env': "jd_wxCollectCard_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkj-isv.isvjd.com\/drawCenter/),
    'msg': "【LZ刮刮乐抽奖变量】",
    'env': " jd_drawCenter_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxFansInterActionActivity/),
    'msg': "【LZ粉丝互动变量】",
    'env': "jd_wxFansInterActionActivity_activityId",
    'type': 'id'
},
{
    'reg': RegExp(/https:\/\/prodev.m.jd.com\/mall\/active\/dVF7gQUVKyUcuSsVhuya5d2XD4F/),
    'msg': "【邀请好友赢大礼变量】",
    'env': "jd_inv_authorCode",
    'type': 'code'
},
{
    'reg': RegExp(/https:\/\/lzkj-isv.isvjcloud.com\/wxShopFollowActivity/),
    'msg': "【关注抽奖变量】",
    'env': " jd_wxShopFollowActivity_activityId",
    "type": 'id'
},
{
    'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxUnPackingActivity/),
    'msg': "【让福袋飞通用活动变量】",
    'env': "jd_wxUnPackingActivity_activityId",
    "type": 'id'
},
{
    'reg': RegExp(/https:\/\/lzkj-isv.isvjcloud.com\/wxDrawActivity\/activity/),
    'msg': "【店铺抽奖 · 超级无线】",
    'env': " LUCK_DRAW_URL",
    "type": 'url'
},
{
    'reg': RegExp(/https:\/\/lzdz-isv.isvjcloud.com\/categoryUnion\/activity/),
    'msg': "【品类联合】",
    'env': "jd_categoryUnion_activityId",
    "type": 'id'
},
{
    'reg': RegExp(/https:\/\/lzdz1-isv.isvjcloud.com\/dingzhi\/joinCommon/),
    'msg': "通用开卡-joinCommon系列",
    'env': "jd_joinCommonId",
    "type": 'id&shopId'
}
];
var headers = {
    "User-Agent": "Mozilla/5.0 (Linux; U; Android 11; zh-cn; KB2000 Build/RP1A.201005.001) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Safari/537.36 HeyTapBrowser/40.7.19.3 uuid/cddaa248eaf1933ddbe92e9bf4d72cb3",
    "Content-Type": "application/json;charset=utf-8",
};
var reg = RegExp(/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/);

function GetRequest(urlStr) {
    if (typeof urlStr == "undefined") {
        // 获取url中"?"符后的字符串
        var url = decodeURI(location.search);
    } else {
        url = "?" + urlStr.split("?")[1];
    }
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(
                strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


function main() {
    var jcode = s.getContent();
    if (reg.exec(jcode)) {
        var urlStr = jcode.match(reg)[0];
        var title = "京东活动";
        var Name = GetUsername();
        var Img = "https://c2cpicdw.qpic.cn/offpic_new/56794501//56794501-1551249874-8DA68415682CE9508B9FEED6FA49DFA1/0?term=255";
    } else {
        if (!api) {
            s.reply("未配置api ，请给机器人发送命令“set jd_decode api http://ip:port/jd/jKeyCommand")
            return;
        }
        var { body } = request({
            url: encodeURI(api + "?key=" + jcode),
            headers: headers,
            method: "post",
            dataType: "json",
        });
        if (body.code == 200) {
            urlStr = body.data.jumpUrl;
            title = body.data.title;
            Name = body.data.userName;
            Img = body.data.img;
        } else {
            s.reply("【爱码者说】提醒：暂无接口请求权限：" + JSON.stringify(body))
        }
    }
    s.reply("正在解析请稍候……");
    var activateId = urlStr.replace(/.*\?activityId\=([^\&]*)\&?.*/g, "$1")
    var code = urlStr.replace(/.*\?code\=([^\&]*)\&?.*/g, "$1");
    var shopId = urlStr.replace(/.*\&shopid\=([^\&]*)/g, "$1");

    var conmand = false;
    for (var i = 0; i < filters.length; i++) {
        let filter = filters[i];
        if (filter.reg.exec(urlStr)) {
            conmand = true

            let before_env = filter.env.trim()
            switch (filter.type) {
                case 'id':
                    filter.env = 'export ' + filter.env + '="' + activateId + '"';
                    break;
                case 'url':
                    filter.env = 'export ' + filter.env + '="' + urlStr + '"';
                    break;
                case 'code':
                    filter.env = 'export ' + filter.env + '="' + code + '"';
                    break;
                case 'id&shopId':
                    filter.env = 'export ' + filter.env + '="' + activateId + "&" + shopId + '"';
                    break
            }

            var content = "【发  起  人】：" + body.data.userName + "\n \n【活动名称】：" + body.data.title + "\n \n【活动地址】：" + body.data.jumpUrl + "\n \n 洞察变量-" + filter.msg + "\n " + filter.env
            s.reply(content)
            let env_script = searchScriptByEnv(before_env)
            if(!env_script){
                s.reply("请先执行 ql spy 命令，配置后再执行脚本")
            }
            replaceOrAddConfig(before_env, filter.env)
            runScript(before_env)
            break;
        }
    }
    if (!conmand) {
        s.reply("【发  起  人】：" + body.data.userName + "\n \n【活动名称】：" + body.data.title + "\n \n【活动地址】：" + body.data.jumpUrl + "\n \n洞察变量-无")
    }

}

function getQltoken() {
    let ql_json = qinglong.get("QLS", "");
    var ql_data = JSON.parse(ql_json);
    var ql_total = ql_data.length;
    if (!ql_total) {
        s.reply("你没有配置青龙，请先发【青龙管理】配置后再来。");
        return;
    }
    
    //青龙参数
    let ql_ipport = ql_data[0].host;
    let client_id = ql_data[0].client_id;
    let client_secret = ql_data[0].client_secret;

    var { body } = request({
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
    console.log(JSON.stringify(body))
    let token = body.data.token;
    return token
}

function getQlipport() {
    let ql_json = qinglong.get("QLS", "");
    var ql_data = JSON.parse(ql_json);

    //青龙参数
    let ql_ipport = ql_data[0].host;
    return ql_ipport
}

function getAllScripts() {
    let ql_ipport = getQlipport()
    let token = getQltoken()
    var url = ql_ipport + "/open/crons?searchValue=&t=" + Date.now();
    var crons_data = request({
        url: url,
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + token,
        },
    });
    var crons_body = crons_data.body
    let cronsBody = JSON.parse(crons_body)

    var crons = cronsBody.data
    return crons
}

function searchScriptByEnv(env) {
    let env_listens = JSON.parse(jd_cookie.get("env_listens"))

    for (let i = 0; i < env_listens.length; i++) {
        let env_listen = env_listens[i]
        let envs = env_listen.Envs
        for (let j = 0; j < envs.length; j++) {
            let env_item = envs[j]
            if (env == env_item) {
                //需要运行的脚本
                let key_word = env_listen.Keyword
                console.log(key_word)
                return key_word
            }
        }
    }
    return ""
}

function runScript(before_env) {
    let ql_ipport = getQlipport()
    let token = getQltoken()
    var url = ql_ipport + "/open/crons/run?t=" + Date.now();
    let env_script = searchScriptByEnv(before_env)
    let allScript = getAllScripts()

    let ids = []
    var choose_script
    for (let i = 0; i < allScript.length; i++) {
        let script_obj = allScript[i]
        let command = script_obj.command
        let command_last = command.split("/")[1]

        if (env_script == command_last) {
            choose_script = script_obj
            id = script_obj._id
            ids.push(id)
            break
        }
    }
    if (ids.length == 0) s.reply(`未发现${env_script}脚本,请查验`)

    var {body} = request({
        url: url,
        method: "put",
        body: JSON.stringify(ids),
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });
    console.log(body)
    if (JSON.parse(body).code == 200) {

        s.reply(`${choose_script.name}🐉已自动运行`)
    }
}

function getAllConfig() {
    let ql_ipport = getQlipport()
    let token = getQltoken()
    var url = ql_ipport + "/open/configs/config.sh?searchValue=&t=" + Date.now();
    var config_data = request({
        url: url,
        method: "get",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + token,
        },
    });
    var config = JSON.parse(config_data.body).data
    // console.log(config)
    return config
}

function replaceOrAddConfig(before_env, after_env) {
    var pattner = 'export\\s*' + before_env + '\s*=\s*"(.+?)"'
    let reg = RegExp(pattner, 'g')
    var allConfig = getAllConfig()

    let result = reg.exec(allConfig)
    if (result) {
        let needReplace = result[0].toString()
        allConfig = allConfig.replace(needReplace, after_env)
    } else {
        allConfig = addConfig + "\n" + after_env
    }
    updateConfig(allConfig)
}


function updateConfig(allConfig) {
    let ql_ipport = getQlipport()
    let token = getQltoken()
    var url = ql_ipport + "/open/configs/save?t=" + Date.now();
    let body = JSON.stringify({
        "content": allConfig,
        "name": "config.sh"
    });
    var update_data = request({
        url: url,
        method: "post",
        body: body,
        dataType: "json",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });
    let update = update_data.body
    if (update.code == 200) {
        s.reply("变量更新成功")
    }
}

main()