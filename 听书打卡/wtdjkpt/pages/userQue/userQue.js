var idx = 1;
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
var radio, idCardArr = [];
Page({
  data:{
    // add
    isShow: true,
    tab: 'tab1',
    enlarge: false,
    type: 'radio',
    status: 1,
    status1: false,//控制回复form框
    isScoped: 1
  },
  onLoad(){
    this.getStatus();
    this.setData({
      avator:wx.getStorageSync('USER_INFO').avatar_url,
      nickname: wx.getStorageSync('USER_INFO').nickname,
    })
  },
  getStatus(){
    var _that=this;
    console.log(1);
    getApp().request({
      url: getApp().api.default.get_artificer,
      success: res => {
        console.log(res);
        if(res.data==null || res.data.type==3){
          _that.setData({
            sta:'user'
          })
          wx.setNavigationBarTitle({
            title: '我的问题列表',
          })
          _that.init();
        }else {
          _that.setData({
            sta:'expert'
          })
          wx.setNavigationBarTitle({
            title: '答复',
          })
          _that.inits({ page: 1, status: 1 });
        }
      }
    })
  },
  init(){
    var _that=this;
    getApp().request({
      url:getApp().api.default.userQue,
      data:{
        page:1,
        limit:1000
      },
      success:res => {
        if(res.data.length==0 && _that.data.sta=='user'){
          wx.showModal({
            title: '提示',
            content: '你还未发起提问或没有更多了',
            success:function(){
              wx.redirectTo({
                url: '/pages/user/user',
              })
            }
          })
          
        }
        console.log(11231);
        console.log(res);
      var d=res.data.map(item => {
         return item.created_at=_that.dealTime(item.created_at);
       })
       console.log(d);
        _that.setData({
        queData:res.data
        })
        console.log(_that.data.queData);
      }
    })
  },

  dealTime(e){
    console.log(e);
    var a = new Date(Number(e) * 1000);
    var time = a.getMonth() + '/' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes();
    return time;
  },
  // add
  inits(e) {
    var _that = this;
    getApp().request({
      url: getApp().api.default.expertQue,
      data: {
        page: e.page || 1,
        limit: 1000,
        status: e.status || 2
      },
      success: res => {
        if (res.data.length == 0 && _that.data.sta == 'expert') {
          wx.showModal({
            title: '提示',
            content: '没有更多了或未有人向你发起提问',
            success: function () {
              wx.redirectTo({
                url: '/pages/user/user',
              })
            }
          })
          return;
        }
        console.log(res);
        for(let i=0;i<res.data.length;i++){
          var a = new Date(Number(res.data[i].created_at) * 1000);
          var time = a.getMonth() + '/' + a.getDate() + ' ' + a.getHours() + ':' + a.getMinutes();
          res.data[i].time = time;
        }
        _that.setData({
          quesArr: res.data
        })
        console.log(_that.data.quesArr);
      }
    })
  },
  tabEvent(e) {
    console.log(e.target.dataset.id);
    switch (e.target.dataset.id) {
      case 'tab1':
        this.setData({
          isShow: true,
          tab: 'tab1'
        });
        this.inits({page:1,status:1})
        break;
      case 'tab2':
        this.inits({ page: 1, status: 2 });
        this.setData({
          isShow: false,
          tab: 'tab2'
        });
        break;
    }
  },
  imgEnlarge() {
    this.setData({
      enlarge: !this.data.enlarge
    })
  },
  asEvent(e) {
    this.setData({
      status1: !this.data.status1
    })
  },
  onPullDownRefresh() {
    console.log(1);
  },
  addMore() {
    idx++;
    let s;
    console.log(this.data.tab);
    this.data.tab == 'tab1' ? s = 1 : s = 2;
    this.init({ page: idx, status: s ,type:'add'});
  },
  quesInput(e) {
    this.setData({
      size: e.detail.value.length
    })
  },
  radioEvent() {
    this.setData({
      type: 'radio'
    })
  },
  videoEvent() {
    this.setData({
      type: 'video'
    })
  },
  picEvent() {
    this.setData({
      type: 'pic'
    })
  },

  upload: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 1000
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        that.setData({
          tempFilePaths: tempFilePaths
        })
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          getApp().core.uploadFile({
            url: getApp().api.default.upload_image,
            filePath: res.tempFilePaths[i],
            name: 'image',
            success: res => {
              idCardArr.push(JSON.parse(res.data).data.url);
            }
          })
        }
      }
    })
  },
  delEvent(e) {
    console.log(e);
    this.setData({
      tempFilePaths: this.data.tempFilePaths.filter((item, index) => {
        return index != e.target.dataset.id
      })
    })
    idCardArr = this.data.tempFilePaths;
  },
  //选择视频
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.setData({
          src: res.tempFilePath,
        })
        //上传视频
        var src = that.data.src;
        console.log(src);
        wx.uploadFile({
          url: getApp().api.default.upload_video,
          filePath: src,
          name: 'video',
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: res => {
            console.log(res),
              console.log(JSON.parse(res.data).data, '++++');
            that.setData({
              src2: JSON.parse(res.data).data.url
            })
            console.log(that.data.src2);
          }
        })
        wx.showLoading({
          title: '上传中',
          duration: 5000
        })
      }
    })
  },
  delVideo() {
    this.setData({
      src: '',
      src1: ''
    })
  },
  touchStart() {
    var that = this;
    if (that.data.isScoped != 2) {
      wx.authorize({
        scope: 'scope.record',
        success() {
          console.log("录音授权成功");
          //第一次成功授权后 状态切换为2
          that.setData({
            isScoped: 2,
          })
        },
      })
    }
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
      encodeBitRate: 96000,
      format: 'mp3',
      frameSize: 50
    }
    console.log(options);
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
      console.log('error')
    })
  },
  touchEnd() {
    var that = this;
    console.log('结束');
    recorderManager.stop();
    recorderManager.onStop((res) => {
      let time = parseInt(res.duration / 1000);
      that.setData({
        voice: res,
        voiceTime: time,
        showVoice: true,
      })
      wx.uploadFile({
        url: getApp().api.default.upload_audio,
        filePath: res.tempFilePath,
        name: 'audio',
        header: {
          'content-type': 'multipart/form-data'
        },
        success: res => {
          wx.showToast({
            title: '保存完成',
            icon: 'success',
            duration: 2000
          })
          console.log(JSON.parse(res.data).data.url);
          that.setData({
            src3: JSON.parse(res.data).data.url
          })
        },
        fail: function (res) {
          console.log("。。录音保存失败。。");
        }
      })
    })
  },
  playVoice() {
    console.log(this.data.voice);
    let voice = this.data.voice.tempFilePath;
    console.log(voice, 'Luyin');
    innerAudioContext.autoplay = true
    innerAudioContext.src = voice,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  radioOperate() {
    if (this.data.status == 1) {
      this.touchStart();
      this.setData({
        status: 2
      })
    } else if (this.data.status == 2) {
      this.touchEnd();
      this.setData({
        status: 3
      })
    } else {
      console.log('操作播放');
      this.playVoice();
    }
  },
  saveInfo(e) {
    let chooseType, url = '';
    if (idCardArr && this.data.type == 'pic') {
      chooseType = 2;
      for (let i = 0; i < idCardArr.length; i++) {
        console.log(idCardArr[i]);
        url = url + idCardArr[i] + ','
        url = url.substring(0, url.length - 1);
      }
      console.log(url);
    } else if (this.data.src2 && this.data.type == 'video') {
      chooseType = 4;
      url = this.data.src2;
    } else if (this.data.voice && this.data.type == 'radio') {
      chooseType = 3;
      url = this.data.src3;
    } else {
      chooseType = 1;
    }
    let que1 = e.detail.value.question,
      que2 = e.detail.value.question2,
      obj;
    if (chooseType > 1) {
      obj = { answer: que1, type: chooseType, url: url }
    } else {
      obj = { answer: que1, type: chooseType }
    }
    if (que2.length > 0) {
      obj.detail = que2;
    }
    if (!que1) {
      wx.showModal({
        title: '提示',
        content: '疑问为必填项',
      })
      return;
    }
    obj.url = url,
      obj.qid = this.data.quesArr.id,
      obj.artificer_id = this.data.quesArr.artificer_id;
    getApp().request({
      url: getApp().api.default.answer,
      method: 'post',
      data: obj,
      success: res => {
        if (res.code == 0) {
          wx.showModal({
            title: '提示',
            content: '回答成功',
          })
        }
        console.log(res);
      }
    })
  },
  onShow(){
    console.log('页面显示')
    this.getStatus();
  }
})