Template.wxMedia.onCreated(function() {

   // this.subscribe("categoryById",FlowRouter.getQueryParam("id"),{onReady:function(){}});
});
Template.wxMedia.helpers({
    category:function(){
        var obj = Session.get("wx.media.list.byCategory");
        if(obj){
            return obj.category;
        }
    },
    children:function(){
        var obj = Session.get("wx.media.list.byCategory");
        if(obj){
            return obj.children;
        }
    },
    medias:function(){
        var obj = Session.get("wx.media.list.byCategory");
        if(obj){
            return obj.medias;
        }
    },
    fixRd:function(url){
        return url ? url.replace("#rd","#") : "";
    }
});
Template.wxMedia.events({
    "click .item": function(event) {

        var target = $(event.currentTarget);
    
       loadding.show();

        Meteor.call("wx.media.list.byCategory",{category:target.attr("data-for")},function(err,res){
            Session.set("wx.media.list.byCategory",res);
            loadding.hide();
        })
    },
    "click .weui-media-box":function(event){

        loadding.show();

        var target = $(event.currentTarget);

        Meteor.call("wx.media.count.open",this._id,function(err,res){
           
            window.location.href = target.attr("data-href")
        })
    }
});
Template.wxMedia.onRendered(function() {
    
    loadding.show();

    Meteor.call("wx.media.list.byCategory",{category:FlowRouter.getQueryParam("id")},function(err,res){

        Session.set("wx.media.list.byCategory",res);

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
