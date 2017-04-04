Meteor.publishComposite('categoryById', function(id) {
    var uid = this.userId;
    return {
        find: function() {
            return Category.find({_id:id}, {});
        }
    }
});