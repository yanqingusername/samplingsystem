const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "",
        sampleid: "",
        instrumentList: [],
        value: '',
        boxnum: ''
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
            boxnum: options.boxnum,
            sampleid: options.sampleid
        });
    },
    onShow() {
        if (this.data.sampleid) {
            this.searchSampleTubeInfo(this.data.sampleid);
        }
    },
    searchSampleTubeInfo(sampleid) {
        let that = this;
        let params = {
            sampleId: sampleid,
            id: that.data.id,
            //   box_num: that.data.boxnum
        }
        request.request_coyote('/info/selectsample.hn', params, function (res) {
            if (res) {
                if (res.data.success == 0) {
                    that.setData({
                        instrumentList: res.data.list
                    });
                } else {
                    box.showToast(res.message);
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

        this.searchSampleTubeInfo(e.detail.value);

    },

    clearSearchHandle() {
        this.setData({
            value: '',
            instrumentList: []
        });
        this.searchSampleTubeInfo(this.data.value);
    },
    clickItem(e) {
        let sampleid = e.currentTarget.dataset.sampleid;
        let uid = e.currentTarget.dataset.uid;
        if (sampleid && uid) {
            wx.navigateTo({
                url: `/pages/lisCoyoteCellDetails/index?sampleId=${sampleid}&uid=${uid}`,
            });
        }
        // let typestatus = e.currentTarget.dataset.typestatus;
        // if (sampleid && typestatus) {
        //     if (typestatus == 1) {
        //         if (uid) {
        //             wx.navigateTo({
        //                 url: `/pages/lisCoyoteCellDetails/index?sampleId=${sampleid}&uid=${uid}`,
        //             });
        //         }
        //     } else {
        //         wx.navigateTo({
        //             url: `/pages/lisCoyoteMoreCellDetails/index?sampleId=${sampleid}`,
        //         });
        //     }
        // }
    }
})