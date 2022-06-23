const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    isDelete: false,
    deleteData:{
      title: "确认解绑该受检者吗？",
      titles: "解绑后将无法找回该受检者信息",
      cancel: "取消",
      sure: "确认"
    },
  },
  onLoad: function (options) {
    // this.setData({
    //   id: app.globalData.userInfo.id
    // });
  },
  backPage() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 删除箱码
   */
   clickDelete() {
    this.setData({
      isDelete: true
    });
  },
  deleteCancel(){
    this.setData({
      isDelete: false
     });
  },
  deleteSure(){
    let that = this;
    let params = {
      box_num: that.data.boxnum
    }
    request.request_get('/eastbox/deleteSampleBoxInfo.hn', params, function (res) {
      if (res) {
        if (res.success) {
          box.showToast(res.msg)
          that.setData({
            isDelete: false,
            isShowSuccess: false
          });

          that.onClickLeft();
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  clickUpdate(){
    wx.navigateTo({
      url: `/pages/lisCoyoteUpdateSubInfo/index`,
    });
  }
})