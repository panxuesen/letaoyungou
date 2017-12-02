$(function(){
    mui('.mui-scroll-wrapper').scroll({
        scrollY: true, //是否竖向滚动
        scrollX: false, //是否横向滚动
        startX: 0, //初始化时滚动至x
        startY: 0, //初始化时滚动至y
        indicators: false, //是否显示滚动条 
        deceleration:0.0006, //阻尼系数,系数越小滑动越灵敏
        bounce: true //是否启用回弹
    });
    getFirstDate(function (data) {
        $('.cate_slide').html(template('firstCate',{data}));
    })
    getSecondDate(1,function (data) {
        $('.mui-scroll').html(template('secondCate',{data}));
    })
    $('.cate_slide').on('tap','ul li',function(){
        $(this).addClass('now').siblings().removeClass('now')
        var cateId = $(this).data('id');
        getSecondDate(cateId,function (data) {
            $('.mui-scroll').html(template('secondCate',{data}));
        })
    })
})
var getFirstDate = function(callback) {
    if(window.slideData) {
        callback && callback(window.slideData)
    }
    $.ajax({
        type:'get',
        url:'/category/queryTopCategory',
        data:{},
        dataType:'json',
        success:function(data){
            window.slideData = data.rows;
            callback && callback(window.slideData)
        }
    })
}
var getSecondDate = function(parentId,callback) {
    $.ajax({
        type:'get',
        url:'/category/querySecondCategory',
        data:{id:parentId},
        dataType:'json',
        success:function(data){
            callback && callback(data.rows)
        }
    })
}