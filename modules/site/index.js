Template.dfSite.onRendered(function(){
	framework.wechat.share({
		title:framework.title,
		desc:framework.desc,
	},function(){
		console.log("share is send");
	});
});