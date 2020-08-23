$(function () {
    // 为 art-template 定义时间过滤器
    template.defaults.imports.dateFormat = function (dtStr) {
        var dt = new Date(dtStr)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 在个位数的左侧填充 0
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }


    // 1.定义提交参数;
    var q = {
        pagenum: 1, // 页码值
        pagesize: 2, // 每页显示多少条数据
        cate_id: "",// 文章分类的 Id
        state: "",// 文章的状态，可选值有：已发布、草稿
    };

    // 2.初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                var str = template("tpl-table", res);
                $("tbody").html(str);
                // 分页
                renderPage(res.total)
            }
        })
    }

    // 3.初始化分类
    var form = layui.form;  // 导入form
    initCate(); // 调用函数
    // 封装
    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function (res) {
                // 校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                // 赋值，渲染form
                var htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                form.render();
            }
        })
    }

    // 4.筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        // 获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        // 赋值
        q.state = state;
        q.cate_id = cate_id;
        // 初始化文章列表
        initTable();
    })

    // 5.分页
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 第几页

            // 分页模块设置，显示哪些些子模块
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], // 每页显示多少条数据的选择器

            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                console.log(first, obj.curr, obj.limit); //得到当前页，以便向服务端请求对应页的数据。
                // 赋值页面
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    // 6.删除
    var layer = layui.layer;
    $("tbody").on("click", ".btn-delete", function () {
        // ！！！ 4.1 先获取 Id ,进入到函数中this代指就改变了
        var Id = $(this).attr("data-id");
        // 4.1 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg("恭喜您，文章删除成功！");
                    // 页面汇总删除按钮个数等于1，页码大于1；
                    if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    // if ($("tbody tr").length == 1 && q.pagenum > 1) q.pagenum--;
                    // 因为我们更新成功了，所以要重新渲染页面中的数据
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})