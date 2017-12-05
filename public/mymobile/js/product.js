$(function(){

    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            indicators:false,//不显示滚动条
            down : {
                height:50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback :function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    var that = this;
                    getProductDetail(function(data){
                        $('.mui-scroll').html(template('productDetail',{data:data}));
                        mui('.mui-slider').slider();//在页面渲染完毕后初始化轮播图
                        that.endPulldownToRefresh();
                        that.refresh(true);
                    });  
                
                }
            }
        }
    });
    $('.mui-scroll').on('tap','.p_size span',function(){
        $('.p_size span.now').removeClass('now');
        $(this).addClass('now');
    }).on('tap','.p_number span',function(){
        var count = $('.p_number input').val();
        var maxNum = parseInt($('.p_number input').attr('max'));//转换为数字
        if($(this).hasClass('jian')){
            if(count<=0){
                return false;
            }
            count--;
        }else{
            if(count>=maxNum){
                return false;
            }
            count++;
        }
        $('.p_number input').val(count);
    });
    $('.btn_addCart').on('tap',function(){
        var productId = lt.getUrlData().productId;
        if($('.p_size.now')){
            var size = $('.p_size.now').val();            
        }else{
            mui.toast('请选择尺码');
            return false;
        }
        var num = $('.p_number input').val();
        if(num<=0){
            mui.toast('请选择至少一件商品');
            return false;            
        }
        lt.ajax({
            type:'post',
            url:'/cart/addCart',
            data:{
                productId:productId,
                size:size,
                num:num
            },
            success:function(data){
                if(data.success){
                    mui.confirm('亲添加成功,去购物车看看吗？','温馨提示',['否','是'],function (e) {
                        if(e.index == 1){
                            /*跳转购物车页面*/
                            location.href = lt.CART;
                        }else{
                            /*默认就是关闭对话框*/
                        }
                        loading = false;
                    });
                }
            }
        })
    })
    
})
var getProductDetail = function(callback){
    window.productId = lt.getUrlData().productId
    $.ajax({
        type:'get',
        url:'/product/queryProductDetail',
        data:{id:window.productId},
        dataType:'json',
        success:function(data){
            // setTimeout(function(){
                callback&&callback(data);
            // },1000)
        }
    })
}