const { showToast } = require('../../utils/box.js')
const box = require('../../utils/box.js')
const request = require('../../utils/request.js')
const utils = require('../../utils/utils.js')
const app = getApp()

var isRepeat = true;  //手录信息码 判断重复提交

Page({
  data: {
    isQudao: false,
    paychannel: '',
    qudaoIndex: -1,

    isMaxBox: false,
    maxBoxData: {
      title: "温馨提示",
      titles: "已达上限人数，请封管",
      cancel: "取消",
      sure: "立即封管"
    },

    isSure: false,
    sureData: {
      title: "确认封管吗？",
      titles: "封管后将结束该试管绑定任务",
      cancel: "取消",
      sure: "确认"
    },

    isShowBox: false,
    boxData: {
      title: "温馨提示",
      titles: "未添加任何人员信息，不允许封管",
      cancel: "取消",
      sure: "知道了"
    },

    isBack: false,
    backData: {
      title: "试管还未封管，确认返回吗？",
      titles: "返回后数据会自动保存",
      cancel: "直接返回",
      sure: "立即封管"
    },
    
    isShowSuccess: false,
    id: "",
    boxnum: "",
    boxnumTime: "",
    // boxnumMax: 0,
    canuse: 0,
    samplesum: 1,
    instrumentList: [],
    
    // 设置开始的位置
    startX: 0,
    startY: 0,

    dutytypeIndex: 0,
    type: '单采',
    testtype: '1',
    dutytypeList: [],

    jobtypeIndex: 0,
    specimenType: '咽拭子',
    jobtypeList: [],

    isInputBoxnum: false,
    boxCodeNumber: '',

    sampleId: '',
    isFocus: false,
    sourceInfoList: [],
    sampleOldId: '',

    isScanShow: 1, // 1--扫码  2--手录

  },
  onLoad: function (options) {
    let boxnum = options.boxnum;
    let sampleId = options.sampleId;

    this.setData({
      id: app.globalData.userInfo.id || 322,
      boxnum: boxnum,
      sampleOldId: sampleId,
      sampleId: sampleId
    });

    this.getSampleBoxInfo();
    this.gettype();
    this.getstype();

    // if(this.data.sampleId){
    //   this.getClosesample();
    //   // this.getCustomInfo();
    // }
  },
  onShow() {
    // this.getSampleBoxInfo();
    // this.gettype();
    // this.getstype();
    if(this.data.sampleId){
      this.getClosesample();
      // this.getCustomInfo();
    }
  },
  /**
   * 混采类型
   */
  gettype() {
    let that = this;
    let params = {

    }
    request.request_coyote('/info/gettype.hn', params, function (res) {
      if (res) {
        if (res.code == 200) {
          that.setData({
            dutytypeList: res.data
          });
          if(that.data.dutytypeList.length > 0){
            that.setData({
              dutytypeIndex: 0,
              type: that.data.dutytypeList[0].type,
              testtype: that.data.dutytypeList[0].id
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
  /**
   * 标本类型
   */
  getstype() {
    let that = this;
    let params = {

    }
    request.request_coyote('/info/getstype.hn', params, function (res) {
      if (res) {
        if (res.code == 200) {
          that.setData({
            jobtypeList: res.data
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
            // boxnumTime: res.data.date,
            // boxnumMax: res.data.maxsum,
            canuse: res.data.canuse,
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
   * 返回按钮
   */
  onClickLeft() {
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 封管
   */
  clickDown: utils.throttle(function (e) {
    let that = this;
    let params = {
      sampleId: that.data.sampleId
    }
    request.request_coyote('/info/closechecksample.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          //可以封管
          that.setData({
            isSure: true
          });
        } else if (res.data.success == 2) {
          // 未添加任何人员不可以封管
          that.setData({
            isMaxBox: false,
            isBack: false,
            isSure: false,
            isShowBox: true
          });
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  }, 2000),
  /**
   * 立即封箱 确认
   */
   sureCancel() {
    this.setData({
      isSure: false
    });
  },
  sureSure: utils.throttle(function (e) {
    this.setHclosesample();
  }, 2000),
  /**
   * 扫试管码
   */
  clickNewScan() {
    this.getScanQRCodeClick();
  },
  getScanQRCodeClick() {
    // 点击的时候调起扫一扫功能呢
    let that = this;
    wx.scanCode({
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success(res) {
        console.log('---->:', res.result)
        let sampleId = res.result;
        if (sampleId) {
          that.checkSampleStatus(sampleId);
        }
      },
      fail(res) {
        console.log("err", res);
      },
    });
  },
  checkSampleStatus(sampleId) {
    let that = this;
    let params = {
      sampleId: sampleId,
      testtype: that.data.testtype,
    }
    request.request_coyote('/info/checksample.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            sampleId: sampleId
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
   * 未添加任何人员信息，不允许封管  弹框
   */
  boxCancel() {
    this.setData({
      isShowBox: false
    });
  },
  boxSure() {
    this.setData({
      isShowBox: false
    });
  },
  /**
   * 返回
   */
  backPage() {
    //this.data.isShowSuccess || 
    if (this.data.sampleId) {
      this.setData({
        isBack: true
      });
    } else {
      this.onClickLeft();
    }
  },
  backCancel() {
    this.setData({
      isBack: false
    });
    this.onClickLeft();
  },
  backSure() {
    this.maxBoxSure();
  },
  /**
   * 左滑删除 
   */
  touchStart: function (e) {
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
  touchMove: function (e) {
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
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  /**
   * 已达上限人数，请封管 弹框
   */
  maxBoxCancel() {
    this.setData({
      isMaxBox: false
    });
  },
  maxBoxSure() {
    let that = this;
    let params = {
      sampleId: that.data.sampleId
    }
    request.request_coyote('/info/closechecksample.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          //可以封管
          that.setData({
            isMaxBox: false,
            isBack: false
          });
          that.setHclosesample();
        } else if (res.data.success == 2) {
          // 未添加任何人员不可以封管
          that.setData({
            isMaxBox: false,
            isBack: false,
            isShowBox: true
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
   * 混采类型
   */
  bindSelectDutytype: function (e) {
    if(this.data.testtypeOld == 1 && this.data.instrumentList.length > 0){
      this.setData({
        dutytypeIndex: 0,
        type: '单采',
        testtype: '1',
      });
      box.showToast('请先封管后再切换类型');
      return
    }

    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dutytypeIndex: e.detail.value,
      type: that.data.dutytypeList[e.detail.value].type,
      testtype: that.data.dutytypeList[e.detail.value].id
    });

    if(this.data.testtype == this.data.testtypeOld){
      this.setData({
        samplesum: this.data.testtype == 3 ? 10 : this.data.testtype == 2 ? 5 : 1
      })
      if(this.data.sampleOldId){

        this.setData({
          sampleId: this.data.sampleOldId
        });

        this.getClosesample();
        this.getSampleBoxInfo();

          // 清空试管和受检者信息
          this.setData({
            isQudao: false,
            paychannel: '',
            qudaoIndex: -1,
            isMaxBox: false,
            isSure: false,
            isShowBox: false,
            isBack: false,
            isShowSuccess: false,
            // canuse: 0,
            // samplesum: 1,
            instrumentList: [],
            // dutytypeIndex: 0,
            // type: '单采',
            // testtype: '1',
            // jobtypeIndex: 0,
            // specimenType: '咽拭子',
            isInputBoxnum: false,
            boxCodeNumber: '',
            // sampleId: '',
            isFocus: false,
            sourceInfoList: []
          });
      }
    }else{
      this.setData({
        samplesum: this.data.testtype == 3 ? 10 : this.data.testtype == 2 ? 5 : 1
      })
      this.getSampleBoxInfo();
      // 清空试管和受检者信息
      this.setData({
        isQudao: false,
        paychannel: '',
        qudaoIndex: -1,
        isMaxBox: false,
        isSure: false,
        isShowBox: false,
        isBack: false,
        isShowSuccess: false,
        // canuse: 0,
        // samplesum: 1,
        instrumentList: [],
        // dutytypeIndex: 0,
        // type: '单采',
        // testtype: '1',
        // jobtypeIndex: 0,
        // specimenType: '咽拭子',
        isInputBoxnum: false,
        boxCodeNumber: '',
        sampleId: '',
        isFocus: false,
        sourceInfoList: []
      });
    }
  },
  /**
   * 标本类型
   */
  bindSelectJobtype: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      jobtypeIndex: e.detail.value,
      specimenType: that.data.jobtypeList[e.detail.value].specimenType
    });
  },
  /**
   * 手录试管条码
   */
  bindinputSample(e) {
    this.setData({
      sampleId: e.detail.value
    });
  },
  // 输入完成事件
  confirmListener (event) {
    if (this.data.sampleId) {
      this.checkSampleStatus(this.data.sampleId);
    }
  },
  clearsampleCodeNumber() {
    this.setData({
      sampleId: '',
    });
  },
  /**
   * 获取信息码(暂时注释)
   */
  bindGetInfoCode() {
    wx.navigateTo({
      url: '/pages/lisCoyoteGetInfoCode/index'
    });
  },
  /**
   * 用户信息详情
   */
  bindSubjectInfo(e) {
    let uid = e.currentTarget.dataset.id;
    let sampleId = e.currentTarget.dataset.sampleid;
    if(uid && sampleId){
      wx.navigateTo({
        url: `/pages/lisCoyoteSubjectInfo/index?uid=${uid}&sampleId=${sampleId}`
      });
    }
  },
  /**
   *  扫信息码
   */
  scanQRCodeInfo() {
    this.setData({
      isScanShow: 1
    });
    this.getScanQRCodeInfo();
  },
  getScanQRCodeInfo() {
    // 点击的时候调起扫一扫功能呢
    let that = this;
    wx.scanCode({
      scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
      success(res) {
        console.log('---->:', res.result)
        let codeinfo = res.result;
        if (codeinfo) {
          that.setCheckinfo(codeinfo);
        }
      },
      fail(res) {
        console.log("err", res);
      },
    });
  },
  /**
   * 判断单采扫描信息码调用接口
   */
  setCheckinfo(codeinfo) {
    let that = this;
    // let params = {
    //   codeinfo: codeinfo,
    //   sampleId: that.data.sampleId,
    //   testtype: that.data.testtype,
    //   sampletype: that.data.specimenType,
    // }
    // request.request_coyote('/info/checkinfo.hn', params, function (res) {
    //   if (res) {
    //     if (res.data.success == 0) {
          that.setData({
            boxCodeNumber: codeinfo
          });
          //调用bindinfo（有订单信息的接口
          that.getBindinfo();
    //     } else if (res.data.success == 2) {
    //       that.setData({
    //         boxCodeNumber: codeinfo
    //       });
    //       //调用bindsecondinfo（调用无订单信息接口，需要绑定渠道）
    //       that.getChannelList();
    //     } else if (res.data.success == 4) {
    //       // 已达上限人数，请封管
    //       that.setData({
    //         isInputBoxnum: false,
    //         isMaxBox: true
    //       });
    //     } else {
    //       box.showToast(res.message);
    //     }
    //   } else {
    //     box.showToast("网络不稳定，请重试");
    //   }
    // });
  },
  /**
   * 手录信息码
   */
  bindInputBoxnum() {
    isRepeat = true;

    this.setData({
      isScanShow: 2,
      isInputBoxnum: true,
      isFocus: true,
      boxCodeNumber: ''
    });
  },
  inputBoxnum(e) {
    this.setData({
      boxCodeNumber: e.detail.value
    });
  },
  clearboxCodeNumber() {
    this.setData({
      boxCodeNumber: '',
      isFocus: true
    });
  },
  dialogBoxnumCancel() {
    this.setData({
      isInputBoxnum: false,
      isFocus: false,
      boxCodeNumber: ''
    });
  },
  /**
   * 判断单采扫描信息码调用接口
   */
  dialogBoxnumSure() {
    let that = this;
    if (that.data.boxCodeNumber) {
      if(isRepeat){
        isRepeat = false;
        // let params = {
        //   codeinfo: that.data.boxCodeNumber,
        //   sampleId: that.data.sampleId,
        //   testtype: that.data.testtype,
        //   sampletype: that.data.specimenType,
        // }
        // request.request_coyote('/info/checkinfo.hn', params, function (res) {
        //   if (res) {
        //     if (res.data.success == 0) {
              //调用bindinfo（有订单信息的接口
              that.getBindinfo();
        //     } else if (res.data.success == 2) {
        //       //调用bindsecondinfo（调用无订单信息接口，需要绑定渠道）
        //       that.getChannelList();
        //     } else if (res.data.success == 4) {
        //       // 已达上限人数，请封管
        //       that.setData({
        //         isInputBoxnum:false,
        //         isMaxBox: true
        //       });
        //       isRepeat = true;
        //     } else {
        //       box.showToast(res.message);
        //       isRepeat = true;
        //     }
        //   } else {
        //     isRepeat = true;
        //     box.showToast("网络不稳定，请重试");
        //   }
        // });
      } else {
        box.showToast('已提交信息,请稍等~')
      }
    } else {
      box.showToast('信息码不能为空')
    }
  },
  /**
   * 单采获取人员信息渠道方法
   */
  getChannelList() {
    let that = this;
    let params = {
      id: that.data.id
    }
    request.request_coyote('/info/getchannel.hn', params, function (res) {
      isRepeat = true;
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            isInputBoxnum: false,
            isFocus: false,
            sourceInfoList: res.data.sourceInfoList,
            isQudao: true
          });
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
  },
  bindSelectQudao(e) {
    let qudaoIndex = e.currentTarget.dataset.index;
    let paychannel = e.currentTarget.dataset.paychannel;
    this.setData({
      qudaoIndex: qudaoIndex,
      paychannel: paychannel
    });
  },
  dialogQudaoCancel() {
    this.setData({
      isQudao: false,
      qudaoIndex: -1,
      paychannel: ''
    });
  },
  /**
   * 单采获取人员信息无订单信息方法
   */
  dialogQudaoSure: utils.throttle(function (e) {
    if (this.data.qudaoIndex != -1 && this.data.paychannel) {

      //单采获取人员信息无订单信息方法
      let that = this;
      let params = {
        id: that.data.id,
        codeinfo: that.data.boxCodeNumber,
        sampleId: that.data.sampleId,
        box_num: that.data.boxnum,
        sampletype: that.data.specimenType,
        paychannel: that.data.paychannel,
        testtype: that.data.testtype
      }
      request.request_coyote('/info/bindsecondinfo.hn', params, function (res) {
        if (res) {
          if (res.data.success == 0) {
            that.setData({
              boxCodeNumber: "",
              isQudao: false,
              qudaoIndex: -1,
              paychannel: ''
            });
            // that.getCustomInfo();
            that.getClosesample();

            if(res.data.isBigScreen == 0 && that.data.isScanShow == 1){
              //  大筛 调用扫码
              that.getScanQRCodeInfo();
            }
          } else {
            box.showToast(res.message);
          }
        } else {
          box.showToast("网络不稳定，请重试");
        }
      });
    } else {
      box.showToast('请选择渠道');
    }
  }, 2000),
  /**
   * 单采获取人员信息方法
   */
  getBindinfo() {
      //单采获取人员信息无订单信息方法
      let that = this;
      let params = {
        id: that.data.id,
        codeinfo: that.data.boxCodeNumber,
        sampleId: that.data.sampleId,
        box_num: that.data.boxnum,
        sampletype: that.data.specimenType,
        testtype: that.data.testtype
      }
      request.request_coyote('/info/bindinfo.hn', params, function (res) {
        isRepeat = true;

        if (res) {
          if (res.data.success == 0) {
            that.setData({
              boxCodeNumber: "",
              isInputBoxnum:false
            });
            // that.getCustomInfo();
            that.getClosesample();

            if(res.data.isBigScreen == 0 && that.data.isScanShow == 1){
              //  大筛 调用扫码
              that.getScanQRCodeInfo();
            }
          } else if (res.data.success == 1) {
            //调用bindsecondinfo（调用无订单信息接口，需要绑定渠道）
            that.getChannelList();
          } else if (res.data.success == 9) {
            // 已达上限人数，请封管
            that.setData({
              isInputBoxnum: false,
              isMaxBox: true
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
   * 获取人员信息方法
   */
  getCustomInfo() {
    //单采获取人员信息无订单信息方法
    let that = this;
    let params = {
      sampleId: that.data.sampleId,
    }
    request.request_coyote('/info/getinfo.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            instrumentList: res.data.codeInfoVo
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
   * 获取未封管试管方法
   */
  getClosesample() {
    let that = this;
    let params = {
      sampleId: that.data.sampleId,
      box_num: that.data.boxnum,
    }
    request.request_coyote('/info/closesample.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          that.setData({
            instrumentList: res.data.infolist,
            canuse: res.data.canuse,
            samplesum: res.data.samplesum,
            sampleId: res.data.sampleId
            // sampletype: res.data.sampletype
          });
          
            if(that.data.dutytypeList && that.data.dutytypeList.length > 0){
              for(let i = 0; i < that.data.dutytypeList.length; i++){
                if(res.data.testtype == that.data.dutytypeList[i].id){
                  that.setData({
                    dutytypeIndex: i,
                    type: that.data.dutytypeList[i].type,
                    testtype: that.data.dutytypeList[i].id,
                    testtypeOld: that.data.dutytypeList[i].id,
                  });
                }
              }
            }

            if(that.data.jobtypeList && that.data.jobtypeList.length > 0){
              for(let i = 0; i < that.data.jobtypeList.length; i++){
                if(res.data.sampletype == that.data.jobtypeList[i].specimenType){
                  that.setData({
                    jobtypeIndex: i,
                    specimenType: that.data.jobtypeList[i].specimenType
                  });
                }
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
   * 封管检查方法
   */
  setHclosesample() {
    let that = this;
    let params = {
      sampleId: that.data.sampleId,
      sampleType: that.data.specimenType,
      testtype: that.data.testtype
    }
    request.request_coyote('/info/hclosesample.hn', params, function (res) {
      if (res) {
        if (res.data.success == 0) {
          box.showToast(res.message);
          
          that.getSampleBoxInfo();

          that.scanQRCodeClick();

          if(res.data.testtype){
            if(that.data.dutytypeList && that.data.dutytypeList.length > 0){
              for(let i = 0; i < that.data.dutytypeList.length; i++){
                if(res.data.testtype == that.data.dutytypeList[i].id){
                  that.setData({
                    dutytypeIndex: i,
                    type: that.data.dutytypeList[i].type,
                    testtype: that.data.dutytypeList[i].id,
                  });
                }
              }
            }
          }

          if(res.data.sampleType){
            if(that.data.jobtypeList && that.data.jobtypeList.length > 0){
              for(let i = 0; i < that.data.jobtypeList.length; i++){
                if(res.data.sampleType == that.data.jobtypeList[i].specimenType){
                  that.setData({
                    jobtypeIndex: i,
                    specimenType: that.data.jobtypeList[i].specimenType
                  });
                }
              }
            }
          }

          that.setData({
            samplesum: res.data.samplesum
          });
          

          // 清空试管和受检者信息
          that.setData({
            isQudao: false,
            paychannel: '',
            qudaoIndex: -1,
            isMaxBox: false,
            isSure: false,
            isShowBox: false,
            isBack: false,
            isShowSuccess: false,
            // canuse: 0,
            // samplesum: 1,
            instrumentList: [],
            // dutytypeIndex: 0,
            // type: '单采',
            // testtype: '1',
            // jobtypeIndex: 0,
            // specimenType: '咽拭子',
            isInputBoxnum: false,
            boxCodeNumber: '',
            sampleId: '',
            isFocus: false,
            sourceInfoList: [],
            sampleOldId: ''
          });
        } else if (res.data.success == 2) {
          that.setData({
            isShowBox: true
          });
        } else {
          box.showToast(res.message);
        }
      } else {
        box.showToast("网络不稳定，请重试");
      }
    });
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
            // 清空试管和受检者信息
            // that.setData({
            //   isQudao: false,
            //   paychannel: '',
            //   qudaoIndex: -1,
            //   isMaxBox: false,
            //   isSure: false,
            //   isShowBox: false,
            //   isBack: false,
            //   isShowSuccess: false,
            //   // canuse: 0,
            //   samplesum: 1,
            //   instrumentList: [],
            //   dutytypeIndex: 0,
            //   type: '单采',
            //   testtype: '1',
            //   jobtypeIndex: 0,
            //   specimenType: '咽拭子',
            //   isInputBoxnum: false,
            //   boxCodeNumber: '',
            //   sampleId: '',
            //   isFocus: false,
            //   sourceInfoList: [],
            //   sampleOldId: ''
            // });
          } else if (res.data.success == 1) {
            // 已达最大封箱数量，请先封箱
            wx.navigateBack({
              delta: 1
            });
          } else if (res.data.success == 2) {
            // 存在未封管试管，请先封管
            wx.navigateBack({
              delta: 1
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