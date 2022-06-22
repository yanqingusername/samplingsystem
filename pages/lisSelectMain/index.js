const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
    
    },
    onLoad: function (options) {
        
    },
    onShow() {
    },
    
    /**
     * 返回
     */
    backPage() {
        wx.navigateBack({
            delta: 1
        });
    },
    clickDongruan(e) {
        wx.navigateTo({
            url: '/pages/lisMain/index',
        });
    },
    clickCoyote(e) {
        wx.navigateTo({
            url: '/pages/lisCoyoteMain/index',
        });
    },
})