Meteor.publishComposite('wxActiveById', function(id) {
    var uid = this.userId;
    return {
        find: function() {
            return WxActive.find({_id:id}, {});
        },
        children:[
        	{
        		find:function(active){
        			return WxActivePictures.find({active:active._id,status:true});
        		}
        	}
        ]
    }
});