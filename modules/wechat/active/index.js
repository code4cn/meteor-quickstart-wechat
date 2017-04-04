Template.wxActive.onCreated(function() {

    // this.subscribe("categoryById",FlowRouter.getQueryParam("id"),{onReady:function(){}});
});
Template.wxActive.helpers({
    category: function() {
        var obj = Session.get("wx.acitve.list.byCategory");
        if (obj) {
            return obj.category;
        }
    },
    children: function() {
        var obj = Session.get("wx.acitve.list.byCategory");
        if (obj) {
            return obj.children;
        }
    },
    actives: function() {
        var obj = Session.get("wx.acitve.list.byCategory");
        if (obj) {
            return obj.actives;
        }
    }
});
Template.wxActive.events({
    "click .item": function(event) {

        var target = $(event.currentTarget);

        loadding.show();

        Meteor.call("wx.acitve.list.byCategory", { category: target.attr("data-for") }, function(err, res) {
            Session.set("wx.acitve.list.byCategory", res);
            loadding.hide();
        })
    }
});
Template.wxActive.onRendered(function() {

    loadding.show();

    Meteor.call("wx.acitve.list.byCategory", { category: FlowRouter.getQueryParam("id") }, function(err, res) {

        Session.set("wx.acitve.list.byCategory", res);

        loadding.hide();

        //设置页面分享信息
        framework.wechat.share({
            title: res.category.name,
            desc: res.category.summary,
            thumb: res.category.thumb
        }, function() {
            Category.update({ _id: res.category._id }, { $inc: { share: 1 } })
        });
    })



});
