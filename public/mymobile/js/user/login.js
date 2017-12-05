$(function(){
    $('body').on('tap','.login_btn',function(){
        var formList = $('#login').serialize();
        var params=lt.getFormData(formList);
        if(!$.trim(params.username)){
            mui.toast('请输入用户名');
            return false;
        }
        if(!$.trim(params.password)){
            mui.toast('请输入密码');      
            return false;            
        }
        getLoginMessage(formList);
    })
})
var getLoginMessage = function(formList){
    $.ajax({
        type:'post',
        url:'/user/login',
        data:formList,
        dataType:'json',
        success:function(data){
            if(data.error){
                mui.toast(data.message);
                return false;
            }
            if(data.success){
                if(location.search){
                    location.href = decodeURIComponent(location.search.replace('?returnUrl=',''));
                    return false;
                }
                location.href = lt.USER;
            }
        }
    })
}