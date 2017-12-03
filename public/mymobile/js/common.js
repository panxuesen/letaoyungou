
window.lt = {};

lt.LOGIN = '/mymobile/user/login.html';
lt.USER = '/mymobile/user/index.html';
lt.CART = '/mymobile/user/cart.html';

lt.getUrlData = function(){
    var search = location.search;
    search = search.substr(1);
    var urlArr = search.split('&');
    var params = {};
    for(var i=0;i<urlArr.length;i++){
        var dataArr = urlArr[i].split('=');
        params[dataArr[0]]=decodeURIComponent(dataArr[1]);
    }
    return params;
}
/*
*   反序列化表单值
*   @params 序列化后的表单值
*   @return 对象形式的表单值
*/ 
lt.getFormData = function(search){
    var urlArr = search.split('&');
    var params = {};
    for(var i=0;i<urlArr.length;i++){
        var dataArr = urlArr[i].split('=');
        params[dataArr[0]]=decodeURIComponent(dataArr[1]);
    }
    return params;
}

//包含登录拦截的ajax请求
lt.ajax = function(params){
    $.ajax({
        type:params.type||'get',
        url:params.url||"#",
        data:params.data||{},
        dataType:'json',
        success:function(data){
            if(data.error==400){//未登录
                location.href =  lt.LOGIN + '?returnURL=' + encodeURIComponent(location.href);  
            }else{
                params.success&&params.success(data);
            }
        }
    })
}