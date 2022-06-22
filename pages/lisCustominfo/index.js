const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    id: "",
      channel_name:"",
      channel_id:"",
      registrant_member_name:"",
      registrant_member_phone:"",
      sampling_member_name:"",
      sampling_member_phone:""
  },
  onLoad: function (options) {
    this.setData({
      id: app.globalData.userInfo.id
    });
    
    this.getSamplingRegistrantInfoById();
  },
  backPage(){
    wx.navigateBack({
      delta: 1
    });
  },
  getSamplingRegistrantInfoById: function () {
    var that = this;
    var params = {
      id: that.data.id
    }
    request.request_get('/eastlogin/getSamplingRegistrantInfoById.hn', params, function (res) {
      if (res) {
        if (res.success) {
          let item = res.result;
          if(item && item.length > 0){
            that.setData({
              channel_name: item[0].channel_name,
              channel_id: item[0].channel_id,
              registrant_member_name: item[0].registrant_member_name,
              registrant_member_phone: item[0].registrant_member_phone,
            });

            if(item[0].sampling_member_name){
              that.setData({
                sampling_member_name: item[0].sampling_member_name
              });
            }
            if(item[0].sampling_member_phone){
              that.setData({
                sampling_member_phone: item[0].sampling_member_phone
              });
            }
          }
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  checkPhone(phone) {
    var phoneReg = /^1\d{10}$/;
    if (phone.length != 11) {
      return false;
    } else if (!phoneReg.test(phone)) {
      return false;
    } else {
      return true;
    }
  },
  // 提交预约信息
  clickSubmit: utils.throttle(function(e) {
    var that = this;
    if(that.data.sampling_member_name == ''){
      box.showToast('请输入采样人真实姓名');
      return;
    }

    if(that.data.sampling_member_phone == ''){
      box.showToast('请输入采样人有效联系方式');
      return;
    }

    if (!that.checkPhone(that.data.sampling_member_phone)) {
      box.showToast('采样人手机号有误')
      return;
    } 

    if(that.data.registrant_member_name == ''){
      box.showToast('请输入登记人真实姓名');
      return;
    }

    if(that.data.registrant_member_phone == ''){
      box.showToast('请输入登记人有效联系方式');
      return;
    }

    if (!that.checkPhone(that.data.registrant_member_phone)) {
      box.showToast('登记人手机号有误')
      return;
    }

    let data = {
      sampling_member_name: that.data.sampling_member_name,
      sampling_member_phone: that.data.sampling_member_phone,
      registrant_member_name: that.data.registrant_member_name,
      registrant_member_phone: that.data.registrant_member_phone,
      channel_id: that.data.channel_id,
      channel_name: that.data.channel_name,
      id: that.data.id
    }
    request.request_get('/eastlogin/writeSamplingRegistrantInfo.hn', data, function (res) {
      if (res) {
        if (res.success) {
          wx.navigateTo({
            url: '/pages/lisSelectMain/index',
          });
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },3000),
  clearPhone() {
    this.setData({
      sampling_member_phone: ""
    });
  },
  clearAccountPhone(){
    this.setData({
      registrant_member_phone: ""
    });
  }, 
  codeInput1: function (e) {
    var that = this;
    that.setData({
      sampling_member_name: e.detail.value,
    })
},
codeInput2: function (e) {
    var that = this;
    that.setData({
      sampling_member_phone: e.detail.value,
    })
},
codeInput3: function (e) {
  var that = this;
  that.setData({
    registrant_member_name: e.detail.value,
  })
},
codeInput4: function (e) {
  var that = this;
  that.setData({
    registrant_member_phone: e.detail.value,
  })
},
})