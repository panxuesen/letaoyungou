$(function () {
    /*初始化轮播图*/
    mui('.mui-slider').slider({
        interval:3000
    });
    /*区域滚动初始化*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });
});