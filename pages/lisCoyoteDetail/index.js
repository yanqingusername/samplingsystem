const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()


Page({
  data: {
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
      canuse:0,
      channel_id: '',
      instrumentList: [],
      successboxnum: 0,
      successnum:0,
      // 设置开始的位置
      startX: 0,
      startY: 0,
      isShowSample: false,
      sampleData:{
        title: "温馨提示",
        titles: "还存在未封管的试管，请先封管",
        cancel: "取消",
        sure: "去封管"
      },
      sampleId:"",
      isnumber: 1
  },
  onLoad: function (options) {
    let boxnum = options.boxnum;

    this.setData({
      id: app.globalData.userInfo.id,
      boxnum: boxnum,
      isnumber: options.isnumber
    });
  },
  onShow(){
    this.getSampleBoxInfo();
  },
  /**
   * 获取箱码信息
   */
  getSampleBoxInfo() {
    let that = this;
    let params = {
      box_num: that.data.boxnum,
      // id: that.data.id
    }
    request.request_coyote('/info/getboxinfo.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          
            that.setData({
              boxnum: res.data.box_num,
              boxnumTime: res.data.createdate,
              boxnumMax: res.data.maxsum,
              canuse: res.data.canuse,
              // channel_id: item.channel,
            });

          that.setData({
            instrumentList: res.data.samplelist || []
          });

          if(that.data.instrumentList.length > 0){
            for(let i = 0; i < that.data.instrumentList.length; i++){
              that.data.instrumentList[i].isTouchMove = false;
            }
          }
          
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  /**
   * 封箱按钮
   */
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
      // id: that.data.id
    }
    request.request_coyote('/info/closecheck.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0 || res.data.success == 2) {
          that.setData({
            isShowSuccess: false,
            successboxnum: res.data.boxnum,
            successnum: res.data.num,
          });
        } else if (res.data.success == 1) {
          // 存在未封管的试管，请先封管
          that.setData({
            sampleData:{
              title: "温馨提示",
              titles: "还存在未封管的试管，请先封管后完成封箱",
              cancel: "取消",
              sure: "去封管"
            },
            isShowSample: true,
            sampleId: res.data.sampleId
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
   * 封管弹框
   */
  sampleCancel(){
    this.setData({
      isShowSample: false
    });
  },
  sampleSure(){
    this.setData({
      isShowSample: false
    });
    wx.navigateTo({
      url: `/pages/lisCoyoteAddTube/index?boxnum=${this.data.boxnum}&sampleId=${this.data.sampleId}`
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
      // id: that.data.id
    }
    request.request_coyote('/info/closecheck.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0 || res.data.success == 2) {
          that.setData({
            isSure: false,
            isShowSuccess: false,
            successboxnum: res.data.boxnum,
            successnum: res.data.num,
          });
        } else if (res.data.success == 1) {
          // 存在未封管的试管，请先封管
          that.setData({
            isSure: false,
            isShowSample: true,
            sampleId: res.data.sampleId,
            sampleData:{
              title: "温馨提示",
              titles: "还存在未封管的试管，请先封管后完成封箱",
              cancel: "取消",
              sure: "去封管"
            },
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
      // id: that.data.id
    }
    request.request_coyote('/info/closecheck.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0 || res.data.success == 2) {
          that.setData({
            isSure: false,
            isBack: false,
            isMaxBox: false,
            isShowSuccess: false,
            successboxnum: res.data.boxnum,
            successnum: res.data.num,
          });
        } else if (res.data.success == 1) {
          // 存在未封管的试管，请先封管
          that.setData({
            isSure: false,
            isBack: false,
            isMaxBox: false,
            isShowSample: true,
            sampleId: res.data.sampleId,
            sampleData:{
              title: "温馨提示",
              titles: "还存在未封管的试管，请先封管后完成封箱",
              cancel: "取消",
              sure: "去封管"
            },
          });
        } else {
          box.showToast(res.message);
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
  onClickBackHome() {
    if(this.data.isnumber == 2){
      wx.navigateBack({
        delta: 2
      });
    }else{
      wx.navigateBack({
        delta: 1
      });
    }
  },
  // 添加试管
  scanQRCodeClick() {
    let that = this;
    let params = {
      box_num: that.data.boxnum,
    }
    request.request_coyote('/info/addsample.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0 || res.data.success == 3) {
          wx.navigateTo({
            url: `/pages/lisCoyoteAddTube/index?boxnum=${that.data.boxnum}`
          });
        } else if (res.data.success == 1) {
          // 已达最大封箱数量，请先封箱
          that.setData({
            isMaxBox: true,
          });
        } else if (res.data.success == 2) {
          // 存在未封管试管，请先封管
          that.setData({
            isSure: false,
            isBack: false,
            isMaxBox: false,
            isShowSample: true,
            sampleId: res.data.sampleId,
            sampleData:{
              title: "温馨提示",
              titles: "还存在未封管的试管，请先封管",
              cancel: "取消",
              sure: "去封管"
            },
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
   * 扫描新箱码
   */
  clickNewScan() {
    this.checkSampleBoxStatusIsClose();
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
            that.getScanQRCodeClick2();
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
          that.setData({
            isShowSuccess: true,
            boxnum: boxCodeNumber,
            id: that.data.id
          });
          that.getSampleBoxInfo();
        } else {
          box.showToast(res.message);
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
  clickItem(e) {
    let sampleid = e.currentTarget.dataset.sampleid;
    let status = e.currentTarget.dataset.statusstring;
    let max = e.currentTarget.dataset.max;
    let uid = e.currentTarget.dataset.uid;
         
        if (sampleid && status && max) {
            if(status == '未封管'){
                wx.navigateTo({
                  url: `/pages/lisCoyoteAddTube/index?boxnum=${this.data.boxnum}&sampleId=${sampleid}`
                });
            }else{
                if(max == 1){
                  if(uid){
                    wx.navigateTo({
                      url: `/pages/lisCoyoteCellDetails/index?sampleId=${sampleid}&uid=${uid}`,
                    });
                  }
                }else{
                    wx.navigateTo({
                        url: `/pages/lisCoyoteMoreCellDetails/index?sampleId=${sampleid}`,
                    });
                }
            }
        }
  },
  /**
   * 最大封箱数量 立即封箱弹框
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
      // id: that.data.id
    }
    request.request_coyote('/info/closecheck.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0 || res.data.success == 2) {
          that.setData({
            isSure: false,
            isBack: false,
            isMaxBox: false,
            isShowSuccess: false,
            successboxnum: res.data.boxnum,
            successnum: res.data.num,
          });
        } else if (res.data.success == 1) {
          // 存在未封管的试管，请先封管
          that.setData({
            isSure: false,
            isBack: false,
            isMaxBox: false,
            isShowSample: true,
            sampleId: res.data.sampleId,
            sampleData:{
              title: "温馨提示",
              titles: "还存在未封管的试管，请先封管后完成封箱",
              cancel: "取消",
              sure: "去封管"
            },
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
      box_num: that.data.boxnum
    }
    request.request_coyote('/info/deleteboxcode.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          box.showToast(res.message)
          that.setData({
            isDelete: false,
            isShowSuccess: false
          });

          that.onClickLeft();
        } else {
          box.showToast(res.message);
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

  // 删除试管
  delShop(e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该试管吗？',
      success: function(res) {
        if (res.confirm) {
          let sampleId = e.currentTarget.dataset.sampleid;
          let params = {
            sampleId: sampleId
          }
          request.request_coyote('/info/hdeletesample.hn', params, function (res) {
            if (res) {
              if (res.data.success == 0) {
                box.showToast(res.message)
                that.getSampleBoxInfo();
              } else {
                box.showToast(res.message);
              }
            } else {
              box.showToast("网络不稳定，请重试");
            }
          });
        }
      }
    })
  },
})