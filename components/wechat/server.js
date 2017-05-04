Meteor.startup(function() {
    if (wxaccesstoken.find().count() == 0) {
        wxaccesstoken.insert({});
    }
    if (wxticket.find().count() == 0) {
        wxticket.insert({});
    }
});

Accounts.registerLoginHandler('login', function(loginRequest) {

    //第二步：通过code换取网页授权access_token

    var result_step2 = HTTP.get("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + framework.wechat.appid + "&secret=" + framework.wechat.secret + "&code=" + loginRequest.code + "&grant_type=authorization_code");

    if (result_step2.statusCode == 200 && result_step2.content) {

        var json_step2 = JSON.parse(result_step2.content);

        //console.log(json_step2);

        /*
        { 
            access_token: 'TF5RnqZe92z2l2ndCX8KqM_cTHQnr8bvJljFYbms0Ax1NjhMsn09sOiH49AK8mrhMyTXBH-4r6gaMUSt8JEBByFsCKeiPji1qgEBQyu46L0',
            expires_in: 7200,
            refresh_token: 's74-WHrqReBIfsyj2Nnv_dESPKArnKEobiFjdXuhW8t_rW5Y3KilLLRO78pi2XhhPDSvi3l6ICsHlP_fCRlV6o7boGGfpFZLilRrRsVQ0cM',
            openid: 'oV3HVwMLhWHmQYBSMaqsWQeeVq4I',
            scope: 'snsapi_userinfo' 
        }
        */

        //第四步：拉取用户信息(需scope为 snsapi_userinfo)

        var result_step4 = HTTP.get("https://api.weixin.qq.com/sns/userinfo?access_token="+json_step2.access_token+"&openid="+framework.wechat.appid+"&lang=zh_CN");

        if (result_step4.statusCode == 200 && result_step4.content) {

            var json_step4 = JSON.parse(result_step4.content);

            // console.log(json_step4);
            /*
            {
               "openid":" OPENID",
               " nickname": NICKNAME,
               "sex":"1",
               "province":"PROVINCE"
               "city":"CITY",
               "country":"COUNTRY",
                "headimgurl":    "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46", 
                "privilege":[
                "PRIVILEGE1"
                "PRIVILEGE2"
                ],
                "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"
            }
            */

            //判断用户是否存在
            var user = Meteor.users.findOne({$or:[
                    { "profile.openid": json_step2.openid },
                    { "profile.unionid": json_step2.unionid }
                ]});
            var userId = "";
            if (user) {
                //如果存在则更新
                Meteor.users.update({_id:user._id},{$set:{
                    "profile.openid":json_step2.openid,
                    "profile.unionid":json_step2.unionid ? json_step2.unionid : false,
                    "profile.avatar": json_step4.headimgurl,
                    "profile.balance": 0,
                    "profile.point": 0,
                    "profile.nickname": json_step4.nickname,
                    "profile.sex": json_step4.sex,
                    "profile.language": json_step4.language,
                    "profile.province": json_step4.province,
                    "profile.city": json_step4.city,
                    "profile.country": json_step4.country,
                    "tmp":false,
                }});
                //查询当前OPENID是否在列表内
                // if(user.profile && user.profile.openid){
                //     Meteor.users.update({_id:user._id},{$addToSet:{"profile.openid":json_step2.openid}});
                // }else{
                //     Meteor.users.update({_id:user._id},{$set:{"profile.openid":[json_step2.openid]}});
                // }
                //返回登录信息
                userId = user._id;
            } else {
                //不存在则新建
                userId = Meteor.users.insert({
                    porfile:{
                        "openid":json_step2.openid,
                        "unionid":json_step2.unionid ? json_step2.unionid : false,
                        "avatar": json_step4.headimgurl,
                        "balance": 0,
                        "point": 0,
                        "nickname": json_step4.nickname,
                        "sex": json_step4.sex,
                        "language": json_step4.language,
                        "province": json_step4.province,
                        "city": json_step4.city,
                        "country": json_step4.country,
                        "tmp":false,
                    },
                    "type":"wechat"
                });
            }
            return {userId:userId};

        }
    }

    throw new Meteor.Error(403, "登录错误");
    return {};
});
