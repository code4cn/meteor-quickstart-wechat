var group_wxActive = FlowRouter.group({ name: "wxActiveGroup", prefix: "/wx/active" });

group_wxActive.route('/', { name: "wxActive", action: function(params, queryParams){ 
    BlazeLayout.render("wxActive") 
} });
group_wxActive.route('/detail', { name: "wxActiveDetail", action: function(params, queryParams){ 
   BlazeLayout.render("wxActiveDetail") 
} });
group_wxActive.route('/upload', { name: "wxActiveUpload", action: function(params, queryParams){ 
   BlazeLayout.render("wxActiveUpload") 
} });

group_wxActive.route('/declaration', { name: "wxActiveDeclaration", action: function(params, queryParams){ 
   BlazeLayout.render(framework.wechat.declaration) 
} });
