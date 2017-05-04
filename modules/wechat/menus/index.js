Template.wxMenus.onCreated(function() {
    this.subscribe("wxMenus");
});
Template.wxMenus.helpers({
   menus:function(parent){
   	 var menus = WxMenu.find({parent:parent},{sort:{orderBy:1}}).fetch();
   	return menus.length > 0 ? menus : false;
   }
});
Template.wxMenus.events({
   "click .has-chlidren":function(event){
   		var target = $(event.currentTarget)
   	
   		if(target.hasClass("show-children")){
   			target.removeClass("show-children");
   		}else{
   			$(".show-children").removeClass("show-children");
   			target.addClass("show-children");
   		}
   		
   }	
});
Template.wxMenus.onRendered(function() {

});
