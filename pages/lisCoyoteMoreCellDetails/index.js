const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    sampleId:"",
    tubetime: '',
    instrumentList: []
  },
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id,
      sampleId: options.sampleId
    });
  },
  onShow(){
    this.getCustomInfo();
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 获取人员信息方法
   */
   getCustomInfo() {
    let that = this;
    let params = {
      sampleId: that.data.sampleId,
    }
    request.request_coyote('/info/getinfo.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            instrumentList: res.data.codeInfoVo,
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
  clickItem(e){
    let sampleid = e.currentTarget.dataset.sampleid;
    let uid = e.currentTarget.dataset.id;
    if(sampleid && uid){
      wx.navigateTo({
        url: `/pages/lisCoyoteCellDetails/index?sampleId=${sampleid}&uid=${uid}`
      });
    }
  }
})