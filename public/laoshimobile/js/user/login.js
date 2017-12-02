$(function () {
    /*到登录页的不同情况*/
    /*1.当遇见需要登录操作跳转到登录页*/
    /*2.直接访问的就是登录页*/

    /*1.点击登录功能*/
    $('.mui-btn-primary').on('tap',function () {
        /*需求：获取一个表单内的所有数据*/
        /*方案：使用表单序列化 获取所有数据  按照一定的格式*/
        /*注意：不管同步提交还是表单序列化都有要求===> 数据名称 */
        var formData = $('form').serialize();
        /*转换成对象 才好去做校验*/
        var obj = lt.serialize2object(formData);

        if(!obj.username){
            mui.toast('请输入用户名');
            return false;
        }

        if(!obj.password){
            mui.toast('请输入密码');
            return false;
        }

        $.ajax({
            type:'post',
            url:'/user/login',
            /* 对象  序列化格式数据（键值对字符串，数组格式） */
            data:formData,
            dataType:'json',
            success:function (data) {
                /*登录的业务逻辑处理成功*/
                if(data.success == true){
                    /*如果是第一种情况登录成功  跳回原页面*/
                    /*需要来源页跳转到登录页的时候传当前的地址过来*/
                    /*如果是第二种情况登录成功  跳转个人中心*/
                    /*通过地址栏的返回地址是否存在 判断来源*/
                    var returnUrl = lt.getParamsByUrl().returnUrl;
                    if(returnUrl){
                        /*需要登录的页面*/
                        location.href = returnUrl;
                    }else{
                        /*登录页面*/
                        location.href = lt.USERURL;
                    }
                }else{
                    /*登录逻辑不成功  原因呢？ */
                    mui.toast(data.message);
                }
            },
            error:function () {
                mui.toast('网络繁忙');
            }

        });

    });

});