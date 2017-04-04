var group_wxMenus = FlowRouter.group({ name: "wxMenusGroup", prefix: "/wx/menus" });

group_wxMenus.route('/', { name: "wxMenus", action: function(params, queryParams){ 

    BlazeLayout.render("wxMenus") 
} });
