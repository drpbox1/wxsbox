// var token = localStorage.getItem("token");
// if (token === null || token === "" || typeof token === "underfined") {
//     window.location.href = 'login.html';
// } 
// var url = 'http://sharebook.wenweikeji.com/admin/';
var url = 'http://120.77.245.43:8084/'; 
setTime = function (data) {
    for(var i in data){
        for(var j in data[i]){
            if(j === 'createdTime')
                data[i].createdTime = formDate(data[i][j]);
            else if(j === 'returnTime')
                data[i].returnTime = formDate(data[i][j]);
            else if(j === 'updateTime')
                data[i].updateTime = formDate(data[i][j]);
            else if(j === 'createTime')
                data[i].createTime = formDate(data[i][j]);
            else if(j === 'times')
                data[i].times = formDate(data[i][j]);
            else if(j === 'userRegisterTime')
                data[i].userRegisterTime = formDate(data[i][j]);
            else if (j === 'updatedTime')
                if (data[i][j] !== null) {
                    data[i].updatedTime = formDate(data[i][j])
                }

        }
    }
    return data;
};

Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

formDate = function (date) {
    var str = new Date(date);
    var year = str.getFullYear();
    var month = (str.getMonth() + 1) >= 10 ? str.getMonth() + 1 : str.getMonth()+1;
    var day = str.getDate() >= 10 ? str.getDate() : '0' + str.getDate();
    var hour = str.getHours() >= 10 ? str.getHours() : '0' + str.getHours();
    var minute = str.getMinutes() >= 10 ? str.getMinutes() : '0' + str.getMinutes();
    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
};
//表单数据转json
formToJson = function (data) {
    data = decodeURIComponent(data, true);//防止中文乱码
    data = data.replace(/&/g, "','");
    data = data.replace(/=/g, "':'");
    data = "({'" + data + "'})";
    obj = eval(data);
    return obj;
};

 
var ajax_method = function (action, method, data,token,fnSuccess) {
    $.ajax({
        url: url + action, 
        type: method,
        data: data, 
        beforeSend: function (XMLHttpRequest) {  
                XMLHttpRequest.setRequestHeader("ww-token", token);  
        },  
        success: function (res) { 
             fnSuccess(res);
        },
        error: function (err) {
            alert(JSON.stringify(err));
        }
    });
};

getBanner = function () {
    $.ajax({
        url: url + 'getBanners',
        type: 'GET',
        success: function (res) {
            if (res.code === 200) {
                return res.data;
            }
            else
                return [];
        },
        error: function (err) {
            return [];
        }
    })
};

getMessage = function () {
    var currentPage = 1;
    $.ajax({
        url: url + 'getAdminMessages?currentPage=' + currentPage + '&pageSize=10',
        type: 'GET',
        success: function (res) {
            var code = res.code;
            var data = res.data;
            var html = "";
            var total = res.total;
            if (code === 200) {
                for (var i = 0; i < data.length; i++) {
                    html += '<tr class="text-c">';
                    html += '<td><input type="checkbox" value="1" name=""></td>';
                    html += '<td>' + (i + 1) + '</td>';
                    html += '<td>' + data[i].title + '</td>';
                    html += '<td>' + data[i].content + '</td>';
                    html += '<td>' + data[i].userId + '</td>';
                    html += '<td>' + formDate(data[i].createdTime) + '</td>';
                    html += '<td class="td-manage"> <a title="删除" href="javascript:;" onclick="deleteMessage(' + data[i].id + ')" class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a></td>';
                    html += '</tr>';
                }
                $("#mTotal").html(total);
                $("#mBody").html(html);
            }
            $('.table-sort').dataTable({
                "aaSorting": [[1, "desc"]],//默认第几个排序
                "bStateSave": true,//状态保存
                "aoColumnDefs": [
                    //{"bVisible": false, "aTargets": [ 3 ]} //控制列的隐藏显示
                    // {"orderable":false,"aTargets":[0,8]}// 制定列不参与排序
                ]
            });
        },
        error: function () {

        }
    });
};

addMessage = function () {
    var data = $("#form-message-add").serialize();
    data = formToJson(data);
    $.ajax({
        url: url + 'insetMessage',
        type: 'POST',
        data: data,
        success: function (response) {
            if (response.code === 200) {
                layer.msg('添加成功!', {icon: 1, time: 1000});
                layer_close();
            }
            else
                layer.msg('添加失败!', {icon: 1, time: 1000});
        },
        error: function () {
            layer.msg('添加失败!', {icon: 1, time: 1000});
        }
    });
};

deleteMessage = function (id) {
    $.ajax({
        url: url + 'deleteMessage',
        type: 'DELETE',
        data: {messageId: id},
        success: function (res) {
            if (res.code === 200) {
                layer.msg('删除成功', {icon: 1, time: 1000});
            } else
                layer.msg(res.data, {icon: 1, time: 1000});
        }
    });
};

addBanner = function () {
    var data = $("#form-banner-add").serialize();
    data = formToJson(data);
    $.ajax({
        url: url + 'insetBanner',
        type: 'POST',
        data: data,
        success: function (res) {
            if (res.code === 200) {
                layer.msg('添加成功', {icon: 1, time: 1000});
                layer_close();
            } else
                layer.msg(res.data, {icon: 1, time: 1000});
        },
        error: function (res) {

        }
    })
};



