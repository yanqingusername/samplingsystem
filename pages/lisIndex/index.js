const app = getApp()
const updateApp = require('../../utils/updateApp.js')
const box = require('../../utils/box.js')
const request = require('../../utils/request.js')

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

        that.getAutoLogin();
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
                            // wx.navigateTo({
                            //     url: '/pages/lisCustominfo/index',
                            // });
                            wx.navigateTo({
                                url: '/pages/lisTJMain/index',
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