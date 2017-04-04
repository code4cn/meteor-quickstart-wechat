var group_wxMedia = FlowRouter.group({ name: "wxMediaGroup", prefix: "/wx/media" });

group_wxMedia.route('/', { name: "wxMedia", action: function(params, queryParams){ 

    BlazeLayout.render("wxMedia") 
} });
