FlowRouter.route('/_wechat/login', {
    name: "wechatLogin",
    action: function(params, queryParams) {
        if (queryParams.code && queryParams.state) {
            Accounts.callLoginMethod({
                methodArguments: [{
                    code: queryParams.code
                }],
                userCallback: function loginCallback(error, result) {
                   if(error){
                   	 console.log(error);
                   }else{
                   	 window.location.href = queryParams.state;
                   }
                }
            });
        }else if(queryParams.state){
        	window.location.href = queryParams.state;
        }
    }
});
