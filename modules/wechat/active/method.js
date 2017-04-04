Meteor.methods({
    "wx.acitve.list.byCategory": function(args) {


        //查询分类是几级的

        var category = Category.findOne({_id:args.category});

        if(!category){
            console.log("no category:" + args.category);
            return false;
        }
        // var objs = WxMedia.find({status:true,category:{$in}},{sort:{orderBy:-1,updatedAt:-1}}).fetch();

        var category_children = [];

        var actives = [];

        if(category.parent == "root"){
            //一级分类
            category_children = Category.find({parent:category._id}).fetch();

            var category_children_ids = [];

            for(var i = 0 ; i < category_children.length ; i++){

                category_children_ids.push(category_children[i]._id);
            }

            actives = WxActive.find({status:true,recommend:true,category:{$in:category_children_ids}},{sort:{orderBy:-1,updatedAt:-1}}).fetch();
        }else{
            //二级分类
            category_children = Category.find({parent:category.parent}).fetch();

             actives = WxActive.find({status:true,category:category._id},{sort:{orderBy:-1,updatedAt:-1}}).fetch();
        }


        return {
            category:category,
            children:category_children,
            actives:actives
        }
    },
    wxActiveRead:function(acitveId){

        var user = Meteor.users.findOne(this.userId);
        if(!user){
            return false;
        }
        
        var wau = WxActiveUsers.findOne({userid:user._id,active:acitveId});
        if(!wau){
            console.log("wxActiveRead:" + acitveId + "|" + user._id);
            WxActiveUsers.insert({userid:user._id,active:acitveId,createdAt:new Date()});
        }
    }
});