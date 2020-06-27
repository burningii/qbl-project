const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const e=require('../.././siteinfo.js');
console.log(e.attachment,'e数据')
var radio, idCardArr=[];
Page({
  data:{
    type:'video',
    status:1,
    isScoped:1,
    src2:'',
    src3:'',
    baseUrl:e.attachment
  },
  onLoad:function(e){
    
    console.log(e);
    this.setData({
      aid:e.artificer_id || e.id,
      order_id:e.order_id || wx.getStorageSync('order_id')    
      })
      console.log(this.data.aid,this.data.order_id);
  },
  quesInput(e){
    this.setData({
      size:e.detail.value.length
    })
  },
  radioEvent(){
    this.setData({
      type:'radio'
    })
  },
  delRadio() {
    this.setData({
      src3: '',
      status: 1
    })
    wx.showToast({
      title: '取消上传成功',
    })
  },
  videoEvent(){
    this.setData({
      type: 'video'
    })
  },
  picEvent(){
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
  delEvent(e){
    console.log(e);
    this.setData({
      tempFilePaths:this.data.tempFilePaths.filter((item,index)=> {
        return index != e.target.dataset.id
      })
    })
    idCardArr=this.data.tempFilePaths;
  },
  //选择视频
  chooseVideo: function () {
    var that = this
    wx.chooseVideo({
      sourceType:['album','camera'],
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
            console.log(JSON.parse(res.data).data,'++++');
            that.setData({
              src2: JSON.parse(res.data).data.url
            })
            console.log(that.data.src2);
          }
        })
       wx.showLoading({
         title: '上传中',
         duration:5000
       })
      }
    })
  },
  delVideo(){
    this.setData({
      src:'',
      src1:''
    })
  },
  touchStart() {
    var that=this;
    if(that.data.isScoped!=2){
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
    var that=this;
    console.log('结束');
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log(res);
     
      let time = parseInt(res.duration / 1000);
      that.setData({
        voice: res,
        voiceTime: time,
        showVoice: true,
      })
      console.log(res.tempFilePath,'音频文件');
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
    console.log(voice,'Luyin');
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
  radioOperate(){
    if(this.data.status==1){
      this.touchStart();
      this.setData({
        status:2
      })
    }else if(this.data.status==2){
      this.touchEnd();
      this.setData({
        status:3
      })
    }else{
      console.log('操作播放');
      this.playVoice();
    }
  },
  saveInfo(e){
      let chooseType,url='';
    if (idCardArr.length>0 && this.data.type=='pic'){
      console.log(idCardArr);
        chooseType=2;
        for(let i=0;i<idCardArr.length;i++){
          console.log(idCardArr[i]);
          url=url+idCardArr[i]+','
          url=url.substring(0,url.length-1);
        }
        console.log(url);
    } else if (this.data.src2.length>0 && this.data.type=='video'){
        chooseType=4;
        url=this.data.src2;
    } else if (this.data.src3.length>0 && this.data.type == 'radio' ){
        chooseType=3;
        url=this.data.src3;
      }else{
        chooseType=1;
      }
     let que1=e.detail.value.question,
       que2 = e.detail.value.question2,
       obj;
       if(chooseType>1){
         obj = { question: que1, type: chooseType, url: url }
       }else{
         obj = { question: que1, type: chooseType}
       }
       if(que2.length>0){
         obj.detail=que2;
       }
       if(!que1){
         wx.showModal({
           title: '提示',
           content: '疑问为必填项',
         })
         return;
       }
       obj.order_id=this.data.order_id,
       obj.artificer_id=this.data.aid;
    getApp().request({
      url: getApp().api.default.ask,
      method:'post',
      data:obj,
      success: res => {
        if(res.code==0){
          wx.showModal({
            title: '提示',
            content: '提问成功',
            success:res => {
              wx.redirectTo({
                url: '/pages/userQue/userQue',
              })
            }
          })
        }
        console.log(res);
      }
    })
  },
  

})