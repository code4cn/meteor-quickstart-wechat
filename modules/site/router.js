FlowRouter.route('/', {
    name: "site",
    action: function(params, queryParams) {
    	if(framework.template.siteLayout){
    		BlazeLayout.render(framework.template.siteLayout, { content: framework.template.site })
    	}else{
    		BlazeLayout.render(framework.template.site);
    	}
        
    }
});