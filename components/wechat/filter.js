// import wx from 'jweixin';

FlowRouter.triggers.enter([function(context, redirect) {
    //授权登录
    if (!Meteor.userId()) {
        Meteor.call("wxLoginUrl", window.location.href, function(err, res) {
            window.location.href = res;
        });
        return false;
    }
    //页面签名
    Meteor.call("signatureWechat", window.location.href, function(err, obj) {
        if (Meteor.isWx) {
            wx.config({
                debug: framework.wechat.debug,
                appId: obj.appId,
                timestamp: obj.timestamp,
                nonceStr: obj.noncestr,
                signature: obj.signature,
                jsApiList: [
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareQZone",
                    "onMenuShareWeibo",
                    "chooseWXPay",
                    "openLocation",
                    "previewImage",
                    "getLocation",
                    "scanQRCode",
                    "addCard",
                    "chooseCard",
                    "openCard",
                ]
            });
        }

        wx.ready(function() {
        	wx.isReady = true;
        	console.log("wx-ready");
        });
        wx.error(function() {
        	wx.isReady = true;
        	console.log("wx-error");
        });
    });
}], { except: ["wechatLogin"] });
