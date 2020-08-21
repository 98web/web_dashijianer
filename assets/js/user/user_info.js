$(function () {
    //自定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度为1到6之间";
            }
        }
    })


    //用户渲染
    initUserInfo();
    // 导出layer
    var layer = layui.layer
    //封装函数
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 重置表单的数据
    $('#btnReset').on('click', function (e) {
        console.log("ok");
        // 阻止表单的默认重置行为
        e.preventDefault();
        initUserInfo();
    })


    //修改用户信息
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("恭喜你，修改成功！")
                window.parent.getUserInof();
            }
        })
    })



})