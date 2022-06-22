const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "",
        instrumentList: [{
                channel_name: '北京西站',
                channel_id: '1'
            },
            {
                channel_name: '北京南站',
                channel_id: '2'
            },
            {
                channel_name: '北京北站',
                channel_id: '3'
            },
            {
                channel_name: '北京东站',
                channel_id: '4'
            }
        ],
        value: '',
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
        });
    },
    onShow() {
        //     this.searchSampleTubeInfo(this.data.sampleid);
    },
    searchSampleTubeInfo(sampleid) {
        let that = this;
        let params = {
            sample_id: sampleid,
            id: that.data.id,
            box_num: that.data.boxnum
        }
        request.request_get('/eastbox/searchSampleTubeInfo.hn', params, function (res) {
            if (res) {
                if (res.success) {
                    that.setData({
                        instrumentList: res.result
                    });
                } else {
                    box.showToast(res.msg);
                    that.setData({
                        instrumentList: []
                    });
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

        //   this.searchSampleTubeInfo(e.detail.value);

    },

    clearSearchHandle() {
        this.setData({
            value: '',
            instrumentList: []
        });
        // this.searchSampleTubeInfo(this.data.value);
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