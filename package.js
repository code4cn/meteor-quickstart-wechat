Package.describe({
    name: 'fami:wechat-framework',
    version: '0.2.0',
    summary: '微信原型用于快速搭建一个项目',
    git: 'https://github.com/code4cn/meteor-quickstart-wechat',
    documentation: 'README.md'
});

var PackageManager = function() {
    var obj = new Object();
    obj.server = {
        list: [],
        merge: function(arr) {
            obj.server.list = obj.server.list.concat(arr);
        }
    }
    obj.client = {
        list: [],
        merge: function(arr) {
            obj.client.list = obj.client.list.concat(arr);
        }
    }
    obj.both = {
        list: [],
        merge: function(arr) {
            obj.both.list = obj.both.list.concat(arr);
        }
    }
    return obj;
}
Package.on_use(function(api) {
    //依赖的NPM包
    var npms = {
        list: {},
        merge: function(json) {
            for (var packageName in json) {
                npms.list[packageName] = json[packageName];
            }
        }
    };
    //依赖的METEOR包
    //引入的文件
    //输出的变量
    var meteor= new PackageManager();
    var file= new PackageManager();
    var vars = new PackageManager();

    /*公共部分*/
    meteor.both.merge([
        "ecmascript@0.6.1",
        "reywood:publish-composite@1.3.6",
        "templating@1.1.5",
        "mongo@1.1.14",
        "less@2.7.8",
        "meteorhacks:picker@1.0.3",
        "kadira:flow-router@2.11.0",
        "kadira:blaze-layout@2.0.1",
        "momentjs:moment@2.16.0",
        "accounts-base@1.2.14",
    ]);

    npms.merge({
        "request": "2.81.0",
        "aliyun-oss": "1.2.0",
        // "jweixin":"1.0.0"
    });

    file.both.merge([
        "./config.js",
        "./base/init.js",
        "./base/until.js",
        "./base/base64.js",
        "./base/crypto.js",
        "./base/sha1.js",
        "./base/hmac.js",

    ]);

    file.client.merge([
        "./base/filter.js",
        "./base/fixtures.js",
        "./base/helpers.js",
        "./base/lrz.js",
    ]);

    vars.both.merge(["framework"]);

    /*布局部分*/
    file.client.merge([
        "./theme/reset.css",
        "./theme/styles.css",
        "./theme/weui.css",
        "./theme/head.html",
        
    ]);

    /*组件部分*/
  

    /* upload */
   
    file.server.merge([
        "./components/upload/method.js",
    ]);
    file.both.merge([
        "./components/upload/model.js",
    ]);
    vars.both.merge(['Images']);

    /* wechat */
    file.client.merge([
        "./components/wechat/sdk.html",
        "./components/wechat/filter.js",
        "./components/wechat/router.js",

    ]);
    file.server.merge([
        "./components/wechat/method.js",
        "./components/wechat/api.js",
        "./components/wechat/server.js",
    ]);
    file.both.merge([
        "./components/wechat/model.js",
    ]);
    vars.server.merge(["wxaccesstoken","wxticket"]);
    


    /* loadding */
    file.client.merge([
        "./components/loadding/index.html",
        "./components/loadding/index.js",
    ]);
    
    vars.client.merge(['loadding']);

    /* loadding */
    file.client.merge([
        "./components/pictures/index.less",
        "./components/pictures/index.html",
        "./components/pictures/index.js",
    ]);

    /*模块部分*/
    /*404*/
    file.client.merge([
        "./modules/404/index.html",
        "./modules/404/router.js",
    ]);

   
    /*site*/
    file.client.merge([
        "./modules/site/index.html",
        "./modules/site/index.js",
        "./modules/site/router.js",
    ]);

   
    /*category*/
    file.server.merge([
        "./modules/category/publish.js",
        "./modules/category/server.js",
    ]);
    file.both.merge([
        "./modules/category/model.js",
    ]);
    vars.client.merge(['CategoryType',"_category"]);
    vars.server.merge(['_category_server']);
    vars.both.merge(['Category']);
    


    /*wechat.media*/
    file.client.merge([

        "./modules/wechat/media/router.js",

        "./modules/wechat/media/index.less",
        "./modules/wechat/media/index.html",
        "./modules/wechat/media/index.js",

    ]);
    file.server.merge([
        "./modules/wechat/media/method.js",
    ]);
    file.both.merge([
        "./modules/wechat/media/model.js",
    ]);


    vars.client.merge(['_wxMedia']);
    vars.both.merge(['WxMedia']);


    /*wechat.active*/
    file.client.merge([

        "./modules/wechat/active/router.js",
        "./modules/wechat/active/index.html",
        "./modules/wechat/active/index.js",

       
        "./modules/wechat/active/detail/index.less",
        "./modules/wechat/active/detail/index.html",
        "./modules/wechat/active/detail/index.js",

        "./modules/wechat/active/upload/index.less",
         "./modules/wechat/active/upload/index.html",
        "./modules/wechat/active/upload/index.js",

        "./modules/wechat/active/declaration/index.less",
        "./modules/wechat/active/declaration/index.html",
        

    ]);
    file.server.merge([
        "./modules/wechat/active/method.js",
        "./modules/wechat/active/publish.js",
        "./modules/wechat/active/server.js",
    ]);
    file.both.merge([
        "./modules/wechat/active/model.js",
    ]);
    vars.client.merge(['_active_uploader']);
    vars.both.merge(['WxActive','WxActivePictures','WxActiveUsers']);


     /*wechat.menus*/
    file.client.merge([

        "./modules/wechat/menus/router.js",
        "./modules/wechat/menus/index.less",
        "./modules/wechat/menus/index.html",
        "./modules/wechat/menus/index.js"
        

    ]);
    file.server.merge([
        "./modules/wechat/menus/publish.js",
    ]);
    file.both.merge([
        "./modules/wechat/menus/model.js",
    ]);

    // console.log("============");
    // console.log(meteor.both);
    // console.log("============");

    Npm.depends(npms.list);
    api.use(meteor.both.list, ['client', 'server']);
    api.use(meteor.client.list, ['client']);
    api.use(meteor.server.list, ['server']);
    api.addFiles(file.both.list, ['client', 'server']);
    api.addFiles(file.client.list, ['client']);
    api.addFiles(file.server.list, ['server']);
    api.export(vars.both.list, ['client', 'server']);
    api.export(vars.client.list, ['client']);
    api.export(vars.server.list, ['server']);

});
