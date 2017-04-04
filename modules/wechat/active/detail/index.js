Template.wxActiveDetail.onCreated(function() {
    loadding.show();
    this.subscribe("wxActiveById", FlowRouter.getQueryParam("id"), {
        onReady: function() {
            loadding.hide();
        }
    });
});


Template.wxActiveDetail.helpers({
    active: function() {
        return WxActive.findOne(FlowRouter.getQueryParam("id"));
    },
    target: function() {
        // console.log(framework.client.mobile + "/wx/active/detail?id=" + FlowRouter.getQueryParam("id"));
        return framework.client.mobile + "/wx/active/detail?id=" + FlowRouter.getQueryParam("id");
    },
    pictures: function() {
        return WxActivePictures.find({ active: FlowRouter.getQueryParam("id") }, { sort: { createdAt: -1 } });
    },
    needPwd: function() {
        var active = WxActive.findOne(FlowRouter.getQueryParam("id"));
        if (active) {
            if (active.pwd) {
                //以当前密码为准进行统计
                if (localStorage.getItem("WXACTIVE_" + active._id) != active.pwd) {
                    return true;
                }
            }
        }

        return false;
    },
    pwdInput: function(i) {
        var inputs = Session.get("wxActiveInputs");
        return (inputs && inputs[i]) ? inputs[i] : "-";
    }
});
Template.wxActiveDetail.events({
    "click .wxActive-camera": function() {
        FlowRouter.go("/wx/active/upload?id=" + FlowRouter.getQueryParam("id"))

    },
    "click .btn": function(event) {
            var target = $(event.currentTarget);
            var v = target.attr("data-for");
            var inputs = Session.get("wxActiveInputs") ? Session.get("wxActiveInputs") : [];
            if (v == "del") {
                inputs.pop();
            } else if (v == "sub") {
                var active = WxActive.findOne(FlowRouter.getQueryParam("id"));

                if (active.pwd == inputs.join("")) {
                    //将现在的密码存入缓存
                    localStorage.setItem("WXACTIVE_" + active._id, active.pwd);
                    $(".center-animate").removeClass("bounceIn").addClass("bounceOut");
                    $(".wxActiveDetail_Pwd").fadeOut(500, function() {
                        $(".wxActiveDetail_Pwd").remove();
                    });
                    //加入统计
                    Meteor.call("wxActiveRead", FlowRouter.getQueryParam("id"));
                } else {
                    $(".show").removeClass("shake").hide().addClass("shake").show();
                }

            } else {
                if (inputs.length < 4) {
                    inputs.push(v);
                }
            }
            Session.set("wxActiveInputs", inputs);

            return false;
        }

});

Template.wxActiveDetail.onRendered(function() {




    //设置页面分享信息
    Tracker.autorun(function() {

        var active = WxActive.findOne(FlowRouter.getQueryParam("id"));
        if (active) {

            //统计用户信息：若需要密码在输入密码时统计否则按浏览统计;发照片通过照片的记录WxActivePictures可以统计到。
            if (Meteor.userId() && !active.pwd) {
                Meteor.call("wxActiveRead", FlowRouter.getQueryParam("id"));
            }
            framework.wechat.share({
                title: active.name,
                desc: active.summary,
                thumb: active.thumb
            }, function() {
                WxActive.update({ _id: active._id }, { $inc: { share: 1 } })
            });


        }

    });


});
