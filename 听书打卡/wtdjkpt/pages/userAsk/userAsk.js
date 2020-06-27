const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
Page({
  data: {
    status: true,
    isModal: true,
    total: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  upload: function () {
    let that = this;
    wx.chooseImage({
      count: 2, // 默认9
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
        console.log(that.data.tempFilePaths);
      }
    })
  },
  delEvent(e) {
    console.log(e);
    let newArr = this.data.tempFilePaths.filter((item, index) => {
      return index != Number(e.currentTarget.dataset.id);
    })
    this.setData({
      tempFilePaths: newArr
    })
    console.log(this.data.tempFilePaths);
  },
  chooseVideo: function () {
    console.log(1, this.data.src);
    var that = this
    wx.chooseVideo({
      success: function (res) {
        that.setData({
          src: res.tempFilePath,
        })
      }
    })
    console.log(2, this.data.src);
  },
  delVideo() {
    console.log(this.data.src);
    console.log(1);
    this.setData({
      src: null
    })
  },
  start: function () {
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
    })
  },
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
  },
  play: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.tempFilePath,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  saveQuestion() {
    var _that = this;
    console.log(1);
    wx.showToast({
      title: '提问成功！',
      duration: 400
    })
    setTimeout(function () {
      _that.setData({
        isModal: false
      })
    }, 500);
  },
  confirmEvent() {
    if (1) {
      wx.navigateTo({
        url: '/pages/recharge/recharge',
      })
    }
    //支付成功
    // this.setData({
    //   isModal:true
    // })
  },
  cancelEvent() {
    this.setData({
      isModal: true
    })
  },
  pickerEvent(e){
    this.setData({
      index:e.detail.value
    })
  },
    pickerEvent1(e) {
    this.setData({
      index1: e.detail.value
    })
  }
})