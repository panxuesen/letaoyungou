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
    //设置input的val为搜索参数
    $('.lt_search form input').val(lt.getUrlData().key)
    //点击搜索 渲染数据
    $('.lt_search form span').on('tap',function(){
        //执行一次下拉加载
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    })
    window.params={};
    //下拉刷新 上拉加载
    mui.init({
        pullRefresh : {
          container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            height:50,//可选,默认50.触发下拉刷新拖动距离,
            auto: true,//可选,默认false.首次加载自动下拉刷新一次
            callback :function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                var that = this
                
                window.params.page = 1;
                window.params.proName = $('.lt_search form input').val();

                randomData(window.params,function(data){
                    $('.lt_product').html(template('productList',data));
                    that.endPulldownToRefresh();
                    that.refresh(true);
                });  
            
            }
          },
          up : {
            contentrefresh: '正在加载...',
            contentnomore:'没有更多数据了',
            callback :function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
                var that = this
                window.params.page++
                window.params.proName = $('.lt_search form input').val();
                
                randomData(window.params,function(data){
                    if(!data.data || !data.data.length){
                        that.endPullupToRefresh(true);//禁用下拉刷新  
                        return false;
                    }
                    $('.lt_product').append(template('productList',data));
                    that.endPullupToRefresh();
                });  
               
            }
          }
        }
      });
      //升降序 
      $('.lt_order').on('tap','a',function(e){
        var $this = $(e.currentTarget);
        if($this.hasClass('now')){//有now的时候
            /*排序*/
            var $span = $this.find('span');
            if($span.hasClass('fa-angle-down')){//箭头朝下 升序  改为朝上 降序  渲染
                $span.removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{//箭头朝上 降序  改为朝下 升序
                $span.addClass('fa-angle-down').removeClass('fa-angle-up');
            }
        }else{//没有now的时候 //箭头朝下
            /*样式*/
            $('.lt_order a').removeClass('now').find('span').attr('class','fa fa-angle-down');
            $this.addClass('now');
        }
        window.params.price='';
        window.params.num='';
        window.params[$this.data('type')] = $this.find('span').hasClass('fa-angle-down')?1:2;
        //执行一次下拉加载
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
      })
})
var randomData = function(params,callback){
    $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data:{
            proName:params.proName||'',
            page:params.page||1,
            pageSize:params.pageSize||4,
            price:params.price||'',
            num:params.num||''
        },
        dataType:'json',
        success:function(data){
            setTimeout(function(){
                callback&&callback(data)                
            },1000)
        }
    })
}
