$(function () {
    /*1.页面初始化     渲染购物车商品列表*/
    /*2.页面下拉       重新渲染购物车商品列表*/
    /*3.点击刷新按钮   重新渲染购物车商品列表*/
    /*4.编辑商品的尺码和数量*/
    /*5.删除商品的*/
    /*6.选择商品的时候自动计算总金额*/
    
    var setAmount = function () {
        /*1.选中当前的商品*/
        /*2.获取所有选中的商品信息   缓存数据当中去找*/
        /*3.根据 商品的选择数量  单价  去计算  去求所有的商品和*/
        var totalAmount = 0;
        window.cartData.forEach(function (item,i) {
            /*判断被选中*/
            if(item.isChecked == 1){
                /*js在运行浮点数的时候  出现小数点后N位*/
                var productAmount = item.price * item.num;
                totalAmount += productAmount;
            }
        });
        //console.log(totalAmount);
        /*4.显示在页面中*/
        /*处理一下小数点*/
        totalAmount = Math.round(totalAmount * 100)/100;
        $('.amount').find('span').html(totalAmount);
    }
    
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",
            indicators: false,
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    getCartData(function (data) {
                        console.log(data);
                        /*渲染列表*/
                        $('#cartList').html(template('cartListTemplate', {list: data}));
                        that.endPulldownToRefresh();
                    })
                }
            }
        }
    });
    $('.fa-refresh').on('tap', function () {
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });
    /*编辑*/
    $('#cartList').on('tap', '.mui-btn-blue', function () {
        var li = this.parentNode.parentNode;
        /* 根据当前点击的商品的数据 转换成 编辑框内需要的html代码 */
        /* 1.缓存列表数据 */
        /* 2.商品的ID */
        var productId = $(this).data('id');
        /* 3.根据ID区列表查询返回即可*/
        var item = lt.getItemById(productId, window.cartData);
        console.log(item);
        var html = template('cartEditTemplate', item);
        /*准备了一个模板  html代码 当有换行的时候  mui把换行替换成了BR标签*/
        /*思考：mui是没是把换行替换成了BR标签  \n 替换 br*/
        mui.confirm(html.replace(/\n/g, ''), '编辑商品', ['取消', '确定'], function (e) {
            if (e.index == 1) {
                /*数据的校验*/
                var size = parseInt($('.cart_update .btn_size.now').html());
                if (!size) {
                    mui.toast('亲,请选择尺码');
                    return false;
                }
                var num = parseInt($('.cart_update input').val());
                if (!num) {
                    mui.toast('亲,请选择数量');
                    return false;
                }
                /*请求后台  提交修改信息*/
                lt.ajax({
                    type: 'post',
                    url: '/cart/updateCart',
                    data: {
                        id: item.id,
                        size: size,
                        num: num
                    },
                    success: function (data) {
                        if (data.success == true) {
                            /*修改成功*/
                            /*1.关闭滑动菜单*/
                            mui.swipeoutClose(li);
                            /*2.更新页面选择尺码数量*/
                            /*2.1 为什么不去直接更改dom  需要更新的dom有几个就要更新多少次*/
                            /*2.2 一次修改dom的性能会比 多次的要好*/
                            item.size = size;
                            item.num = num;
                            /*根据新的数据重新渲染列表*/
                            $('#cartList').html(template('cartListTemplate', {list: window.cartData}));
                            /*计算金额*/
                            setAmount();
                        }
                    }
                });
            } else {
                /*默认就是关闭对话框*/
                /*关闭滑动菜单*/
                mui.swipeoutClose(li);
            }
        });
    }).on('tap', '.mui-btn-red', function () {
        var li = this.parentNode.parentNode;
        var productId = $(this).data('id');
        var index = $(this).data('index');
        mui.confirm('老铁,您是否要删除这件商品?', '温馨提示', ['取消', '确定'], function (e) {
            if (e.index == 1) {
                /*点击确定  提交后后台*/
                /*需要购物车的商品ID*/
                lt.ajax({
                    type: 'get',
                    url: '/cart/deleteCart',
                    data: {
                        id: productId
                    },
                    success: function (data) {
                        if (data.success == true) {
                            /*后台删除成功*/
                            /*1.关闭滑动菜单*/
                            mui.swipeoutClose(li);
                            /*2.更新列表数据重新渲染*/
                            window.cartData.splice(index, 1);
                            $('#cartList').html(template('cartListTemplate', {list: window.cartData}));
                            /*计算金额*/
                            setAmount();
                        }
                    }
                });
            } else {
                /*默认就是关闭对话框*/
                /*关闭滑动菜单*/
                mui.swipeoutClose(li);
            }
        });
    }).on('change', 'input', function () {
        /*问题：编辑操作 删除操作 后之前选中的失效*/
        /*方案：选中的 记录一下  在商品数据中增加一个属性 isChecked  1是选中 其他不选中 */
        var productId = $(this).data('id');
        var item = lt.getItemById(productId, window.cartData);
        /*更新数据  记录是否被选中的*/
        item.isChecked = this.checked ? 1 : 0;
        /*计算金额*/
        setAmount();
    });


    /*编辑弹窗的操作*/
    $('body').on('tap', '.cart_update .btn_size', function () {
        $('.cart_update .btn_size.now').removeClass('now');
        $(this).addClass('now');
    }).on('tap', '.cart_update .change span', function (e) {
        var type = $(this).data('type');// 0  减   1   加
        var $input = $('.cart_update input');
        /*取出来的值  注意类型 */
        var currentNum = parseInt($input.val());
        var max = parseInt($input.attr('max'));
        if (type == 0) {
            if (currentNum <= 0) {
                return false;
            }
            currentNum--;
        } else {
            if (currentNum >= max) {
                mui.toast('亲,没有库存了');
                return false;
            }
            currentNum++;
        }
        $input.val(currentNum);
    })
});
var getCartData = function (callback) {
    lt.ajax({
        url: '/cart/queryCart',
        success: function (data) {
            setTimeout(function () {
                window.cartData = data;
                callback && callback(data);
            }, 1000);
        }
    });
};
