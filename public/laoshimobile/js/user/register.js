$(function () {
     /*1.获取短信验证码*/
     $('.btn-getCode').on('tap',function () {
         var $btn = $(this);
         /*防止重复提交*/
         if($btn.hasClass('disable')){
             return false;
         }
         /*1.1 校验手机号*/
         var mobile = $.trim($('input[name="username"]').val());
         if(!mobile){
             mui.toast('亲,请输入手机号');
             return false;
         }
         if(!/^1\d{10}$/.test(mobile)){
             mui.toast('亲,请输入合法号码');
             return false;
         }
         /*1.2 调后台接口*/
         $.ajax({
             type:'get',
             url:'/user/vCode',
             /*在发生请求前做事情*/
             beforeSend:function () {
                 $btn.addClass('disable');
             },
             data:{
                 /*接口不完美*/
                 mobile:mobile
             },
             dataType:'json',
             success:function (data) {
                 /*获取短信验证码成*/
                 /*倒计时60秒*/
                 var time = 10;
                 var timer = setInterval(function () {
                     time --;
                     $btn.html(time+'秒后再次获取');
                     if(time == 0){
                         clearInterval(timer);
                         $btn.html('获取验证码').removeClass('disable');
                     }
                 },1000);
             }
         });
     });
     /*2.注册*/
     var loading = false;
    $('.btn-register').on('tap',function () {
        var $btn = $(this);
        /*阻止多次提交*/
        if(loading){
            return false;
        }
        /*2.1 获取表单所有数据*/
        var formData = $('form').serialize();
        var data  = lt.serialize2object(formData);
        console.log(data);
        /*2.2 校验数据*/
        if(!data.username){
            mui.toast('亲,请输入手机号');
            return false;
        }
        if(!/^1\d{10}$/.test(data.username)){
            mui.toast('亲,请输入合法号码');
            return false;
        }
        if(!data.password){
            mui.toast('亲,请输入密码');
            return false;
        }
        if(data.password.length < 6){
            mui.toast('亲,请输入至少6位密码');
            return false;
        }
        if(!data.rePass){
            mui.toast('亲,请输入确认密码');
            return false;
        }
        if(data.rePass != data.password){
            mui.toast('亲,请输入一致的密码');
            return false;
        }
        if(!data.vCode){
            mui.toast('亲,请输入验证码');
            return false;
        }
        if(data.vCode.length != 6){
            mui.toast('亲,请输入6位验证码');
            return false;
        }
        data.mobile = data.username;
        /*2.2 发送数据给后台*/
        $.ajax({
            type:'post',
            url:'/user/register',
            data:data,
            dataType:'json',
            beforeSend:function () {
                loading = true;
            },
            success:function (data) {
                if(data.success == true){
                    location.href = lt.LOGINURL;
                }else{
                    setTimeout(function () {
                        loading = false;
                        mui.toast(data.message);
                    },2000);
                 }
            }
        });

    })
});