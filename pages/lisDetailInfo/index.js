const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')
var time = require('../../utils/time.js')

Page({
    data: {
        tabIndex: 0,
        id: "",
        instrumentList: [],
        currentDate: time.timeFormat1(new Date()),
        maxDate: time.timeFormat1(new Date()),
        box_sum: 0,
        sample_sum: 0,
        stay_transport_sum: 0,
        transporting_sum: 0
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
        });
    },
    onShow() {
        this.getAlreadySmapleInfo();
    },
    getAlreadySmapleInfo() {
        let that = this;
        let params = {
            id: that.data.id,
            create_time: that.data.currentDate,
            status: that.data.tabIndex == 0 ? '' : that.data.tabIndex
        }
        request.request_get('/eastbox/getAlreadySmapleInfo.hn', params, function (res) {
            if (res) {
                if (res.success) {
                    that.setData({
                        box_sum: res.box_sum,
                        sample_sum: res.sample_sum,
                        instrumentList: res.result,
                        stay_transport_sum: res.stay_transport_sum,
                        transporting_sum: res.transporting_sum
                    });
                } else {
                    box.showToast(res.msg);
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
    clickSearch() {
        wx.navigateTo({
            url: '/pages/lisDetailInfoSearch/index',
        });

        // this.$router.push({
        //     path: "/lisDetailInfoSearch",
        //     query: {
        //         id: this.id,
        //         boxnum: ''
        //     }
        // });
    },
    // 扫描
    scanQRCodeClick() {
        this.getScanQRCodeClick();
        // this.getBindSearch('567890');
    },
    getScanQRCodeClick() {
        // 点击的时候调起扫一扫功能呢
        let that = this;
        wx.scanCode({
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success(res) {
                console.log('---->:', res.result)
                let boxCodeNumber = res.result;
                if (boxCodeNumber) {
                    that.getBindSearch(boxCodeNumber);
                }
            },
            fail(res) {
                console.log("err", res);
            },
        });
    },
    bindDateChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            currentDate: e.detail.value
        })
        
        this.instrumentList = [];
        this.getAlreadySmapleInfo();
      },
    clickTabIndex(e) {
        let number = e.currentTarget.dataset.tabstring;
        this.setData({
            tabIndex: number
        });
        this.getAlreadySmapleInfo();
    },
    /**
     * 
     */
    getBindSearch(boxCodeNumber) {
        wx.navigateTo({
            url: `/pages/lisDetailInfoSearch/index?boxnum=${boxCodeNumber}`,
        });

        // this.$router.push({
        //     path: "/lisDetailInfoSearch",
        //     query: {
        //         id: this.id,
        //         boxnum: boxCodeNumber
        //     }
        // });
    },
    clickItem(e) {
        let box_num = e.currentTarget.dataset.boxnum;
        let status = e.currentTarget.dataset.statusstring;
        if (box_num && status) {
            wx.navigateTo({
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