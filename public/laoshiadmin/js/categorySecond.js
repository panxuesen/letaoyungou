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


    /*2.添加新分类功能*/
    $('#saveBtn').on('click',function () {
        $('#saveModal').modal('show');
    });
    /*2.1 初始化下拉菜单*/
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        /*认为获取了所有的顶级分类*/
        data:{
            page:1,
            pageSize:10000
        },
        dataType:'json',
        success:function (data) {
            var html = '';
            data.rows.forEach(function (item,i) {
                html += '<li data-id="'+item.id+'"><a href="#">'+item.categoryName+'</a></li>'
            })
            $('.dropdown-menu').html(html).find('li').on('click',function () {
                $('#categoryName').html($(this).find('a').html());
                $('[name="categoryId"]').val($(this).data('id'));
                $('#saveForm').data('bootstrapValidator').updateStatus('categoryId','VALID');
            });
        }
    });
    /*2.2 初始化上传功能*/
    /*2.2.1 准备一个file元素 设置一个名称 pic1 */
    /*2.2.2 初始化fileUpload插件*/
    $('#fileUpload').fileupload({
        /*上传地址*/
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        done:function (e, data) {
            $('#fileUpload').parent().next().find('img').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            $('#saveForm').data('bootstrapValidator').updateStatus('brandLogo','VALID');
        }
    });
    /*2.3 初始化校验功能*/
    $('#saveForm').bootstrapValidator({
        /*默认不校验隐藏的输入框*/
        excluded:[],
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:'顶级分类必须选择'
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:'品牌名称必须输入'
                    }
                }
            }
            ,
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:'品牌商标必须上传'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e) {
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            type:'post',
            url:'/category/addSecondCategory',
            data:$form.serialize(),
            dataType:'json',
            success:function (data) {
                /*关闭模态框*/
                $('#saveModal').modal('hide');
                if(data.success == true){
                    window.page = 1;
                    render();
                }
            }
        });

    });
    /*在关闭模态框的时候  重置表单 */
    $('#saveModal').on('hide.bs.modal',function () {
        /*只有在表单显示的时候才有用*/
        /*校验样式重置*/
        $('#saveForm').data('bootstrapValidator').resetForm();
        /*表单内容重置 隐藏的重置不了*/
        $('#saveForm input').val('');

        $('#categoryName').html('请选择');
        $('#fileUpload').parent().next().find('img').attr('src','images/none.png');
    });
});
var getCategoryFirstData = function (callback) {
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
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