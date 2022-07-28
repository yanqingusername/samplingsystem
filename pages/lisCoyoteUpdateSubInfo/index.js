const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    id: "",
    name: "",
    cardnumber: '',
    phone: '',

    // codeBtText: "获取验证码",
    // codeBtState: false,
    // currentTime: 60,
    // phoneCode: ["", ""], //正确的 手机号 和 验证码

    dutytypeIndex: 0,
    dutytype_name: '二代身份证',
    dutytypeList: [{
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
    jobtype_name: '男',
    jobtypeList: [{
        jobtype_id: "0",
        jobtype_name: '男'
      },
      {
        jobtype_id: "1",
        jobtype_name: '女'
      }
    ],
    age: '',

    sampleId: '',
    uid: ''
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
          let codeInfoVo = res.data.codeInfoVo;
          that.setData({
            id: codeInfoVo.id,
            name: codeInfoVo.name,
            cardnumber: codeInfoVo.cardnumber,
            phone: codeInfoVo.phone,
            age: codeInfoVo.age
          });

          if(codeInfoVo.cardtype == 0){
            that.setData({
              dutytypeIndex: 0,
              dutytype_name: '二代身份证'
            });
          }
          if(codeInfoVo.cardtype == 1){
            that.setData({
              dutytypeIndex: 1,
              dutytype_name: '护照'
            });
          }
          if(codeInfoVo.cardtype == 2){
            that.setData({
              dutytypeIndex: 2,
              dutytype_name: '港澳台通行证'
            });
          }

          if(codeInfoVo.sex == '男'){
            that.setData({
              jobtypeIndex: 0,
              jobtype_name: '男',
            });
          }
          if(codeInfoVo.sex == '女'){
            that.setData({
              jobtypeIndex: 1,
              jobtype_name: '女',
            });
          }
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
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
  /**
   * 修改人员信息方法
   */
  clickSubmit: utils.throttle(function (e) {
    var that = this;
    if (that.data.name == '') {
      box.showToast('请输入受检者姓名');
      return;
    }

    if (that.data.dutytype_name == '') {
      box.showToast('请选择证件类型');
      return;
    }

    if (that.data.cardnumber == '') {
      box.showToast('请输入受检者证件号码');
      return;
    }

    if (that.data.phone == '') {
      box.showToast('请输入受检者手机号码');
      return;
    }

    if (!that.checkPhone(that.data.phone)) {
      box.showToast('本人手机号有误')
      return;
    }

    if (that.data.jobtype_name == '') {
      box.showToast('请选择性别');
      return;
    }

    if (that.data.age == '') {
      box.showToast('请填写受检者年龄');
      return;
    }
   
    let params = {
      id: that.data.id,
      name: that.data.name,
      sampleId: that.data.sampleId,
      gender: that.data.jobtype_name,
      age: that.data.age,
      phone: that.data.phone,
      cardtype: that.data.dutytypeIndex,
      cardnumber: that.data.cardnumber,
    }

    console.log('---->:',params)

    request.request_coyote('/info/updateinfo.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          box.showToast(res.message,'',1000);
          setTimeout(() => {
            let pages = getCurrentPages();
            let prevPage = pages[pages.length - 3]; //获取上个页面栈                          
            prevPage.setData({
              isShowDetail: 2
            })
            
            wx.navigateBack({
                delta: 1,
            });
          }, 1200);
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  }, 2000),

  codeInput1: function (e) {
    var that = this;
    that.setData({
      name: e.detail.value,
    })
  },
  codeInput2: function (e) {
    var that = this;
    that.setData({
      cardnumber: e.detail.value,
    })
  },
  clearCodeNumber(){
    this.setData({
      cardnumber: ""
    })
  },
  codeInput3: function (e) {
    var that = this;
    that.setData({
      phone: e.detail.value,
    })
  },
  clearPhone(){
    this.setData({
      phone: ""
    })
  },
  codeInput4: function (e) {
    var that = this;
    that.setData({
      age: e.detail.value,
    })
  },
  /**
   * 证件类型
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
   * 性别
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