$(function () {
    /*1.页面初始化获取用户名和绑定的手机号显示页面就可以*/
    lt.ajax({
        url:'/user/queryUserMessage',
        success:function (data) {
            $('.mui-media-body').find('span').html(data.username);
            $('.mui-media-body').find('p').html('绑定手机：'+data.mobile);
        }
    });
    /*2.退出登录功能*/
    $('.mui-btn').on('tap',function () {
        lt.ajax({
            url:'/user/logout',
            success:function (data) {
                if(data.success = true){
                    /*退出成功*/
                    location.href = lt.LOGINURL;
                }
            }
        })
    });
});