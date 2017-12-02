window.lt = {};
/*
* 获取地址栏参数的
* 返回类型是对象
* */
lt.getParamsByUrl = function () {
    var search = location.search;
    /*接收url参数的对象*/
    var params = {};
    if(search){
        /*去掉?*/
        search = search.substr(1);
        /*key=1&name=10 */
        var searchArr = search.split('&');
        searchArr.forEach(function (item,i) {
            /*item key=1*/
            /*item name=10 */
            /*itemArr [key,1] [name,10]*/
            var itemArr = item.split('=');
            /*encodeURIComponent 转成url编码  处理特殊字符串的传递*/
            /*decodeURIComponent 解url编码码  正常的字符串*/
            params[itemArr[0]] = decodeURIComponent(itemArr[1]);
        });
    }
    return params;
};
/*
* 拦截ajax请求未登录状态
* 具备ajax功能同做未登录的判断处理
* */
lt.LOGINURL = '/mobile37/user/login.html';
lt.USERURL = '/mobile37/user/index.html';
lt.CARTURL = '/mobile37/user/cart.html';
lt.ajax = function (options) {
    /* options 和原理的ajax传参保持一致*/
    $.ajax({
        type:options.type||'get',
        url:options.url || '#',
        data:options.data || '',
        dataType:options.dataType || 'json',
        success:function (data) {
            /*如果 data.error 存在且等于400 认为未登录*/
            if(data.error == 400){
                location.href = lt.LOGINURL + '?returnUrl=' + encodeURIComponent(location.href);
            }
            /*登录成功*/
            else{
                options.success && options.success(data);
            }
        },
        error:function (info) {
            options.error && options.error(info);
        }
    });
};
/*转换表单序列化的数据为一个对象*/
lt.serialize2object = function (serialize) {
    var obj = {};
    if(serialize){
        var serializeArr = serialize.split('&');
        serializeArr.forEach(function (item,i) {
            var itemArr = item.split('=');
            obj[itemArr[0]] = itemArr[1];
        });
    }
    return obj;
};
/*根据ID返回数据列表当中的符合ID对象*/
lt.getItemById = function (id,list) {
    var obj = null;
    list.forEach(function (item,i) {
        if(id == item.id){
            obj = item;
        }
    });
    return obj;
};