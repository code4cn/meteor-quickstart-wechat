Template.wxActiveUpload.helpers({
    active: function() {
        return {
            _id: FlowRouter.getQueryParam("id")
        }
    }
});
Template.wxActiveUpload.events({
    "click #upload": function(event) {
        var pics = $(".weui-uploader__file");
        var imgs = [];
        for (var i = 0; i < pics.length; i++) {
            var obj = $(pics[i])
            if (obj.hasClass("weui-uploader__file_statu")) {
                toastr.error("图片正在上传期稍后");
                return false;
            }
            imgs.push(obj.attr("data-src"));
        }
        // console.log(imgs);
        for (var i = 0; i < imgs.length; i++) {
            WxActivePictures.insert({
                active: FlowRouter.getQueryParam("id"),
                userid: Meteor.userId(),
                createdAt: new Date(),
                url: imgs[i],
                status: true,
            });
        }
        FlowRouter.go("/wx/active/detail?id=" + FlowRouter.getQueryParam("id"));

    },
    "change #uploaderInput": function(event) {
        var id = this.id;
        var target = event.currentTarget;




        for (var i = 0; i < target.files.length; i++) {

            _active_uploader.upload(target.files[i]);
        }

    }
});
_active_uploader = {
    upload: function(tfile) {

        var thumbs = $("#uploaderFiles");

        lrz(tfile, { width: 100 })
            .then(function(rst) {
                EXIF.getData(tfile, function() {
                    var extf = EXIF.getAllTags(this);
                    extf.userid = Meteor.userId()
                    var imgId = Images.insert(extf);

                    var picItem = $("<li></li>")
                        .addClass("weui-uploader__file")
                        .addClass("weui-uploader__file_statu")
                        .addClass("animated")
                        .addClass("bounceIn")
                        .css({ backgroundImage: "url(" + rst.base64 + ")" })
                        .attr("title", "点击取消")
                        .append($('<div class="weui-uploader__file-content"><i class="fa fa-cloud-upload"></i></div>'))
                        .appendTo(thumbs).click(function() {
                            picItem.remove();
                            $(".weui-uploader__info").html(($(".weui-uploader__file").size() - $(".weui-uploader__file_statu").size()) + "/" + $(".weui-uploader__file").size());
                        });

                    $(".weui-uploader__info").html(($(".weui-uploader__file").size() - $(".weui-uploader__file_statu").size()) + "/" + $(".weui-uploader__file").size());


                    Meteor.call("framework.ossSign", function(err, res) {

                        var key = res.dir + "/" + imgId;
                        key = encodeURI(key, "UTF-8");

                        // console.log(tfile);

                        var request = new FormData();
                        request.append('OSSAccessKeyId', res.accessid);
                        request.append('policy', res.policy);
                        request.append('signature', res.signature);
                        request.append('key', key);
                        request.append('file', tfile);
                        request.append('submit', "Upload to oss");

                        $.ajax({
                            url: res.host,
                            data: request,
                            processData: false,
                            async: false,
                            cache: false,
                            contentType: false,
                            //关键是要设置contentType 为false，不然发出的请求头 没有boundary
                            //该参数是让jQuery去判断contentType
                            type: "POST",
                            success: function(data, textStatus, request) {
                                var cdnUrl = res.cdn + "/" + res.dir + "/" + imgId;
                                picItem.attr("data-src", cdnUrl)
                                    .removeClass("weui-uploader__file_statu")
                                    .find("div")
                                    .remove();
                                $(".weui-uploader__info").html(($(".weui-uploader__file").size() - $(".weui-uploader__file_statu").size()) + "/" + $(".weui-uploader__file").size());
                            },
                            error: function(XMLHttpRequest, textStatus, errorThrow) {
                                toastr.error("图片上传错误:" + rst.origin.imgId);
                                picItem.remove();
                                $(".weui-uploader__info").html(($(".weui-uploader__file").size() - $(".weui-uploader__file_statu").size()) + "/" + $(".weui-uploader__file").size());
                            },

                        });



                    })
                })

            })
            .catch(function(err) {
                // 处理失败会执行
                toastr.error("图片上传错误", err);
                $(".weui-uploader__info").html(($(".weui-uploader__file").size() - $(".weui-uploader__file_statu").size()) + "/" + $(".weui-uploader__file").size());

            })
            .always(function() {
                // 不管是成功失败，都会执行
                $(".weui-uploader__info").html(($(".weui-uploader__file").size() - $(".weui-uploader__file_statu").size()) + "/" + $(".weui-uploader__file").size());
            });
    }
}
