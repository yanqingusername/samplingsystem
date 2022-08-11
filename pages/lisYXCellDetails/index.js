const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    uid: "",
    sampleId: "",
    codeInfoVo: '',
    cardnumber: '',
    phone: '',
    tubetime: ''
  },
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id,
      uid: options.uid,
      sampleId: options.sampleId
    });
  },
  onShow(){
    this.getSampleinfo();
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 获取单个人员信息方法
   */
   getSampleinfo() {
    let that = this;
    let params = {
      sampleId: that.data.sampleId,
      id: that.data.uid
    }
    request.request_coyote('/yxinfo/getsampleinfo.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            codeInfoVo: res.data.codeInfoVo,
            cardnumber: res.data.cardnumber,
            phone: res.data.phone,
            tubetime: res.data.tubetime
          });
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
})