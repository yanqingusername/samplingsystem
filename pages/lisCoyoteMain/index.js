const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    isShowBox: false,
    boxData:{
      title: "温馨提示",
      titles: "存在未封箱的箱码，请先封箱，否则无法使用新箱码",
      cancel: "取消",
      sure: "去封箱"
    },
    isBackout: false,
    backoutData:{
      title: "确认退出系统吗？",
      titles: "",
      cancel: "关闭弹窗",
      sure: "回到登录页"
    },
      id: "",
      channel_name: "",
      channel_id: "",
      perple_count: 0,
      box_count: 0,
      tube_count: 0,
      isInputBoxnum: false,
      boxCodeNumber: "",
      box_num: "",
      isFocus: false
  },
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id
    });
  },
  onShow(){
    this.getEverydaySampleBoxInfo();
  },
  backPage(){
    wx.navigateBack({
      delta: 1
    });
  },
  getEverydaySampleBoxInfo() {
    let that = this;
    let params = {
      id: that.data.id
    }
    request.request_get('/eastbox/getEverydaySampleBoxInfo.hn', params, function (res) {
      if (res) {
        if (res.success) {
          that.setData({
            channel_name: res.channel_name,
            channel_id: res.channel_id,
            box_count: res.box_count,
            tube_count: res.tube_count,
          });
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  checkSampleBoxStatusIsClose() {
    let that = this;
    let params = {
      id: that.data.id
    }
    request.request_get('/eastbox/checkSampleBoxStatusIsClose.hn', params, function (res) {
      if (res) {
        if (res.success) {
          if (res.is_exist == 0) {
            that.setData({
              isShowBox: true,
              box_num: res.box_num
            });
          } else {
            that.getScanQRCodeClick();
          }
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  // 扫描
  scanQRCodeClick() {
    this.checkSampleBoxStatusIsClose();
    //this.getScanQRCodeClick();
  },
  getScanQRCodeClick() {
    // 点击的时候调起扫一扫功能呢
    let that = this;
    wx.scanCode({
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success(res) {
        console.log('---->:',res.result)
        let boxCodeNumber = res.result;
        if (boxCodeNumber) {
          that.checkSampleBoxStatus(boxCodeNumber);
        }
      },
      fail(res) {
        console.log("err", res);
      },
    });
  },
  checkSampleBoxStatus(boxCodeNumber) {
    let that = this;
    let params = {
      box_num: boxCodeNumber,
    }
    request.request_get('/eastbox/checkSampleBoxStatus.hn', params, function (res) {
      if (res) {
        if (res.success) {
          let can_use = res.can_use || false;
          that.startScanSampleBox(boxCodeNumber,can_use);
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  startScanSampleBox(boxCodeNumber,can_use) {
    let that = this;
    let params = {
      box_num: boxCodeNumber,
      // max_sum:max_sum,
      id: that.data.id,
      channel_id: that.data.channel_id,
      can_use: can_use
    }
    request.request_get('/eastbox/startScanSampleBox.hn', params, function (res) {
      if (res) {
        if (res.success) {
          wx.navigateTo({
            url: `/pages/lisCoyoteDetail/index?boxnum=${boxCodeNumber}`,
          });
          // that.$router.push({
          //   path: "/lisCoyoteDetail",
          //   query: { id: this.id, boxnum: boxCodeNumber },
          // });
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  clickAlreadySmapleInfo(){
    wx.navigateTo({
      url: '/pages/lisCoyoteDetailInfo/index',
    });
  },
  /**
   * 封箱
   */
  boxCancel(){
    this.setData({
      isShowBox: false
    });
  },
  boxSure(){
    this.setData({
      isShowBox: false
    });
    wx.navigateTo({
      url: `/pages/lisCoyoteDetail/index?boxnum=${this.data.box_num}`,
    });
    // that.$router.push({
    //   path: "/lisCoyoteDetail",
    //   query: { id: that.id, boxnum: that.box_num },
    // });
  },
  /**
   * 退出系统
   */
  clickOut() {
    this.setData({
      isBackout: true
    });
  },
   backoutCancel(){
    this.setData({
      isBackout: false
    });
  },
  backoutSure(){
    let that = this;
    let params = {
      id: that.data.id
    }
    request.request_get('/eastlogin/exitEastSampleLogin.hn', params, function (res) {
      if (res) {
        if (res.success) {
          that.setData({
            isBackout: false
          });
          wx.clearStorageSync();
          box.showToast(res.msg);
          setTimeout(()=>{
            wx.reLaunch({
              url: '/pages/lisLogin/index',
            })
          },1200)
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  /**
   * 手动输入箱码
   */
  inputClick() {
    let that = this;
    let params = {
      id: that.data.id,
    }
    request.request_get('/eastbox/checkSampleBoxStatusIsClose.hn', params, function (res) {
      if (res) {
        if (res.success) {
          if (res.is_exist == 0) {
            that.setData({
              isShowBox: true,
              box_num: res.box_num
            });
          } else {
            that.setData({
              isInputBoxnum: true,
              isFocus: true
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
  dialogBoxnumCancel(){
    this.setData({
      isInputBoxnum: false,
      isFocus: false
    });
  },
  dialogBoxnumSure(){
    let that = this;
    if (that.data.boxCodeNumber) {
      let params = {
        box_num: that.data.boxCodeNumber,
      }
      request.request_get('/eastbox/checkSampleBoxStatus.hn', params, function (res) {
        if (res) {
          if (res.success) {
            let can_use = res.can_use || false;

            let data = {
              box_num: that.data.boxCodeNumber,
              // max_sum:max_sum,
              id: that.data.id,
              channel_id: that.data.channel_id,
              can_use: can_use
            }
            request.request_get('/eastbox/startScanSampleBox.hn', data, function (res1) {
              if (res1) {
                if (res1.success) {
                  that.setData({
                    boxCodeNumber: "",
                    isInputBoxnum: false,
                    isFocus: false
                  });
                  wx.navigateTo({
                    url: `/pages/lisCoyoteDetail/index?boxnum=${that.data.boxCodeNumber}`,
                  });
                  // that.$router.push({
                  //   path: "/lisCoyoteDetail",
                  //   query: { id: this.id, boxnum: that.boxCodeNumber },
                  // });
                } else {
                  box.showToast(res1.msg);
                }
              } else {
                box.showToast("网络不稳定，请重试");
              }
            });

          } else {
            box.showToast(res.msg);
          }
        } else {
          box.showToast("网络不稳定，请重试");
        }
      });
    } else {
      box.showToast("请输入箱码号");
    }
  },
  bindinputBoxnum(e) {
    this.setData({
      boxCodeNumber: e.detail.value,
    });
  },
  clearboxCodeNumber() {
    this.setData({
      boxCodeNumber: "",
      isFocus: true
    });
  },
  //隐藏遮罩
  hideCover() {
    this.setData({
      boxCodeNumber: '',
      isInputBoxnum: false,
      isFocus: false
    });
  },
})