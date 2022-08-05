<!DOCTYPE html>
<html>

<head>
    <title>卡尤迪箱码样本转运</title>
    <meta name="keywords" content="keyword1,keyword2,keyword3">
    <meta name="description" content="this is my page">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <!--   <link rel="stylesheet" href="./css/jquery.mobile-1.4.5.min.css" />-->
    <script src="./js/jquery-1.11.1.min.js"></script>
    <script src="./js/jquery.mobile-1.4.5.min.js"></script>
    <script src="./js/jweixin-1.0.0.js"></script>
       <script src="./js/NEWJSSDK.js"></script>
    <script type="text/javascript" src="layui/layui.js"></script>
    <script type="text/javascript" src="layui/layui.all.js"></script>
    <link rel="stylesheet" type="text/css" href="layui/css/layui.css">
    <style type="text/css">
        body {
            background-color: #FBFCFC;
        }

        fieldset {
            -webkit-appearance: none;
            width: 100%;
            border: 1px soild #333;
            margin: 0;
            font-family: inherit;
            font-size: 100%;
            -moz-box-sizing: border-box;
            box-size: border-box;
            text-decoration: none;
        }

        .ui-input-text {
            border-style: unset;
            min-width: 60%;
            -webkit-box-shadow: none;
        }

        .ui-focus {
            -moz-box-shadow: none !important;
            -webkit-box-shadow: none !important;
            box-shadow: none !important;
        }

        .sampling_location_info {
            border-radius: 20px;
            margin-bottom: 80px;
            text-align: center;
        }

        .local_info {
            margin: 2px 5px;
            min-height: 30px;
            align-items: center;
            flex-wrap: wrap;
            max-width: 100%;
            word-break: break-all;
            background-color: #F5F5F5;
            display: flex;
            padding: 5px;
            border-radius: 10px;
        }

        .somthing {
            margin: 0px auto 80px;
        }

        .record {
            position: relative;
            margin: 0px auto 10px;
            display: block;
            padding: 0.2rem 0.8rem;
            border-radius: 9px;
            background-color: #fff;
        }

        .line {
            width: 100%;
            margin: auto;
            border-bottom: solid 1px #e8e8e8;
        }

        .ui-icon-adds {
            background: url(images/add_small.png) 15% 50% no-repeat;
            background-size: 16px;
        }

        .ui-btn-icon-left:after {
            background-color: transparent;
        }

        .somthing .item_name {
            border: 0px;
            border-radius: 10px;
            width: 90%;
            margin: 10px 0px;
        }

        div {
            text-shadow: #fff 0px 0px 0px;
        }

        input {
            text-shadow: #fff 0px 0px 0px;
        }

        .sampling_detail {
            background-color: #ffffff;
            width: 70%;
            padding: 10px 0px;
            min-height: 60px;
            border-radius: 10px;
            margin: 0 auto 10px;
        }

        .confirm_ul {
            list-style: none;
            margin: 0px;
            padding: 0px;
            width: 70%;
            margin: auto;
            margin-top: 60%;
        }

        .confirm_title {
            background: #F2F2F2;
            text-align: left;
            padding-left: 20px;
            line-height: 60px;
            border: 1px solid #999;
        }

        .confirm_content {
            background: #fff;
            text-align: center;
            font-size: 16px;
            margin: 0;
            padding: 10px;
            line-height: 50px;
            border: none;
            border-radius: 10px 10px 0px 0px;
        }

        .confirm_btn-wrap {
            background: #fff;
            height: 40px;
            line-height: 30px;
            text-align: right;
            border: none;
            border-radius: 0px 0px 10px 10px;
            display: flex;
        }

        .confirm_btn {
            color: #ababab;
            font-size: 18px;
            width: 50%;
            text-align: center;
        }

        .confirm_btn-wrap>a:nth-child(1) {
            color: #9c9898;
            font-size: 18px;
            width: 50%;
            text-align: center;
        }

        .record {
            position: relative;
            z-index: 100;
            display: block;
            border: none;
            border-radius: 9px;
            color: rgb(0, 0, 0);
            /*box-shadow: 2px 2px 5px rgb(7 7 7/ 40%);*/
            background-color: #fff;
            margin-bottom: 10px;
            /*font-size: 20px;*/
        }

        .relate {
            /*position: absolute;*/
            /*top: 60px;*/
            /*right: 14px;*/
            width: 100px;
            padding: 4px 0px;
        }

        .popupStyle {
            display: none;
            width: 160px;
            background-color: rgb(85, 85, 85);
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 8px 0;
            position: fixed;
            text-align: center;
            z-index: 99999999;
            top: 40%;
            left: 50%;
            margin-left: -80px;
        }

        select {
            position: relative;
            width: 180px;
            height: 42px;
            background: rgba(159, 164, 174, 0);
            border: 1px solid #D8DCE5;
            border-radius: 4px;
            margin-right: 10px;
            padding-left: 10px;
            appearance: none;
            box-sizing: border-box;
            color: #999;
        }

        option {
            color: #333 !important;
        }

        .popupStyle::after {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #555 transparent transparent transparent;
        }

        #company-button>span{
            display: none;
        }

        h1{
            display: none;
        }
    </style>
</head>

<body>
<div data-role="page" data-title="卡尤迪箱码样本转运"
     style="background-color: #F5F5F5;">

    <div data-role="content">
        <div class="res-div1 record">
            <!--            <div class="res-item">-->
            <!--               <div id="user_name" class="input-item"-->
            <!--                  style="margin: 10px; color: black; font-size: 24px; font-weight: 600;"></div>-->
            <!--            </div>-->
            <div class="res-company"style="display: flex;align-items: center;margin-top: 10px;">
                <div style="font-size: 18px;">采样点：</div>
                <div style="width: 74%;" class="layui-form">
                    <select id="company" lay-search="" lay-filter="company">
                        <option value="">请选择所属采样点</option>
                    </select>
                </div>
            </div>
            <div class="res-item" style="display: flex;align-items: center;margin-top: 10px;">
                <div style="font-size: 18px;">箱码号：</div>
                <div style="width: 74%;display: flex;align-items: center;">
                    <input id="label" type="text" placeholder="请输入箱码号" maxlength="8"
                           class="input-item" style="border: 1px solid #333333;padding: 6px;width: 85%;">
                    <button id="scanQRCode" class='relate' type="button"
                            style="width: 90px; margin: 0px;">扫一扫</button>
                </div>
            </div>
            <div class="res-jobtype" style="display: flex;align-items: center;margin-top: 10px;">
                <div style="font-size: 18px;">试管数：</div>
                <div style="width: 74%;">
                    <input id="samplenumber" type="text" placeholder="请输入试管数量" maxlength="3"
                           class="input-item" style="border: 1px solid #333333;padding: 6px;width: 94%;">
                </div>
            </div>

            <div class="res-item" style="margin-top: 10px;">
                <button id="sign" type="button" onclick="doSign()" style="width: 100%;height: 40px;">提交</button>
            </div>

            <div style="height: 10px;"></div>
        </div>

        <div style="display:flex;">
            <ul style="overflow: auto;">
                <li style="display: inline-block;">
                    <table id="demo" class="layui-table" lay-filter="demo"></table>
                </li>
            </ul>
        </div>
    </div>
</div>
</body>
<script type="text/javascript">
    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var Request = new Object();
    Request = GetRequest();
    var openid = Request['openid'];

    var valOpenid;
    var table = layui.table;

    getOpenid();
    function getOpenid() {
        var varUrl = "../CaseCodeContoller/autoLogin.hn";
        $.ajax({
            url : varUrl,
            type : 'get',
            dataType : "json",
            success : function(data) {
                //code无效
                console.log(data)
                if (!data.success && "1000" == data.error_code) {
                    location.replace("https://lisalarm.coyotebio-lab.com/goLoginPForCase.html");
                    //跳转微信重定向链接
                }
                if (data.success && "101" == data.code) {
                    //自动登陆失败,需要手动登录
                    location.replace("https://lisalarm.coyotebio-lab.com/goLoginPForCase.html");
                    //跳转微信重定向链接
                }
                if (data.success && "200" == data.code) {
                    //自动登录成功
                    valOpenid = data.openid;

                    layui.use('table', function() {
                        table.render({
                            elem : '#demo',
                            url : '../CaseCodeContoller/showSubmitInfo.hn',
                            title : '箱码表',
                            id : 'demo',
                            // toolbar : '#toolbarDemo',
                            where : {
                                openid : valOpenid
                                // openid: 'oqrotw7an0F8oU-Btd96iYctEqHI'
                            },
                            cols : [ [ {
                                type : 'id',
                                hide : true,
                            },
                                // {
                                //     field : 'user_name',
                                //     title : '姓名',
                                //     width : 100,
                                //     align : 'center',
                                // },
                                {
                                    field : 'case_code',
                                    title : '箱码号',
                                    width : 100,
                                    align : 'center',
                                },
                                {
                                    field : 'case_num',
                                    title : '试管数',
                                    width : 80,
                                    align : 'center',
                                },
                                {
                                    field : 'channel_name',
                                    title : '采样点',
                                    width : 200,
                                    align : 'center',
                                },
                                // {
                                //     field : 'user_phone',
                                //     title : '手机号',
                                //     width : 120,
                                //     align : 'center',
                                // },
                                {
                                    field : 'create_time',
                                    title : '创建时间',
                                    width : 180,
                                    align : 'center',
                                }
                            ] ],
                            done : function(res, curr, count) {
                                console.log(res)
                                // $('th').css({
                                //     'font-size' : '14',
                                //     'color' : 'black'
                                // }); // 表头设置
                                // for (var i in res.data) {
                                //     var item = res.data[i];
                                //     console.log(item.sign_back_time)
                                //     if (item.sign_back_time == "") {
                                //        $("tr[data-index='" + i + "']").attr({
                                //           "style" : "color:red",
                                //           "font-weight" : "bold"
                                //        }) //改变当前行颜色
                                //     }
                                // }
                            },
                            page : { //详细参数可参考 laypage 组件文档
                                layout : [ 'prev', 'page', 'next', 'count' ] //自定义分页布局
                            },
                            response : {
                                statusCode : true //重新规定成功的状态码为 200，table 组件默认为 0
                            },
                            parseData : function(res) { //将原始数据解析成 table 组件所规定的数据
                                console.log(res)
                                return {
                                    "code" : res.success, //解析接口状态
                                    "msg" : res.msg, //解析提示文本
                                    "count" : res.count, //解析数据长度
                                    "data" : res.result //解析数据列表
                                };
                            }
                        });

                        // 监听点击事件
                        table.on('tool(demo)', function(result) {
                            let event = result.event;
                            let row = result.data;
                            console.info("click call", result);
                            if (event === "pro-view") {
                                // 处理你的业务逻辑
                            }
                        })
                    });
                }
            }
        });
    }
    var form;
    selectchannel();
    function selectchannel() {
        layui.use('form', function() {
            form = layui.form;
            //渲染下拉搜索框
            $.ajax({
                type: "get",
                url: "../CaseCodeContoller/getAllChannel.hn",
                dataType: "json",
                data: {},
                success: function (msg) {
                    console.log(msg)
                    if(msg.success){
                        var listData = msg.channelList
                        // listData.unshift({channel_name: '请选择所属采样点'})
                        var sel = ''
                        for (var i = 0; i < listData.length; i++) {
                            //如果在select中传递其他参数，可以在option 的value属性中添加参数
                            sel+="<option value='"+listData[i].channel_name+"'>" + listData[i].channel_name + "</option>"
                        }
                        $("#company").append(sel);

                        var channel_name = localStorage.getItem("channel_name");
                        $("#company").val(channel_name);
                        form.render(); //更新全部

                    }else{
                        handleDomMsg(msg.message);
                    }

                }, error: function () {
                    handleDomMsg("获取数据失败");
                }
            });

            //监听下拉框
            form.on('select(company)', function (data) {
                var txt = $("#company option:selected").text();//获取select选中的值
                localStorage.setItem("channel_name",txt);
                $('.company').html(txt);
            });
        })

        // $.ajax({
        //     type: "get",
        //     url: "../CaseCodeContoller/getAllChannel.hn",
        //     dataType: "json",
        //     data: {},
        //     success: function (msg) {
        //        console.log(msg)
        //        if(msg.success){
        //           var listData = msg.channelList
        //           // $("#company").prepend("<option value='0'>请选择采样点</option>");//添加第一个option值
        //           for (var i = 0; i < listData.length; i++) {
        //              //如果在select中传递其他参数，可以在option 的value属性中添加参数
        //              $("#company").append("<option value='"+listData[i].channel_name+"'>" + listData[i].channel_name + "</option>");
        //           }
        //        }else{
        //           handleDomMsg(msg.message);
        //        }
        //     }, error: function () {
        //        handleDomMsg("获取数据失败");
        //     }
        // });
    }

    // DOM 弹窗
    function handleDomMsg(message) {
        const div = document.createElement("div");
        document.body.appendChild(div);
        div.innerHTML = message || "this is a Message";
        div.className = "popupStyle";
        div.style.display = "block";
        setTimeout(() => {
            div.remove();
        }, 2000);
    }

    function Confirm(str, click) {
        var confirmFram = document.createElement("DIV");
        confirmFram.id = "confirmFram";
        confirmFram.style.position = "fixed";
        confirmFram.style.width = "100%";
        confirmFram.style.height = "120%";
        confirmFram.style.top = "0";
        confirmFram.style.textAlign = "center";
        confirmFram.style.lineHeight = "150px";
        confirmFram.style.zIndex = "300";
        confirmFram.style.backgroundColor = "rgba(0, 0, 0, 0.58)";
        confirmFram.style.fontSize = "12px";
        strHtml = '<ul class="confirm_ul">';
        strHtml += '<li class="confirm_content">' + str + '</li>';
        strHtml += '<li class="confirm_btn-wrap"><a type="button" value="取消" onclick="doFalse()" class="confirm_btn">取消</a><a type="button" value="确定" onclick="doOk()" class="confirm_btn">确定</a></li>';
        strHtml += '</ul>';
        confirmFram.innerHTML = strHtml;
        document.body.appendChild(confirmFram);
        this.doOk = function() {
            confirmFram.style.display = "none";
            if (typeof click == "function") {
                click();
                return true;
            }

        }
        this.doFalse = function() {
            confirmFram.style.display = "none";
            if (typeof click == "function") {
                return false;
            }

        }
    }

    function doSign() {

        if ($(".res-company").css("display") != "none") {
            if (document.getElementById("company").value == 0 || document.getElementById("company").value == '请选择所属采样点') {
                alert("请选择所属采样点")
                return;
            }
        }

        if ($("#label").val() == "") {
            handleDomMsg("请输入箱码号!");
            return;
        }

        if ($("#samplenumber").val() == "") {
            handleDomMsg("请输入试管数量!");
            return;
        }

        var label = $('#label').val();
        var regu = "^[0-9]+$";
        var re = new RegExp(regu);
        if (label.search(re)== -1) {
            $('#label').focus();
            $('#label').val('');
            alert("箱码号只能包含数字！")
            return;
        }

        var samplenumber = $('#samplenumber').val();
        var regu1 = "^[0-9]+$";
        var re1 = new RegExp(regu1);
        if (samplenumber.search(re1)== -1) {
            $('#samplenumber').focus();
            $('#samplenumber').val('');
            alert("试管数只能包含数字！")
            return;
        }

        if ($("#samplenumber").val().length > 3) {
            handleDomMsg("试管数最多三位数!");
            return;
        }

        Confirm('确认提交', function() {
            Sign();
        })
    }

    function Sign() {
        console.log(valOpenid);
        $.ajax({
            url: "../CaseCodeContoller/doSubmit.hn",
            type : 'get',
            dataType : "json",
            data : {
                openid : valOpenid,
                channel_name : document.getElementById("company").value,
                case_code: $("#label").val(),
                case_num: $("#samplenumber").val(),

            },
            success : function(data) {
                if (data.success) {
                    handleDomMsg(data.msg);
                    //执行重载
                    table.reload('demo', {
                        page : {
                            curr : 1
                        },
                        where : {
                        }
                    });
                    // document.getElementById("company").value = '';
                    $("#label").val("");
                    $("#samplenumber").val("");
                } else {
                    handleDomMsg(data.msg);
                    return;
                }
            }
        });
    }
</script>
</html>