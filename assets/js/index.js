$(function () {
    getUserInof();
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清除缓存
            localStorage.removeItem('token');
            //页面跳转
            location.href = "/login.html";

            layer.close(index);
        });
    })
})
//封装
function getUserInof() {
    $.ajax({
        url: '/my/userinfo',
        success: function (res) {
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message);
            }
            renderAvatar(res.data);
        }
    })
}
//渲染头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic !== null) {
        $('.layui-nav-img').show().attr('src', user.user_pic);
        $('.user-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var text = name[0].toUpperCase();
        $('.user-avatar').show().html(text);
    }
}