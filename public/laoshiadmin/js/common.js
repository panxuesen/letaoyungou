/*ajax加载进度显示功能*/
/*1.在进行ajax请求开始的时候开启显示进度条*/
NProgress.configure({ showSpinner: false });
$(window).ajaxStart(function () {
    NProgress.start();
});
/*2.在ajax响应完成 结束进度条*/
$(window).ajaxStop(function () {
    NProgress.done();
});


/*1.左侧栏的显示隐藏*/
$('[data-menu]').on('click',function () {
    $('.ad_aside').toggle();
    $('.ad_section').toggleClass('menu');
});
/*2.左侧栏二级菜单显示隐藏*/
$('.menu').find('[href="javascript:;"]').on('click',function () {
    $(this).siblings('.child').slideToggle();
});
/*3.公用退出弹窗显示功能*/
var htmlModal = '<div class="modal fade" id="logout">\n' +
                '    <div class="modal-dialog modal-sm">\n' +
                '        <div class="modal-content">\n' +
                '            <div class="modal-header">\n' +
                '                <button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>\n' +
                '                <h4 class="modal-title" id="myModalLabel">温馨提示</h4>\n' +
                '            </div>\n' +
                '            <div class="modal-body">\n' +
                '                <div class="text-danger"><span class="glyphicon glyphicon-exclamation-sign"></span> 您确定要退出后台管理系统吗？</div>\n' +
                '            </div>\n' +
                '            <div class="modal-footer">\n' +
                '                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\n' +
                '                <button type="button" class="btn btn-primary">确定</button>\n' +
                '            </div>\n' +
                '        </div>\n' +
                '    </div>\n' +
                '</div>';
$('body').append(htmlModal);
$('[data-logout]').on('click',function () {
    /*显示弹窗*/
    /*一定绑定一次  .off('click','.btn-primary').on('click','.btn-primary' */
    $('#logout').modal('show').off('click','.btn-primary').on('click','.btn-primary',function () {
        /*ajax退出*/
        $.ajax({
            type:'get',
            url:'/employee/employeeLogout',
            data:'',
            dataType:'json',
            success:function (data) {
                if(data.success){
                    //location.href = '/admin37/login.html';
                }
            }
        });
    });
    /*4.退出功能*/
    /*4.1 问题 每一个页面都需要  既要common.js又加一块html模态框*/
    /*4.2 方案 common.j 包含 html模态框 代码*/
});