
Meteor.methods({
    "wx.media.list.byCategory": function(args) {


        //查询分类是几级的

        var category = Category.findOne({_id:args.category});
        if(!category){
            console.log("no category:" + args.category);
            return false;
        }
        // var objs = WxMedia.find({status:true,category:{$in}},{sort:{orderBy:-1,updatedAt:-1}}).fetch();

        var category_children = [];

        var medias = [];

        if(category.parent == "root"){
            //一级分类
            category_children = Category.find({parent:category._id}).fetch();

            var category_children_ids = [];

            for(var i = 0 ; i < category_children.length ; i++){

                category_children_ids.push(category_children[i]._id);
            }

            medias = WxMedia.find({status:true,recommend:true,category:{$in:category_children_ids}},{sort:{orderBy:-1,updatedAt:-1}}).fetch();
        }else{
            //二级分类
            category_children = Category.find({parent:category.parent}).fetch();

             medias = WxMedia.find({status:true,category:category._id},{sort:{orderBy:-1,updatedAt:-1}}).fetch();
        }



        return {
            category:category,
            children:category_children,
            medias:medias
        }
    },
    "wx.media.count.open":function(id){
        WxMedia.update({_id:id},{$inc:{open:1}});

        if(this.userId){
            WxMediaOpener.insert({
                userid:this.userId,
                media:id,
                createdAt:new Date(),
            });
        }

    }
});