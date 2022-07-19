const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "",
        instrumentList: [
            // {channelName: "卡尤迪", channelId: "0"}
        ],
        value: '',
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
        });
    },
    onShow() {
            this.searchSelectchannel();
    },
    searchSelectchannel() {
        let that = this;
        let params = {
            name: that.data.value
        }
        request.request_coyote('/info/selectchannel.hn', params, function (res) {
            if (res) {
                if (res.code == 200) {
                  that.setData({
                    instrumentList: res.data
                  });
                } else {
                  box.showToast(res.message);
                }
              } else {
                box.showToast("网络不稳定，请重试");
              }
        });
    },
    /**
     * 返回
     */
    backPage() {
        wx.navigateBack({
            delta: 1
        });
    },
    onSearch(e) {
        this.setData({
            value: e.detail.value
        })

        this.searchSelectchannel();
    },

    clearSearchHandle() {
        this.setData({
            value: '',
            instrumentList: []
        });
        this.searchSelectchannel();
    },
    bindSelectChannel(e) {
        let channelid = e.currentTarget.dataset.channelid;
        let channelname = e.currentTarget.dataset.channelname;

        if (channelid && channelname) {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 2]; //获取上个页面栈                          
            prevPage.setData({
                channel_id: channelid,
                channel_name: channelname
            })
            
            wx.navigateBack({
                delta: 1,
            })
        }
    },
})