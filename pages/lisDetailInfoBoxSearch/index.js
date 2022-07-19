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
        boxnum: '',
        isShowEmpty: false
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
            this.searchSampleTubeInfo(this.data.sampleid, 2);
        }
    },
    searchSampleTubeInfo(sampleid, typest) {
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

                    if (typest == 2) {
                        if (that.data.instrumentList.length == 0) {
                            that.setData({
                                isShowEmpty: true
                            });
                        } else {
                            that.setData({
                                isShowEmpty: false
                            });
                        }
                    }
                } else {
                    box.showToast(res.msg);
                    that.setData({
                        instrumentList: []
                    });

                    if (typest == 2) {
                        if (that.data.instrumentList.length == 0) {
                            that.setData({
                                isShowEmpty: true
                            });
                        } else {
                            that.setData({
                                isShowEmpty: false
                            });
                        }
                    }
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

        if (this.data.value) {
            this.searchSampleTubeInfo(this.data.value, 2);
        } else {
            this.setData({
                value: '',
                instrumentList: [],
                isShowEmpty: false
            });
        }

    },

    clearSearchHandle() {
        this.setData({
            value: '',
            instrumentList: [],
            isShowEmpty: false
        });
        // this.searchSampleTubeInfo(this.data.value,1);
    },

})