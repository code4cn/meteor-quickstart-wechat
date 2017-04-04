framework = {
    logo: " FAMI<b>2</b>U",
    title: "连接技术与商业，释放开发者生产力。",
    desc: "",
    keyword: "",
    notFound: "http://image.fami2u.com/ghost/404.png",
    client: {
        www: "",
        wechat: "",
        dashboard: "",
    },
    template: {
        site: "dfSite",
        notFound: "dfNotFound"
    },
    oss: {
        accessid: 'xxxxxxxx',
        accesskey: 'xxxxxxxxxxxxxx',
        dir: "xxxxx",
        bucket: "xxxxxx",
        region: 'xxxxxxxxx',
        cdn: 'xxxxxxxxxxxxx',
    },
    wechat: {
        debug:false,
        appid: "",
        secret: "",
        mchid: "",
        developer: "",
        partnerKey: "",
        //setup in /packages/framework/components/wechat/server.js
        token: function() {

            var ack = wxaccesstoken.findOne({ expiresAt: { $gt: (Math.floor(Date.now() / 1000)) } });

            if (ack) {
                return ack.token;
            } else {
                var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + framework.wechat.appid + '&secret=' + framework.wechat.secret;
                // console.log(url);
                var response = Meteor.http.get(url);

                if (response.statusCode === 200) {
                    wxaccesstoken.update({}, {
                        token: response.data.access_token,
                        expiresAt: (Math.floor(Date.now() / 1000) + 7200)
                    });
                    return response.data.access_token;
                } else {
                    console.log("accesstoken error");
                    return false;
                }
            }
        },
        ticket: function() {
            var token = framework.wechat.token();
            if (token) {
                var wt = wxticket.findOne({ expiresAt: { $gt: (Math.floor(Date.now() / 1000)) } });

                if (wt) {
                    return wt.ticket;
                } else {
                    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi';

                    var response = Meteor.http.get(url);

                    if (response.statusCode === 200) {
                        wxticket.update({}, {
                            ticket: response.data.ticket,
                            expiresAt: Math.floor(Date.now() / 1000 + 7200)
                        });
                        return response.data.ticket;
                    } else {
                        console.log("ticket error");
                        return false;
                    }
                }
            }
        },
        share: function(args, callback) {

            if (wx.isReady) {
                var shareObj = {
                    title: args.title, // 分享标题
                    desc: args.desc, // 分享描述
                    link: args.url ? args.url : window.location.href, // 分享链接
                    imgUrl: args.thumb ? args.thumb : framework.client.wechat + "/logo.png", // 分享图标
                    success: function() {
                        callback();
                    },
                    cancel: function() {
                        console.log("share:cancel");
                    }
                };
                wx.onMenuShareAppMessage(shareObj);
                wx.onMenuShareTimeline(shareObj);
                wx.onMenuShareQQ(shareObj);
                wx.onMenuShareQZone(shareObj);
                wx.onMenuShareWeibo(shareObj);
                console.log("wx-share");
                console.log(shareObj);
            } else {
                console.log("wx-wait");
                window.setTimeout(function(){

                    framework.wechat.share(args,callback);
                },1000);
            }
        },
        service: function(openid, data) {},
        //setup in /packages/framework/components/wechat/server.js
        regist: function(args) {

            framework.wechat.appid = args.appid;
            framework.wechat.secret = args.secret;
            framework.wechat.mchid = args.mchid;
            framework.wechat.developer = args.developer;
            framework.wechat.partnerKey = args.partnerKey;
            framework.wechat.apiToken = args.apiToken;
            framework.wechat.EncodingAESKey = args.EncodingAESKey;

            console.log("wechat service registed!");
        },
        //setup in /packages/framework/modules/active/router.js
        declaration: "wxActiveDeclaration",
    },
    robot: {
        key: "",
    }
}
