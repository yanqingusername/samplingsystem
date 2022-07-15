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
    uid: "",
    sampleId: "",
    codeInfoVo: '',
    cardnumber: '',
    phone: ''
  },
  onLoad: function (options) {
    this.setData({
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
    request.request_coyote('/info/getsampleinfo.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            codeInfoVo: res.data.codeInfoVo,
            cardnumber: res.data.cardnumber,
            phone: res.data.phone,
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
      sampleId: that.data.sampleId,
      id: that.data.uid
    }
    request.request_coyote('/info/deleteperoson.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          box.showToast(res.message,'',1000)
          that.setData({
            isDelete: false,
          });

          setTimeout(()=>{
            that.backPage();
          },1200);
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  clickUpdate(e){
    let uid = e.currentTarget.dataset.uid;
    let sampleId = e.currentTarget.dataset.sampleid;
    if(uid && sampleId){
      wx.navigateTo({
        url: `/pages/lisCoyoteUpdateSubInfo/index?uid=${uid}&sampleId=${sampleId}`
      });
    }
  }
})