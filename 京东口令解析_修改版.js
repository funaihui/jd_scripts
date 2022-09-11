/**
* @author 爱码者说
* @create_at 2022-09-09 10:32:51
* @description 解析京东口令，自动生成青龙脚本的环境变量。
* @version v1.0.0
* @title 京东口令解析_修改版
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
        'env': " jd_wdz_activityId",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/lzkj-isv.isvjd.com\/wxCollectionActivity\/activity2/),
        'msg': "【M加购任务变量】",
        'env': " M_WX_ADD_CART_URL",
        'type': 'url'
    },
    {
        'reg': RegExp(/https:\/\/cjhy-isv.isvjcloud.com\/wxDrawActivity\/activity\/867591/),
        'msg': "【M转盘抽奖变量】",
        'env': " LUCK_DRAW_URL",
        'type': 'url'
    },
    {
        'reg': RegExp(/cjwx\/common\/entry.html/),
        'msg': "【M转盘抽奖变量】",
        'env': " LUCK_DRAW_URL",
        'type': 'url'
    },
    {
        'reg': RegExp(/https:\/\/lzkj-isv.isvjcloud.com\/wxgame\/activity/),
        'msg': "【通用游戏变量】",
        'env': " WXGAME_ACT_ID",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxShareActivity/),
        'msg': "【Kr分享有礼变量】",
        'env': " jd_wxShareActivity_activityId",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxSecond/),
        'msg': "【读秒变量】",
        'env': " jd_wxSecond_activityId",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/jinggengjcq-isv.isvjcloud.com/),
        'msg': "【大牌联合开卡变量】",
        'env': " DPLHTY",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxCartKoi\/cartkoi/),
        'msg': "【购物车鲤鱼变量】",
        'env': " jd_wxCartKoi_activityId",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/lzkjdz-isv.isvjcloud.com\/wxCollectCard/),
        'msg': "【集卡抽奖变量】",
        'env': " jd_wxCollectCard_activityId",
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
        'env': " jd_wxFansInterActionActivity_activityId",
        'type': 'id'
    },
    {
        'reg': RegExp(/https:\/\/prodev.m.jd.com\/mall\/active\/dVF7gQUVKyUcuSsVhuya5d2XD4F/),
        'msg': "【邀请好友赢大礼变量】",
        'env': " jd_inv_authorCode",
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
        'env': " jd_wxUnPackingActivity_activityId",
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
        'env': " jd_categoryUnion_activityId",
        "type": 'id'
    },
    {
        'reg': RegExp(/https:\/\/lzdz1-isv.isvjcloud.com\/dingzhi\/joinCommon/),
        'msg': "通用开卡-joinCommon系列",
        'env': " jd_joinCommonId",
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
        var {body} = request({
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
        }else{
            s.reply("【爱码者说】提醒：暂无接口请求权限："+JSON.stringify(body))
        }
    }
    s.reply("正在解析请稍候……");
    var activateId = urlStr.replace(/.*\?activityId\=([^\&]*)\&?.*/g, "$1")
    var code = urlStr.replace(/.*\?code\=([^\&]*)\&?.*/g, "$1");
    var shopId = urlStr.replace(/.*\&shopid\=([^\&]*)/g, "$1");
    
    var conmand =false;
    for (var i = 0; i < filters.length; i++) {
        let filter = filters[i];
        if (filter.reg.exec(urlStr)) {
            conmand=true
            switch (filter.type) {
                case 'id':
                    filter.env = 'export '+filter.env+'="' + activateId+'"';
                    break;
                case 'url':
                    filter.env =  'export '+filter.env+'="' + urlStr+'"';
                    break;
                case 'code':
                    filter.env = 'export '+filter.env+'="' + code+'"';
                    break;
                case 'id&shopId':
                    filter.env = 'export '+filter.env+'="' + activateId+"&"+shopId+'"';
                break
            }
            var content = "【发  起  人】：" + body.data.userName + "\n \n【活动名称】：" + body.data.title + "\n \n【活动地址】："+body.data.jumpUrl + "\n \n 洞察变量-" + filter.msg + "\n " + filter.env
            s.reply(content)
            break;
        }
    }
    if (!conmand) {
        s.reply("【发  起  人】：" + body.data.userName + "\n \n【活动名称】：" + body.data.title + "\n \n【活动地址】："+body.data.jumpUrl+"\n \n洞察变量-无")
    }

}
main()