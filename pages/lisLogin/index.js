const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {        
        codeBtText: "获取验证码",
        codeBtState: false,
        currentTime: 60,
        phone: "",
        code:"",
        phoneCode: ["", ""], //正确的 手机号 和 验证码
    },

    phoneInput: function (e) {
        console.log(e.detail.value)
        var that = this;
        that.setData({
            phone: e.detail.value,
        })
    },
    codeInput: function (e) {
        var that = this;
        that.setData({
            code: e.detail.value,
        })
    },

    //***定义60，减少赋值次数
    //******************获取验证码按钮**********************
    getCode: function () {
        var that = this;
        var phone = that.data.phone;
        var currentTime = that.data.currentTime;
        console.log("需要获取验证码的手机号" + phone);
        if (that.data.codeBtState) {
            console.log("还未到达时间");
        } else {
            if (phone == '') {
                box.showToast("请填写手机号")
            } else if (!utils.checkPhone(phone)) {
                box.showToast("手机号有误")
            } else {
                //倒计时,不管验证码发送成功与否，都进入倒计时，防止多次点击造成验证码发送失败**************************
                that.setData({
                    codeBtState: true
                });
                var interval = setInterval(function () {
                    currentTime--;
                    that.setData({
                        codeBtText: currentTime + 's'
                    });
                    if (currentTime <= 0) {
                        clearInterval(interval)
                        that.setData({
                            codeBtText: '重新发送',
                            currentTime: 60,
                            codeBtState: false,
                        });
                    }
                }, 1000);
                
                // 服务器发送验证码***********************
                request.request_get('/support/Verification.hn', { phone: phone }, function (res) {
                    console.info('回调', res)
                    if(res){
                        if(res.success){
                            console.log('验证码发送成功，获取的验证码' + res.code);
                            that.setData({ phoneCode: [phone, res.code] });
                        }else{
                            box.showToast("验证码发送失败");
                        }
                    }
                })
            }
        }
    },

    //************登录*******************
    commit: function (e) {
        var that = this;
            if(that.data.phone == ""){
                box.showToast("账号不能为空");
                return
            }else if (that.data.code == "") {
                box.showToast("密码不能为空")
                return
            }else{
                var data = {
                    // openid: app.globalData.openid,
                    person_phone: that.data.phone,
                    password: that.data.code
                }
                request.request_get('/eastlogin/login.hn', data, function (res) {
                    if(res){
                        if(res.success){
                            if(res.allow_auto_login == 1 || res.allow_auto_login == 0){
                                let userInfo = res.result[0];
                                app.globalData.userInfo = userInfo;
                                wx.setStorageSync('lisPhone',that.data.phone);
                                wx.setStorageSync('lisPassword',that.data.code)
                                // wx.navigateTo({
                                //     url: '/pages/lisCustominfo/index',
                                // });
                                
                                if(userInfo.city == 1){
                                    wx.navigateTo({
                                        url: '/pages/lisYXMain/index',
                                    });
                                } else {
                                    wx.navigateTo({
                                        url: '/pages/lisCustominfo/index',
                                    });
                                }
                            }
                        }else{
                            box.showToast(res.msg);
                        }
                    }
                })
            }
    },
    bindAccountApplication(){
        wx.navigateTo({
            url: '/pages/lisAccountApplication/index'
        });
    }
})
