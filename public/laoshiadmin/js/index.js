$(function () {
    initBar();
    initPie();
});
var initBar = function () {
    /*准备数据*/
    /*var data = [{tit:'一月',num:1000},...]*/
    var dataTit = ['一季度','二季度','三季度','四季度'];
    var dataNum = [1032,3000,1233,2003];
    /*使用echarts*/
    /*1. 下载 http://echarts.baidu.com/download.html*/
    /*2. 引入 <script src="assets/echarts/echarts.min.js"></script>*/
    /*3. 准备 一个容器 绘制表格*/
    /*4. 配置参数  （选择图标类型,使用准备好的数据） */
    /*4.1 找到初始化容器*/
    var picTable = document.querySelector('.picTable:first-child');
    /*4.2 初始化这个容器*/
    var myCharts = echarts.init(picTable);
    /*4.3 开始配置参数*/
    var option = {
        title: {
            text: '2017注册人数'
        },
        tooltip: {},
        legend: {
            data:['人数']
        },
        xAxis: {
            data: dataTit
        },
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: dataNum
        }]
    };
    /*4.4 使用配置项*/
    myCharts.setOption(option);
};
var initPie = function () {
    /*获取数据*/
    var data = [
        {name:'李宁',num:1542},
        {name:'安踏',num:322},
        {name:'耐克',num:156},
        {name:'阿迪',num:600},
        {name:'宝马',num:342}
    ];
    var legendData = [];
    var seriesData = [];
    data.forEach(function (item,i) {
        legendData.push(item.name);
        seriesData.push({value:item.num, name:item.name});
    })

    var picTable = document.querySelector('.picTable:last-child');
    var myChart = echarts.init(picTable);
    var option = {
        /*配置绝对图标*/
        title : {
            text: '热门品牌销售',
            subtext: '2017年12月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: legendData
        },
        series : [
            {
                name: '销售情况',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:seriesData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
    myChart.setOption(option);
}