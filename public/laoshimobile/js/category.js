$(function () {
    /*1.默认渲染一级分类 同时渲染第一个一级分类下的二级分类*/
    /*1.1 获取一级分类数据*/
    getFirstCategoryData(function (data) {
        /*1.2 一级分类模板渲染*/
        $('.lt_cateLeft ul').html(template('firstTemplate', data));
        /*1.3 获取第一个一级分类的ID*/
        var firstCategoryId = data.rows[0].id;
        /*1.4 获取二级分类数据*/
        getSecondCategoryData({
            id : firstCategoryId
        }, function (data) {
            /*1.5 二级分类模板渲染*/
            $('.lt_cateRight ul').html(template('secondTemplate', data));
        });
    })
    /*2.点击左侧分类的时候 去加载对应的二级分类*/
    $('.lt_cateLeft').on('tap','ul li a',function () {
        console.log(0)
        /*2.1 根据当前的一级分类去加载二级分类*/
        var firstCategoryId = $(this).data('id');
        /*2.4 改变当前样式*/
        $('.lt_cateLeft li').removeClass('now');
        $(this).parent().addClass('now');
        /*2.2 获取二级分类数据*/
        getSecondCategoryData({
            id:firstCategoryId
        },function (data) {
            /*2.3 二级分类模板渲染*/
            $('.lt_cateRight ul').html(template('secondTemplate', data));
            /* onerror 图片加载失败事件  html元素 onserror="this.src=images/none.jpg"
            * 在图片加载失败的时候把当前的元素的src换成默认图地址
            * */
            /*在没有数据的时候你需要友情提示一下  判断rows的长度即可*/
        })
    });
});
var getFirstCategoryData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        data: {},
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
}
var getSecondCategoryData = function (params, callback) {
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategory',
        data: params,
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    });
}