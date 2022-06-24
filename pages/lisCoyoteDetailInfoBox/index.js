const app = getApp()
var box = require('../../utils/box.js')
var utils = require('../../utils/utils.js')
var request = require('../../utils/request.js')

Page({
    data: {
        id: "322",
        boxnum: "",
        status: "",
        isShowview: false,
        instrumentList: [],
        conveyer_person_name: "", //转运人
        convey_time: "", //转运时间
        receive_person_name: "", //接收人
        receive_time: "", //接收时间
        close_time: "", //封箱时间
        create_time: "", //开箱时间
    },
    onLoad: function (options) {
        this.setData({
            // id: app.globalData.userInfo.id,
            boxnum: options.boxnum,
            status: options.st,
        });
    },
    onShow() {
        this.getExpandSampleInfoDetail();
        this.getSampleBoxInfoDetail();
    },
    getExpandSampleInfoDetail() {
        let that = this;
        let params = {
            box_num: that.data.boxnum,
            id: that.data.id,
            status: that.data.status == 3 ? '' : that.data.status
        }
        request.request_get('/eastbox/getExpandSampleInfoDetail.hn', params, function (res) {
            if (res) {
                if (res.success) {
                    if (res.result && res.result.length > 0) {
                        that.setData({
                            conveyer_person_name: res.conveyer_person_name,
                            convey_time: res.convey_time,
                            receive_person_name: res.receive_person_name,
                            receive_time: res.receive_time,
                            close_time: res.close_time,
                            create_time: res.create_time
                        });
                    }
                } else {
                    box.showToast(res.msg);
                }
            } else {
                box.showToast("网络不稳定，请重试");
            }
        });
    },
    getSampleBoxInfoDetail() {
        let that = this;
        let params = {
            box_num: that.data.boxnum,
            id: that.data.id,
            status: that.data.status
        }
        request.request_get('/eastbox/getSampleBoxInfoDetail.hn', params, function (res) {
            if (res) {
                if (res.success) {
                    that.setData({
                        instrumentList: res.result
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
    clickLisCoyoteCellDetails(e){
        let sampleid = e.currentTarget.dataset.sampleid;
        let statusstring = e.currentTarget.dataset.statusstring;
        console.log(statusstring)
        if(sampleid && statusstring){
            if(statusstring == 1){
                wx.navigateTo({
                    url: `/pages/lisCoyoteCellDetails/index?sampleid=${sampleid}`,
                });
            }else{
                wx.navigateTo({
                    url: `/pages/lisCoyoteMoreCellDetails/index?sampleid=${sampleid}`,
                });
            }
        }
    }

})