$(function () {
    /*1.点击搜索  根据输入框的关键字  跳转商品列表页  并且把关键字传递过去 同时需要记录本地存储*/
    /*2.初始化页面的时候  会根据当前记录的历史搜索记录 去渲染历史记录列表*/
    /*3.删除一条历史记录*/
    /*4.在追加历史的时候有业务：相同的先删掉，追加新的到前面，最多追加10条，如果多了去掉旧的*/
    /*5.清空历史记录*/
    /*6.点击之前历史能跳转商品列表*/


    /*2.1 约定一个本地存储的key:lt_history  value:json字符串数组 ['电脑'，‘手机’]*/
    /*json格式的字符串*/
    var ltHistoryString = localStorage.getItem('lt_history') || '[]';
    /*json数组 javascript能使用的*/
    var ltHistoryList = JSON.parse(ltHistoryString);
    /*2.2 渲染搜索列表*/
    $('.lt_history').html(template('ltHistoryTemplate', {list: ltHistoryList}));

    /*3.1 怎么删除 根据索引删除 记录在当前元素上了 data-index*/
    $('.lt_history').on('tap', 'li span', function () {
        var index = $(this).data('index');
        /*splice操作当前数组*/
        ltHistoryList.splice(index, 1);
        localStorage.setItem('lt_history', JSON.stringify(ltHistoryList));
        $('.lt_history').html(template('ltHistoryTemplate', {list: ltHistoryList}));
    });

    /*5.1 清空数组*/
    $('.lt_history').on('tap', '.tit a', function () {
        ltHistoryList = [];
        localStorage.setItem('lt_history', '[]');
        $('.lt_history').html(template('ltHistoryTemplate', {list: ltHistoryList}));
    })

    $('.lt_search input').val('');
    /*1.1 绑定搜索点击事件 点击的去关键字  如果没有关键字提示用户 请输入搜索关键字*/
    $('.lt_search a').on('tap', function () {
        var key = $.trim($('.lt_search input').val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        /*1.2 存储搜索记录*/
        addHistory(key);
        /*1.3 跳转到商品列表页*/
        location.href = 'searchList.html?key=' + encodeURIComponent(key);
    });

    /*页面跳转*/
    $('.lt_history').on('tap','ul a',function () {
        location.href = 'searchList.html?key=' + encodeURIComponent($(this).data('key'));
    });

    function addHistory(key) {
        /*追加历史*/
        /*1.相同的先删掉，追加新的到前面*/
        /*2.最多追加10条，如果多了去掉旧的*/
        var isHaveSame = false;
        var sameIndex = null;
        $.each(ltHistoryList, function (i, item) {
            if (key == item) {
                isHaveSame = true;
                sameIndex = i;
            }
        });
        if (isHaveSame) {
            ltHistoryList.splice(sameIndex, 1);
            ltHistoryList.push(key);
        } else {
            ltHistoryList.push(key);
            /*追加后如果大于10 之前的截取*/
            if (ltHistoryList.length > 10) {
                /*严谨*/
                ltHistoryList.splice(0, ltHistoryList.length - 10);
            }
        }
        /*存起来*/
        localStorage.setItem('lt_history',JSON.stringify(ltHistoryList));
    }

});