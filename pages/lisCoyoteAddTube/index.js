const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
    isQudao: false,
    qudaoIndex: -1,
    isShowBox: false,
    boxData:{
      title: "温馨提示",
      titles: "存在未封箱的箱码，请先封箱，否则无法使用新箱码",
      cancel: "取消",
      sure: "去封箱"
    },
      isBack: false,
      backData:{
        title: "箱码还未封箱，确认返回吗？",
        titles: "返回后数据会自动保存",
        cancel: "直接返回",
        sure: "立即封箱"
      },
      isSure: false,
      sureData:{
        title: "确认封箱吗？",
        titles: "封管后将结束该试管绑定任务",
        cancel: "取消",
        sure: "确认"
      },
      isMaxBox: false,
      maxBoxData:{
        title: "温馨提示",
        titles: "已达最大封箱数量，请先封箱",
        cancel: "取消",
        sure: "立即封箱"
      },
      isDelete: false,
      deleteData:{
        title: "确认删除该箱码吗？",
        titles: "删除后可再次扫码使用",
        cancel: "取消",
        sure: "确认"
      },
      isShowSuccess: true,
      id: "",
      boxnum:"",
      boxnumTime:"",
      boxnumMax: 0,
      channel_id: '',
      instrumentList: [],
      successboxnum: 0,
      successnum:0,
      // 设置开始的位置
      startX: 0,
      startY: 0,

      dutytypeIndex: 0,
    dutytype_name: '单采',
    dutytypeList: [{
        dutytype_id: "0",
        dutytype_name: '单采'
      },
      {
        dutytype_id: "1",
        dutytype_name: '十混一'
      },
      {
        dutytype_id: "2",
        dutytype_name: '五混一'
      }
    ],

    jobtypeIndex: 0,
    jobtype_name: '咽拭子',
    jobtypeList: [{
        jobtype_id: "0",
        jobtype_name: '咽拭子'
      },
      {
        jobtype_id: "1",
        jobtype_name: '鼻咽拭子'
      }
    ],

    isInputBoxnum: false
  },
  onLoad: function (options) {
    let boxnum = options.boxnum;

    this.setData({
      id: app.globalData.userInfo.id || 322,
      boxnum: boxnum
    });
  },
  onShow(){
    this.getSampleBoxInfo();
  },
  getSampleBoxInfo() {
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      id: that.data.id
    }
    request.request_get('/eastbox/getSampleBoxInfo.hn', params, function (res) {
      if (res) {
        if (res.success) {
          if(res.result && res.result.length > 0){
            let item = res.result[0];
            that.setData({
              boxnum: item.box_num,
              boxnumTime: item.create_time,
              boxnumMax: item.max_sum,
              channel_id: item.channel,
            });
          }

          that.setData({
            instrumentList: res.listData
          });

          if(that.data.instrumentList.length > 0){
            for(let i = 0; i < that.data.instrumentList.length; i++){
              that.data.instrumentList[i].isTouchMove = false;
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
  // 扫描
  scanQRCodeClick() {
    // this.getScanQRCodeClick();
    this.checkSampleTube('22222222222227');
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
          that.checkSampleTube(boxCodeNumber);
        }
      },
      fail(res) {
        console.log("err", res);
      },
    });
  },
  /**
   *
   */
  checkSampleTube(boxCodeNumber) {
    let that = this;
    let params = {
      sample_id: boxCodeNumber
    }
    request.request_get('/eastbox/checkSampleTube.hn', params, function (res) {
      if (res) {
        if (res.success) {
          that.addSampleTubeInfo(boxCodeNumber);
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  addSampleTubeInfo(sample_id) {
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      id: that.data.id,
      sample_id: sample_id,
      channel_id: that.data.channel_id
    }
    request.request_get('/eastbox/addSampleTubeInfo.hn', params, function (res) {
      if (res) {
        if (res.success) {
          if(res.can_add == 0){
            that.getSampleBoxInfo();
          }else{
            that.setData({
              isMaxBox: true
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
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    });
  },
  clickDown() {
    if(this.data.instrumentList.length > 0){
      this.setData({
        isSure: true
      });
    }else{
      this.closeSetSampleBox();
    }
  },
  closeSetSampleBox(){
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      id: that.data.id
    }
    request.request_get('/eastbox/closeSampleBox.hn', params, function (res) {
      if (res) {
        if (res.success) {
          that.setData({
            isShowSuccess: false
          });
          if(res.result && res.result.length > 0){
            let item = res.result[0];
            that.setData({
              successboxnum: item.box_num,
              successnum: item.sample_num,
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
  clickNewScan() {
    this.checkSampleBoxStatusIsClose();
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
              boxnum: res.box_num,
            });
          } else {
            that.getScanQRCodeClick2();
            // that.checkSampleBoxStatus('456789');
          }
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  getScanQRCodeClick2() {
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
          that.setData({
            isShowSuccess: true,
            boxnum: boxCodeNumber,
            id: that.data.id
          });
          that.getSampleBoxInfo();
        } else {
          box.showToast(res.msg);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  /**
   * 封箱弹框
   */
  boxCancel(){
    this.setData({
      isShowBox: false
    });
  },
  boxSure(){
    this.setData({
      isShowBox: false,
      isShowSuccess: true,
      id: this.data.id,
      boxnum: this.data.boxnum
    });

    this.getSampleBoxInfo();
  },
  clickItem() {
    
  },
  /**
   * 立即封箱弹框
   */
  maxBoxCancel(){
    this.setData({
      isMaxBox: false
    });
  },
  maxBoxSure(){
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      id: that.data.id
    }
    request.request_get('/eastbox/closeSampleBox.hn', params, function (res) {
      if (res) {
        if (res.success) {
          box.showToast(res.msg)
          that.setData({
            isMaxBox: false,
            isShowSuccess: false
          });

          if(res.result && res.result.length > 0){
            let item = res.result[0];
            that.setData({
              successboxnum: item.box_num,
              successnum: item.sample_num,
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
  /**
   * 立即封箱 确认
   */
   sureCancel(){
    this.setData({
      isSure: false
    });
  },
  sureSure(){
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      id: that.data.id
    }
    request.request_get('/eastbox/closeSampleBox.hn', params, function (res) {
      if (res) {
        if (res.success) {
          box.showToast(res.msg)
          that.setData({
            isSure: false,
            isShowSuccess: false
          });

          if(res.result && res.result.length > 0){
            let item = res.result[0];
            that.setData({
              successboxnum: item.box_num,
              successnum: item.sample_num,
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
  /**
   * 返回
   */
   backPage(){
     if(this.data.isShowSuccess){
      this.setData({
        isBack: true
      });
     }else{
      this.onClickLeft();
     }
  },
  backCancel(){
    this.setData({
      isBack: false
     });
     this.onClickLeft();
  },
  backSure(){
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      id: that.data.id
    }
    request.request_get('/eastbox/closeSampleBox.hn', params, function (res) {
      if (res) {
        if (res.success) {
          box.showToast(res.msg)
          that.setData({
            isBack: false,
            isShowSuccess: false
          });

          if(res.result && res.result.length > 0){
            let item = res.result[0];
            that.setData({
              successboxnum: item.box_num,
              successnum: item.sample_num,
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
  touchStart: function(e) {
    let instrumentList = [...this.data.instrumentList]
    instrumentList.forEach(item => {
      if (item.isTouchMove) {
        item.isTouchMove = !item.isTouchMove;
      }
    });
    this.setData({
      instrumentList: instrumentList,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },
  touchMove: function(e) {
    let moveX = e.changedTouches[0].clientX;
    let moveY = e.changedTouches[0].clientY;
    let indexs = e.currentTarget.dataset.index;
    let instrumentList = [...this.data.instrumentList]

    let angle = this.angle({
      X: this.data.startX,
      Y: this.data.startY
    }, {
      X: moveX,
      Y: moveY
    });

    instrumentList.forEach((item, index) => {
      item.isTouchMove = false;
      // 如果滑动的角度大于30° 则直接return；
      if (angle > 30) {
        return
      }

      if (indexs === index) {
        if (moveX > this.data.startX) { // 右滑
          item.isTouchMove = false;
        } else { // 左滑
          item.isTouchMove = true;
        }
      }
    });

    this.setData({
      instrumentList: instrumentList
    });
  },
  //计算角度
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 删除
  delShop(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该试管吗？',
      success: function(res) {
        if (res.confirm) {
          let sampleid = e.currentTarget.dataset.sampleid;
          let params = {
            box_num: that.data.boxnum,
            sample_id: sampleid,
            id: that.data.id
          }
          request.request_get('/eastbox/deleteSampleTubeInfo.hn', params, function (res) {
            if (res) {
              if (res.success) {
                box.showToast(res.msg)
                that.getSampleBoxInfo();
              } else {
                box.showToast(res.msg);
              }
            } else {
              box.showToast("网络不稳定，请重试");
            }
          });
        }
      }
    })
  },
  /**
   * 混采类型
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
   * 标本类型
   */
   bindSelectJobtype: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jobtypeIndex: e.detail.value,
      jobtype_name: that.data.jobtypeList[e.detail.value].jobtype_name
    });
  },
  bindInputBoxnum(){
    this.setData({
      isInputBoxnum: true
    });
  },
  bindSubjectInfo(){
    wx.navigateTo({
      url: '/pages/lisCoyoteSubjectInfo/index'
    });
  },
  bindGetInfoCode(){
    wx.navigateTo({
      url: '/pages/lisCoyoteGetInfoCode/index'
    });
  },
  dialogBoxnumCancel(){
    this.setData({
      isInputBoxnum: false
    });
  },
  dialogBoxnumSure(){
    this.setData({
      isInputBoxnum: false,
      isQudao: true
    });
  },
  bindSelectQudao(e){
    let qudaoIndex = e.currentTarget.dataset.index;
    this.setData({
      qudaoIndex: qudaoIndex
    });
  },
  dialogQudaoCancel(){
    this.setData({
      isQudao: false,
      qudaoIndex: -1
    });
  },
  dialogQudaoSure(){
    if(this.data.qudaoIndex != -1){
      this.setData({
        isQudao: false
      });
    }else{
      box.showToast('请选择渠道');
    }
  },
})