const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "",
      boxnum: "",
      instrumentList:[],
      keyvalue: ''
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
            boxnum: options.boxnum
        });
    },
    onShow() {
        if(this.data.boxnum){
            this.searchSampleBoxInfo(this.data.boxnum);
        }
    },
    searchSampleBoxInfo(boxnum) {
        let that = this;
        let params = {
          id: that.data.id,
          boxnum: boxnum
        }
        request.request_coyote('/info/selectboxnum.hn', params, function (res) {
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
    onSearch(e){
        this.setData({
            keyvalue: e.detail.value
          })

          this.searchSampleBoxInfo(e.detail.value);
        
      },
      
      clearSearchHandle() {
        this.setData({
            keyvalue: '',
            instrumentList: []
        });
        this.searchSampleBoxInfo(this.data.keyvalue);
      },
      clickItem(e){
        let box_num = e.currentTarget.dataset.boxnum;
        // let status = e.currentTarget.dataset.statusstring;
        if (box_num) {
            wx.redirectTo({
                url: `/pages/lisCoyoteDetailInfoBox/index?boxnum=${box_num}`,
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