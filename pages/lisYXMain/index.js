const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
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
    request.request_coyote('/yxinfo/getChannelInfo.hn', params, function (res) {
      if (res) {
        if (res.code == 200) {
          that.setData({
            channel_name: res.data.channelName,
            channel_id: res.data.channelId,
            tube_count: res.data.num,
            perple_count: res.data.peoplecount
          });
        } else {
          box.showToast(res.message);
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
    request.request_coyote('/info/checkbox.hn', params, function (res) {
      if (res) {
        // if (res.code == 200) {
          if (res.data.success == 1) {
            that.setData({
              isShowBox: true,
              box_num: res.data.nums
            });
          } else if (res.data.success == 0) {
            that.getScanQRCodeClick();
          } else {
            box.showToast(res.message);
          }
        // } else {
        //   box.showToast(res.message);
        // }
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
    request.request_coyote('/info/opencheckbox.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.startScanSampleBox(boxCodeNumber);
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  startScanSampleBox(boxCodeNumber) {
    let that = this;
    let params = {
      box_num: boxCodeNumber,
      id: that.data.id
    }
    request.request_coyote('/info/openbox.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          wx.navigateTo({
            url: `/pages/lisYXDetail/index?boxnum=${boxCodeNumber}&isnumber=1`,
          });
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
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
   * 试管列表
   */
  handleClick(){
    // boxnum=088889&isnumber=1
    wx.navigateTo({
      url: `/pages/lisYXDetail/index?boxnum=088889`,
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
    request.request_coyote('/info/checkbox.hn', params, function (res) {
      if (res) {
        // if (res.code == 200) {
          if (res.data.success == 1) {
            that.setData({
              box_num: res.data.nums
            });
          } else if (res.data.success == 0) {
            that.setData({
              isInputBoxnum: true,
              isFocus: true
            });
          } else {
            box.showToast(res.message);
          }
        // } else {
        //   box.showToast(res.message);
        // }
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
      request.request_coyote('/info/opencheckbox.hn', params, function (res) {
        if (res) {
          if (res.data.success == 0) {
            let data = {
              box_num: that.data.boxCodeNumber,
              id: that.data.id,
            }
            request.request_coyote('/info/openbox.hn', data, function (res1) {
              if (res1) {
                if (res1.data.success == 0) {
                  that.setData({
                    // boxCodeNumber: "",
                    isInputBoxnum: false,
                    isFocus: false
                  });
                  wx.navigateTo({
                    url: `/pages/lisYXDetail/index?boxnum=${that.data.boxCodeNumber}&isnumber=1`,
                  });

                  that.setData({
                    boxCodeNumber: "",
                  });
                } else {
                  box.showToast(res1.message);
                }
              } else {
                box.showToast("网络不稳定，请重试");
              }
            });
          } else {
            box.showToast(res.message);
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