Meteor.methods({
    testtime: function() {
        console.log("testtime");
    },
    wxLoginUrl: function(href) {

        var host = (href.indexOf("http://") > -1 ? "http://" : "https://") + href.replace("http://", "").replace("https://", "").split("/")[0];

        var arr = [];

        arr.push("https://open.weixin.qq.com/connect/oauth2/authorize?appid=");
        arr.push(framework.wechat.appid);
        arr.push("&redirect_uri=");
        arr.push(encodeURIComponent(host + "/_wechat/login"));
        arr.push("&response_type=code&scope=snsapi_userinfo&state=");
        arr.push(encodeURIComponent(href));
        arr.push("#wechat_redirect");


        return arr.join("");
    },
    signatureWechat: function(href) {
        var signobj = {
            jsapi_ticket: framework.wechat.ticket(),
            noncestr: CryptoJS.MD5(Math.random() + "").toString(),
            timestamp: Math.floor(Date.now() / 1000),
            url: href,
        }

        var signstr = json2query(signobj);

        signobj.signature = CryptoJS.SHA1(signstr).toString();
        signobj.appId = framework.wechat.appid;

        return signobj;
    },
});

