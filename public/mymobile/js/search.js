$(function(){
    //初始化记录
    var historyList = JSON.parse(localStorage.getItem('history')||'[]');
    $('.lt_history').html(template('history',{data:historyList}));
 
    //点击搜索 添加一条记录 跳转到相应的商品列表
    $('.lt_search form span').on('tap',function(){
        
        var newHistory = $('.lt_search form input').val();
        if(!newHistory){
            mui.toast('请输入关键字');
            return;
        }
        //去重
        for(var i=0; i<historyList.length;i++){
            if(historyList[i]==newHistory){
                historyList.splice(i,1);
            }
        }
        //限制数量
        if(historyList.length>=10){
            historyList.splice(0,1);
        }
        historyList.push(newHistory);
        setAndRandom()
        location.href = 'searchList.html?key='+encodeURIComponent(newHistory);
    })
    //删除一条记录
    $('.lt_history').on('tap','ul li span',function(){
        var i = $(this).parents().data('index');
        historyList.splice(i,1);
        setAndRandom()
    })

    //清空记录
    $('.lt_history').on('tap','.clear_icon',function(){
        historyList=[];
        setAndRandom()
    })

    //点击历史记录跳转相应的商品列表
    $('.lt_history').on('tap','ul li a',function(){
        var key = $(this).html()
        location.href = 'searchList.html?key='+encodeURIComponent(key);
    })

    function setAndRandom(){
        localStorage.setItem('history',JSON.stringify(historyList));
        $('.lt_history').html(template('history',{data:historyList}));
    }
})