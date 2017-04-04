Template.pictureList.helpers({
	itemData:function(){
		var obj = Template.instance().data;
		return {
			src:this[obj.key],
			zip:obj.zip ? obj.zip : ("?x-oss-process=image/resize,m_lfit,w_375,limit_0/auto-orient,0/quality,q_90"),
			className:obj.className,
		}
	}
});
Template.pictureList.onRendered(function(){
	
});
Template.pictureList.events({
	"click .picture_loadding":function(){

		var obj = Template.instance().data;

		var arr = [];

		var items = obj.items;
		
		if(items.fetch){
			items = items.fetch();
		}

		for(var i = 0 ; i < items.length ; i++){
			arr.push(items[i][obj.key]);
		}

		wx.previewImage({
		    current: this.option.src, 
		    urls: arr
		});
	}
});

Template.pictureItem.helpers({
	random:function(){
		return Math.random();
	}
});
Template.pictureItem.onRendered(function(){
	// console.log(this);
	var src = this.data.option.src + "?" + this.data.option.zip;
	var img = new Image();
	var ct = this.$(".picture_loadding");
	img.onload = function(){
		ct.css({
			"background-image":("url("+src+")"),
		});
	}
	img.src = src;
});