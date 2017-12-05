$(function(){
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            indicators: false,
            down : {
                height:50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback :function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                    var that = this

                    getCartList(function(data){
                        // $('.mui-scroll').html(template('productDetail',{data:data}));
                        that.endPulldownToRefresh();
                        that.refresh(true);
                    });  
                
                }
            }
        }
    });
})

var getCartList = function(callback){
    $.ajax({
        type:'get',
        url:'/cart/queryCart',
        data:{},
        dataType:'json',
        success:function(data){
            setTimeout(function(){
                callback && callback(data);                
            },1000)
        }
    })
}