$(function () {
    window.page = 1;
    /*1.分页展示列表数据*/
    var render = function () {
        getCategoryFirstData(function (data) {
            /*列表渲染*/
            $('tbody').html(template('listTemplate',data));
            /*使用分页组件  获取数据之后*/
            /*分页渲染*/
            $('.pagination').bootstrapPaginator({
                /*配置使用的bootstrap版本必填*/
                bootstrapMajorVersion:3,
                /*按钮的尺寸*/
                size:'small',
                /*当前页码*/
                currentPage:data.page,
                /*一共多少页*/
                totalPages:Math.ceil(data.total/data.size),
                /*可操作的按钮多少个  指的是123页码*/
                numberOfPages:5,
                /*点击回调函数*/
                onPageClicked:function (event, originalEvent, type,page) {
                    /*1.jquery事件对象*/
                    /*2.原生事件对象*/
                    /*3.按钮的类型 普通页码的按钮  上一页 下一页  第一页 最后一页  */
                    /*4.page 对应的页面*/
                    window.page = page;
                    render();
                }
            });
        })
    }
    render();

    /*初始校验功能*/
    $('#saveForm').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:'分类名称必须输入'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:'/category/addTopCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                if(data.success == true){
                    /*关闭模态框*/
                    $('#saveModal').modal('hide');
                    /*重新刷新第一页内容*/
                    window.page = 1;
                    render();
                }
            }
        });
    });
    /*2.动态添加新的分类*/
    $('#saveBtn').on('click',function () {
        $('#saveModal').modal('show');
    });
    /*在关闭模态框的时候  重置表单 */
    $('#saveModal').on('hide.bs.modal',function () {
        /*只有在表单显示的时候才有用*/
        /*校验样式重置*/
        $('#saveForm').data('bootstrapValidator').resetForm();
        /*表单内容重置*/
        $('#saveForm')[0].reset();
    });
});
var getCategoryFirstData = function (callback) {
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:{
            page:window.page,
            pageSize:2
        },
        dataType:'json',
        success:function (data) {
            callback && callback(data);
        }
    });
}