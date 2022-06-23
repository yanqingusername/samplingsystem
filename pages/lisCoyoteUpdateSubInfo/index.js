const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    id: "",
    real_name: "",
    real_phone: '',
    code_number: '',

    codeBtText: "获取验证码",
    codeBtState: false,
    currentTime: 60,
    phoneCode: ["", ""], //正确的 手机号 和 验证码

    channel_id: '',
    channel_name: '',

    dutytypeIndex: 0,
    dutytype_name: '',
    dutytypeList: [
      {
        dutytype_id: "0",
        dutytype_name: '二代身份证'
      },
      {
        dutytype_id: "1",
        dutytype_name: '护照'
      },
      {
        dutytype_id: "2",
        dutytype_name: '港澳台通行证'
      }
    ],

    jobtypeIndex: 0,
    jobtype_name: '',
    jobtypeList: [{
        jobtype_id: "0",
        jobtype_name: '男'
      },
      {
        jobtype_id: "1",
        jobtype_name: '女'
      }
    ],

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
//***定义60，减少赋值次数
    //******************获取验证码按钮**********************
    getCode: function () {
      var that = this;
      var phone = that.data.real_phone;
      var currentTime = that.data.currentTime;
      console.log("需要获取验证码的手机号" + phone);
      if (that.data.codeBtState) {
          console.log("还未到达时间");
      } else {
          if (phone == '') {
              box.showToast("请填写手机号")
          } else if (!that.checkPhone(phone)) {
              box.showToast("手机号有误")
          } else {
              //倒计时,不管验证码发送成功与否，都进入倒计时，防止多次点击造成验证码发送失败**************************
              that.setData({
                  codeBtState: true
              })
              var interval = setInterval(function () {
                  currentTime--;
                  that.setData({
                      codeBtText: currentTime + 's'
                  })
                  if (currentTime <= 0) {
                      clearInterval(interval)
                      that.setData({
                          codeBtText: '重新发送',
                          currentTime: 60,
                          codeBtState: false,
                      })
                  }
              }, 1000);
              
              // 服务器发送验证码***********************
              // request.request_get('/support/Verification.hn', { phone: phone }, function (res) {
              //     console.info('回调', res)
              //     if(res){
              //         if(res.success){
              //             console.log('验证码发送成功，获取的验证码' + res.code);
              //             that.setData({ phoneCode: [phone, res.code] });
              //         }else{
              //             box.showToast("验证码发送失败");
              //         }
              //     }
              // })
          }
      }
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
  clickSubmit: utils.throttle(function (e) {
    var that = this;
    if (that.data.real_name == '') {
      box.showToast('请输入本人真实姓名');
      return;
    }

    if (that.data.real_phone == '') {
      box.showToast('请输入本人手机号');
      return;
    }

    if (!that.checkPhone(that.data.real_phone)) {
      box.showToast('本人手机号有误')
      return;
    }

    if (that.data.code_number == '') {
      box.showToast('请输入验证码');
      return;
    }

    if (that.data.channel_name == '' || that.data.channel_id == '') {
      box.showToast('请选择所属采样点');
      return;
    }

    if (that.data.dutytype_name == '' || that.data.dutytype_name == '请选择职责类型') {
      box.showToast('请选择职责类型');
      return;
    }

    if (that.data.jobtype_name == '' || that.data.jobtype_name == '请选择岗位类型') {
      box.showToast('请选择岗位类型');
      return;
    }

    let data = {
      real_name: that.data.real_name,
      real_phone: that.data.real_phone,
      code_number: that.data.code_number,
      channel_name: that.data.channel_name,
      dutytype_name: that.data.dutytype_name,
      jobtype_name: that.data.jobtype_name,
      channel_id: that.data.channel_id
    }

    console.log('---->:',data)

    // request.request_get('/eastlogin/writeSamplingRegistrantInfo.hn', data, function (res) {
    //   if (res) {
    //     if (res.success) {
    //       wx.navigateBack({
    //         delta: 1
    //       });
    //     } else {
    //       box.showToast(res.msg);
    //     }
    //   } else {
    //     box.showToast("网络不稳定，请重试");
    //   }
    // });
  }, 3000),

  codeInput1: function (e) {
    var that = this;
    that.setData({
      real_name: e.detail.value,
    })
  },
  codeInput2: function (e) {
    var that = this;
    that.setData({
      real_phone: e.detail.value,
    })
  },
  codeInput3: function (e) {
    var that = this;
    that.setData({
      code_number: e.detail.value,
    })
  },
  bindSelectChannel(){
    wx.navigateTo({
      url: '/pages/lisChannelName/index'
    });
  },
  /**
   * 职责类型
   */
  bindSelectDutytype: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dutytypeIndex: e.detail.value,
      dutytype_name: that.data.dutytypeList[e.detail.value].dutytype_name
    });
  },
  /**
   * 岗位类型
   */
   bindSelectJobtype: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jobtypeIndex: e.detail.value,
      jobtype_name: that.data.jobtypeList[e.detail.value].jobtype_name
    });
  },
})