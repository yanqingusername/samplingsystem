const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "",
      boxnum: "",
      instrumentList:[],
      value: '',
      isShowEmpty: false
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
            boxnum: options.boxnum
        });
    },
    onShow() {
        if(this.data.boxnum){
            this.searchSampleBoxInfo(this.data.boxnum,2);
        }
    },
    searchSampleBoxInfo(boxnum,typest) {
        let that = this;
        let params = {
          id: that.data.id,
          box_num: boxnum
        }
        request.request_get('/eastbox/searchSampleBoxInfo.hn', params, function (res) {
            if (res) {
                if (res.success) {
                    that.setData({
                        instrumentList: res.result
                    });

                    if(typest == 2){
                        if(that.data.instrumentList.length == 0){
                            that.setData({
                                isShowEmpty: true
                            });
                        }else{
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

                    if(typest == 2){
                        if(that.data.instrumentList.length == 0){
                            that.setData({
                                isShowEmpty: true
                            });
                        }else{
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
    onSearch(e){
        this.setData({
            value: e.detail.value
          })

          this.searchSampleBoxInfo(e.detail.value,2);
        
      },
      
      clearSearchHandle() {
        this.setData({
            value: '',
            instrumentList: [],
            isShowEmpty: false
        });
        // this.searchSampleBoxInfo(this.data.value,1);
      },
      clickItem(e){
        let box_num = e.currentTarget.dataset.boxnum;
        let status = e.currentTarget.dataset.statusstring;
        if (box_num && status) {
            wx.redirectTo({
                url: `/pages/lisDetailInfoBox/index?boxnum=${box_num}&st=${status}`,
            });

            // this.$router.push({
            //     path: "/lisDetailInfoBox",
            //     query: {
            //         id: this.id,
            //         boxnum: box_num,
            //         st: status
            //     }
            // });
        }
      },
    
})