const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "",
      sampleid: "",
      instrumentList:[],
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
        if(this.data.sampleid){
            this.searchSampleTubeInfo(this.data.sampleid);
        }
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
    onSearch(e){
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
      clickItem(e){
        let sampleid = e.currentTarget.dataset.sampleid;
        if(sampleid){
            wx.navigateTo({
                url: `/pages/lisCoyoteCellDetails/index?sampleid=${sampleid}`,
            });
        }
      }
})