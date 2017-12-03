$(function(){
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true//是否启用回弹
    });
    mui('.mui-slider').slider({
        interval:4000
    });
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                height:50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback :function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    var that = this

                    getProductDetail(function(data){
                        console.log(data)
                        $('.mui-scroll').html(template('productDetail',{data:data}));
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
                    mui.toast('添加成功');
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
            setTimeout(function(){
                callback&&callback(data);
            },1000)
        }
    })
}