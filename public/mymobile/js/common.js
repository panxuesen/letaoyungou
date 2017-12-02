
window.lt = {};

lt.getUrlData = function(){
    var search = location.search;
    search = search.substr(1);
    var urlArr = search.split('&');
    var params = {};
    for(var i=0;i<urlArr.length;i++){
        var dataArr = urlArr[i].split('=');
        params[dataArr[0]]=decodeURIComponent(dataArr[1]);
    }
    return params;
}