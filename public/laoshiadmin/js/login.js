$(function () {
    /*参考文档地址：https://www.cnblogs.com/v-weiwang/p/4834672.html*/
    /*参考文档地址：http://blog.csdn.net/u013938465/article/details/53507109*/
    /*1.找到需要校验的表单*/
    /*2.调用校验插件方法*/
    $('#loginForm').bootstrapValidator({
        /*3.使用配置完成需求*/
        /*4.表单有四个状态：未校验，校验失败，校验成功，正在校验*/
        /*5.状态对应的图标 一般不改*/
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        /*配置需要校验的表单元素，校验的规则是什么*/
        fields:{
            /*那个表单元素要校验 通过名称去指定 name属性*/
            username:{
                /*校验规则 可以有多个*/
                validators:{
                    notEmpty:{
                        message:'用户名不能为空'
                    },
                    /*自定义规则*/
                    callback:{
                        message:'用户名不存在！'
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message:'密码不能为空'
                    },
                    stringLength:{
                        min:6,
                        max:18,
                        message:'密码在6-18个字符内'
                    },
                    /*自定义规则*/
                    callback:{
                        message:'密码错误！'
                    }
                }
            }
        }
    }).on('success.form.bv',function (e) {
        /*符合校验规则 点击提交按钮  会根据默认的地址（当前地址）默认的方式（get）的提交*/
        /*ajax提交  在提交的时候阻止默认的提交   浏览器默认行为*/
        /*当校验成功的时候  才去进行ajax提交  只有插件知晓*/
        e.preventDefault();
        /*ajax提交*/
        /*当前表单*/
        var $form = $(e.target);
        /*当前表单提交数据*/
        var serialize = $form.serialize();
        $.ajax({
            type:'post',
            url:'/employee/employeeLogin',
            data:serialize,
            dataType:'json',
            success:function (data) {
                if(data.success == true){
                    /*判断登录有没有成功*/
                    location.href = '/admin37/index.html';
                }else{
                    /*如果失败 判断错误的原因是什么*/
                    /*前端体现：对应的输入框状态为校验失败并且提示信息为服务端提示*/
                    /*修改校验状态是插件做 */
                    if(data.error == 1000){
                        /*用户后端校验失败 */
                        /*未校验  校验中  校验失败  校验成功*/
                        /*NOT_VALIDATED, VALIDATING, INVALID or VALID*/
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback');
                    }else if(data.error == 1001){
                        /*密码后端校验失败*/
                        $form.data('bootstrapValidator').updateStatus('password','INVALID','callback');
                    }
                }

            }
        });
    })


});