const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    sampleid:""
  },
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id,
      sampleid: options.sampleid
    });
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  clickItem(e){
    let sampleid = e.currentTarget.dataset.sampleid;
    if(sampleid){
      wx.navigateTo({
        url: `/pages/lisCoyoteCellDetails/index?sampleid=${sampleid}`,
      });
    }
  }
})