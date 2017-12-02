$(function () {
    window.productId = lt.getParamsByUrl().productId;
    /*1.初始化下拉加载效果*/
    mui.init({
        pullRefresh: {
            container: '#refreshContainer',
            indicators:false,
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    /*2.根据商品ID渲染页面*/
                    getProductDetailData(function (data) {
                        $('.mui-scroll').html(template('productDetailTemplate', data));
                        /*页面渲染后要初始化轮播图*/
                        mui('.mui-slider').slider();
                        that.endPulldownToRefresh();
                    });
                }
            }
        }
    });
    /*3.页面交互功能-选择尺码*/
    $('.mui-scroll').on('tap', '.btn_size', function () {
        $('.btn_size').removeClass('now');
        $(this).addClass('now');
    });
    /*4.页面交互功能-选择数量*/
    var numValue = 0;
    $('.mui-scroll').on('tap', '.change span', function () {
        var type = $(this).data('type');
        if (type == 0) {
            /*如果是减 等于0的时候就不应该有操作*/
            if (numValue <= 0) {
                return false;
            }
            numValue--;
        } else {
            /*取值范围的判断*/
            if (numValue >= $('.change input').attr('max')) {
                /*友情提示*/
                mui.toast('亲,没货了');
                return false;
            }
            numValue++;
        }
        $('.change input').val(numValue);
    });
    /*5.页面交互功能-加入购物车*/
    var loading = false;
    $('.addCart').on('tap', function () {
        /*防止重复提交*/
        if(loading){
            return false;
        }

        /*1.获取商品ID*/
        /*2.获取商品选择的尺码*/
        /*3.获取商品选择的数量*/
        var productId = window.productId;
        var size = $('.btn_size.now').html();
        var num = $('.change input').val();
        /*校验*/
        if (!productId) {
            mui.toast('亲,请刷新页面');
            return false;
        }
        if (!size) {
            mui.toast('亲,请选择尺码');
            return false;
        }
        if (!num) {
            mui.toast('亲,请选择数量');
            return false;
        }
        /*加入购物车的请求*/
       loading = true;
       lt.ajax({
           type:'post',
           url:'/cart/addCart',
           data:{
               productId:productId,
               size:size,
               num:num
           },
           success:function (data) {
               if(data.success == true){
                   /*添加购物车成功*/
                   /*需求：弹出一个温馨提示 消息框*/
                   mui.confirm('亲添加成功,去购物车看看吗？','温馨提示',['否','是'],function (e) {
                       if(e.index == 1){
                           /*跳转购物车页面*/
                           location.href = lt.CARTURL;
                       }else{
                           /*默认就是关闭对话框*/
                       }
                       loading = false;
                   });
               }
           }
       })
    });


});
var getProductDetailData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/product/queryProductDetail',
        data: {
            id: window.productId
        },
        dataType: 'json',
        success: function (data) {
            /*增加一点加载时间*/
            setTimeout(function () {
                callback && callback(data);
            }, 1000);
        }
    });
}