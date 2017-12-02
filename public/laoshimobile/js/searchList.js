$(function () {
    /*update date 2017-11-30*/
    /*1.问题：下拉刷新的时候 根据的是当前输入框的内容查询的*/
    /*2.需求：点击过搜索之后才是我们的关键字 没点搜索还是使用之前的搜索关键字*/
    /*3.方案：记录之前的关键字，点击搜索之后更新记录的关键字*/
    window.key = lt.getParamsByUrl().key;
    window.page = 1;

    /*1.需求：点击搜索查询商品*/
    /*2.方案：绑定搜索的点击事件，触发的时候去根据输入框的内容刷新列表，主动触发一次下拉刷新*/
    $('.lt_search').on('tap', 'a', function () {
        var key = $.trim($('.lt_search input').val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        /*更新全局对象当中的key ajax使用的就是它*/
        window.key = key;

        /*重置排序功能*/
        window.order = {};
        /*去除样式*/
        $allOrder.removeClass('now');
        /*改变箭头*/
        $allOrder.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');


        /*再触发下拉刷新即可  pulldownLoading 触发下拉刷新*/
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });

    /*1.需求：点击排序按钮*/
    /*1.1 如果之前没有选中：选中 并且按照向下的箭头去排序  降序*/
    /*1.2 如果已经选中：箭头换一个方向 按照当前的方向去排序*/
    /*1.3 只能按照一种方式去排序：点击排序的其他排序的状态重置*/
    /*记录排序的对象  ajax使用*/
    window.order = {};
    var $allOrder = $('.lt_order a');
    $('.lt_order').on('tap', function (e) {
        /*获取当前点击的排序*/
        var $currentOrder = $(e.target);
        /*两种情况 选中 或者 没选中*/
        if ($currentOrder.hasClass('now')) {
            var $angle = $currentOrder.find('.fa');
            if ($angle.hasClass('fa-angle-up')) {
                $angle.removeClass('fa-angle-up').addClass('fa-angle-down');
            } else {
                $angle.removeClass('fa-angle-down').addClass('fa-angle-up');
            }
        } else {
            /*去除样式*/
            $allOrder.removeClass('now');
            /*改变箭头*/
            $allOrder.find('.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            /*选中*/
            $currentOrder.addClass('now');
        }

        /*根据当前排序重新渲染商品列表*/
        /*价格 price 1升序  2降序 */
        /*库存 num 1升序  2降序 */
        /*主动触发下拉刷新  getProductListData  想办法把参数给这个方法使用 */
        /*获取排序的方式  给 ajax 的传参加上排序方式*/
        var orderType = $currentOrder.data('type');
        var orderValue = $currentOrder.find('.fa').hasClass('fa-angle-down') ? 2 : 1;
        window.order = {};
        window.order[orderType] = orderValue;
        /*主动触发下拉刷新 使用参数*/
        mui('#refreshContainer').pullRefresh().pulldownLoading();
    });


    /*区域滚动初始化*/
    /*mui('.mui-scroll-wrapper').scroll();*/
    /*1.页面初始化 关键字填输入框 根据关键字搜索展示商品列表*/
    $('.lt_search input').val(lt.getParamsByUrl().key);
    /*当配置自动加载的时候 没有必要去加载*/
    /*getProductListData(function (data) {
        $('.lt_product').html(template('productListTemplate',data));
    });*/
    /*2.下拉刷新*/
    mui.init({
        pullRefresh: {
            container: "#refreshContainer",
            indicators:false,
            down: {
                auto: true,
                callback: function () {
                    var that = this;
                    window.page = 1;
                    getProductListData(function (data) {
                        $('.lt_product').html(template('productListTemplate', data));
                        /*停止下拉刷新*/
                        that.endPulldownToRefresh();
                        /* 另外的方式 mui('#refreshContainer').pullRefresh().endPulldownToRefresh()*/
                        /*重置上拉加载功能*/
                        that.refresh(true);
                    });
                }
            },
            up: {
                callback: function () {
                    var that = this;
                    /*上拉加载之后的回调函数*/
                    /*1.需求：加载下一页内容*/
                    /*2.方案：改变当前页面页码，再次发生ajax请求，把数据渲染成html,追加到商品列表*/
                    window.page++;
                    getProductListData(function (data) {
                        /*1.需求：当没有数据的时候  禁用上拉加载功能，友情提示：没有更多数据了*/
                        /*2.方案：根据返回的data去判断，如果是空数组，禁用功能 mui提供 */
                        if (data.data && data.data.length) {
                            /*有数据*/
                            $('.lt_product').append(template('productListTemplate', data));
                            /*停止上拉加载*/
                            that.endPullupToRefresh();
                        } else {
                            /*没有数据*/
                            /*停止上拉加载 禁用上拉加载功能，友情提示：没有更多数据了*/
                            that.endPullupToRefresh(true);
                        }
                    })
                }
            }
        }
    });


});
var getProductListData = function (callback) {
    /*$.extend(obj1,obj2); 会把obj2当中的属性赋予obj1,如果有相同属性就是覆盖 */
    $.ajax({
        type: 'get',
        url: '/product/queryProduct',
        data: $.extend({
            proName: window.key,
            page: window.page,
            pageSize: 4
        }, window.order),
        dataType: 'json',
        success: function (data) {
            /*增加一点加载时间*/
            setTimeout(function () {
                callback && callback(data);
            }, 1000);
        }
    });
}