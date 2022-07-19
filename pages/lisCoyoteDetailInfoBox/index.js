const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        isShowview: false,
        instrumentList: [
            // {
            //     'sample_id':'123456789012',
            //     'statustitle':'即将超时送样',
            //     'sample_num':'1',
            //     'custom_num':'1',
            //     'id':'1',
            //     'testtype': '1',
            //     'uid': '8602129'
            // },
            // {
            //     'sample_id':'123456789013',
            //     'statustitle':'',
            //     'sample_num':'1',
            //     'custom_num':'1',
            //     'id':'2',
            //     'testtype': '1',
            //     'uid': '8602130'
            // },
            // {
            //     'sample_id':'12345678903',
            //     'statustitle':'',
            //     'sample_num':'10',
            //     'custom_num':'8',
            //     'id':'3',
            //     'testtype': '3'
            // },
            // {
            //     'sample_id':'12345678903',
            //     'statustitle':'即将超时送样',
            //     'sample_num':'10',
            //     'custom_num':'3',
            //     'id':'4',
            //     'testtype': '3'
            // },
        ],
        id: "",
        boxnum: "", // 箱码
        canuse: "", //  可用数量
        maxsum: "", //  最大数量
        createdate: "", //   日期
        peoplecount: "", //  箱子内总人数
        samplecount: "", //  箱子内总管数
        status: "", // 箱子状态
        conveyTime: "", //  转运时间（有数据才会显示  无数据不显示）
        conveyer: "", //  转运人（有数据才会显示  无数据不显示）
        receiveTime: "", //  接收时间（有数据才会显示  无数据不显示）
        receiver: "", //  接收人（有数据才会显示  无数据不显示）
        closetime: '', // 封箱时间
    },
    onLoad: function (options) {
        this.setData({
            id: app.globalData.userInfo.id,
            boxnum: options.boxnum,
        });
    },
    onShow() {
        this.getSampleBoxInfo();
    },
    /**
     * 获取箱码信息
     */
    getSampleBoxInfo() {
        let that = this;
        let params = {
            box_num: that.data.boxnum,
            // id: that.data.id
        }
        request.request_coyote('/info/getboxinfo.hn', params, function (res) {
            if (res) {
                if (res.data.success == 0) {

                    that.setData({
                        boxnum: res.data.box_num,
                        createdate: res.data.createdate,
                        maxsum: res.data.maxsum,
                        canuse: res.data.canuse,

                        peoplecount: res.data.peoplecount, //  箱子内总人数
                        samplecount: res.data.samplecount, //  箱子内总管数
                        status: res.data.status, // 箱子状态
                        conveyTime: res.data.conveyTime, //  转运时间（有数据才会显示  无数据不显示）
                        conveyer: res.data.conveyer, //  转运人（有数据才会显示  无数据不显示）
                        receiveTime: res.data.receiveTime, //  接收时间（有数据才会显示  无数据不显示）
                        receiver: res.data.receiver, //  接收人（有数据才会显示  无数据不显示）
                        closetime: res.data.closetime, // 封箱时间
                    });

                    that.setData({
                        instrumentList: res.data.samplelist || []
                    });

                    if (that.data.instrumentList.length > 0) {
                        for (let i = 0; i < that.data.instrumentList.length; i++) {
                            that.data.instrumentList[i].isTouchMove = false;
                        }
                    }

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
    clickSearch() {
        wx.navigateTo({
            url: `/pages/lisCoyoteDetailInfoBoxSearch/index?boxnum=${this.data.boxnum}`
        });

        // this.$router.push({
        //     path: "/lisCoyoteDetailInfoBoxSearch",
        //     query: {
        //         id: this.id,
        //         boxnum: this.boxnum,
        //         sampleid: ''
        //     }
        // });
    },
    // 扫描
    scanQRCodeClick() {
        this.getScanQRCodeClick();
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
    /**
     * 
     */
    getBindSearch(boxCodeNumber) {
        wx.navigateTo({
            url: `/pages/lisCoyoteDetailInfoBoxSearch/index?boxnum=${this.data.boxnum}&sampleid=${boxCodeNumber}`,
        });

        // this.$router.push({
        //     path: "/lisCoyoteDetailInfoBoxSearch",
        //     query: {
        //         id: this.id,
        //         boxnum: this.boxnum,
        //         sampleid: boxCodeNumber
        //     }
        // });
    },
    clickShowview() {
        if (this.data.isShowview) {
            this.setData({
                isShowview: false
            });
        } else {
            this.setData({
                isShowview: true
            });
        }
    },
    clickLisCoyoteCellDetails(e) {
        let sampleid = e.currentTarget.dataset.sampleid;
        let max = e.currentTarget.dataset.max;
        let uid = e.currentTarget.dataset.uid;
        if (sampleid && max) {
            if (max == 1) {
                if (uid) {
                    wx.navigateTo({
                        url: `/pages/lisCoyoteCellDetails/index?sampleId=${sampleid}&uid=${uid}`,
                    });
                }
            } else {
                wx.navigateTo({
                    url: `/pages/lisCoyoteMoreCellDetails/index?sampleId=${sampleid}`,
                });
            }

        }
    }

})