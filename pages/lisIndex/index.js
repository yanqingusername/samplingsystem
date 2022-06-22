const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const login = require('../../utils/login.js')

Page({
    onShow: function () {
        var that = this;
        console.log("进入index index页面")
        // 自动检查小程序版本并更新
        updateApp.updateApp("核酸检测信息采集系统");

        // 获取设备信息
        wx.getSystemInfo({
            success: res => {
                app.globalData.systeminfo = res
            }
        })
        // 获取微信小程序配置
        // 登录小程序
        // that.loginApp();

        that.getAutoLogin();
    },

    // 获取微信code登录小程序
    loginApp: function () {
        wx.login({
            success: (res) => {
                var code = res.code;
                console.log("获取code成功" + code);
                request.request_get('/support/entryApp.hn', {
                    wxCode: code
                }, function (res) {
                    console.info('回调', res);
                    //判断为空时的逻辑
                    if (res) {
                        if (res.success) {
                            app.globalData.openid = res.openid;
                            console.log("获取的用户openid" + app.globalData.openid);
                            if (res.code == '200') { //没有登陆过小程序
                                wx.reLaunch({
                                    url: '/pages/index/login',
                                })
                            } else if (res.code == '199') { // 获取登录账号的相关信息
                                var phone = res.phone;
                                login.toLogin(phone);
                            }else{
                                box.showToast("网络不稳定，请重试");
                              }
                        } else {
                            box.showToast(res.msg);
                        }
                    }else{
                        box.showToast("网络不稳定，请重试");
                      }
                })
            },
            fail: (res) => {
                box.showToast("请求超时，请检查网络是否连接")
            }
        })
    },
    getAutoLogin(){
        let that = this;
        let phone = wx.getStorageSync('lisPhone');
        let password = wx.getStorageSync('lisPassword');
        if(phone && password){
            let data = {
                person_phone: phone,
                    password: password
            }
            request.request_get('/eastlogin/login.hn', data, function (res) {
                if(res){
                    if(res.success){
                        if(res.allow_auto_login == 0){
                            let userInfo = res.result[0];
                            app.globalData.userInfo = userInfo;
                            wx.navigateTo({
                                url: '/pages/lisCustominfo/index',
                            });
                        }
                    }else{
                        box.showToast(res.msg);
                    }
                }else{
                    box.showToast("网络不稳定，请重试");
                  }
            })
        }else{
            wx.reLaunch({
                url: '/pages/lisLogin/index',
            })
        }
    }
   
})