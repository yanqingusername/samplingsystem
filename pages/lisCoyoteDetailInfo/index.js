const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')
var time = require('../../utils/time.js')

Page({
    data: {
        tabIndex: 0,
        id: "",
        instrumentList: [
            // {
            //     'box_num':'055555',
            //     'statustitle':'即将超时送样',
            //     'sample_num':'200',
            //     'status':'1',
            //     'id':'1'
            // },
            // {
            //     'box_num':'023124',
            //     'statustitle':'即将超时送样',
            //     'sample_num':'9',
            //     'status':'2',
            //     'id':'2'
            // },
            // {
            //     'box_num':'023125',
            //     'statustitle':'',
            //     'sample_num':'200',
            //     'status':'3',
            //     'id':'3'
            // },
            // {
            //     'box_num':'023126',
            //     'statustitle':'',
            //     'sample_num':'200',
            //     'status':'4',
            //     'id':'4'
            // },
            // {
            //     'box_num':'023127',
            //     'statustitle':'即将超时收样',
            //     'sample_num':'200',
            //     'status':'5',
            //     'id':'5'
            // }
        ],
        currentDate: time.timeFormat1(new Date()),
        maxDate: time.timeFormat1(new Date()),
        boxcount: 0,
        personcount: 0,
        samplecount: 0,

        stay_transport_sum: 0,
        transporting_sum: 0
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
        });
    },
    onShow() {
        this.getsamplinginfo();
    },
    getsamplinginfo() {
        let that = this;
        let params = {
            id: that.data.id,
            date: that.data.currentDate,
            // status: that.data.tabIndex == 0 ? '' : that.data.tabIndex
        }
        request.request_coyote('/info/getsamplinginfo.hn', params, function (res) {
            if (res) {
                if (res.data.success == 0) {
                    that.setData({
                        boxcount: res.data.boxcount,
                        personcount: res.data.personcount,
                        samplecount: res.data.samplecount,
                        instrumentList: res.data.listinfo,
                        // stay_transport_sum: res.stay_transport_sum,
                        // transporting_sum: res.transporting_sum
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
            url: '/pages/lisCoyoteDetailInfoSearch/index',
        });

        // this.$router.push({
        //     path: "/lisCoyoteDetailInfoSearch",
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
        this.getsamplinginfo();
      },
    clickTabIndex(e) {
        let number = e.currentTarget.dataset.tabstring;
        this.setData({
            tabIndex: number
        });
        this.getsamplinginfo();
    },
    /**
     * 
     */
    getBindSearch(boxCodeNumber) {
        wx.navigateTo({
            url: `/pages/lisCoyoteDetailInfoSearch/index?boxnum=${boxCodeNumber}`,
        });

        // this.$router.push({
        //     path: "/lisCoyoteDetailInfoSearch",
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
            if(status == '待封箱'){
                wx.navigateTo({
                    url: `/pages/lisCoyoteDetail/index?boxnum=${box_num}`,
                });
            }else{
                wx.navigateTo({
                    url: `/pages/lisCoyoteDetailInfoBox/index?boxnum=${box_num}&st=${status}`,
                });
            }
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