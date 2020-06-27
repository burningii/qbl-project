var arr=[],idCardArr=[];
Page({
  data:{
    type:'artificer',
    sex:1,
    arr: [],
    skills:[]
  },
  onLoad(){
    var _that=this;
    
    getApp().request({
      url: getApp().api.default.skills,
      success: function (t) {
        console.log(t);
        _that.setData({
          arr:t.data,
          expertArr:t.data.map( item => {
            return item=item.name+'('+item.price+')'
          })
        })
        console.log(_that.data.expertArr);
      }
    })
    
  },
  upload: function (e) {
    console.log(e.target.dataset.id);
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
        for(let i=0;i<res.tempFilePaths.length;i++){
          getApp().core.uploadFile({
            url: getApp().api.default.upload_image,
            filePath: res.tempFilePaths[i],
            name: 'image',
            success: res => {
              idCardArr.push(JSON.parse(res.data).data.url);
            }
          })
        }
      
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        e.target.dataset.type=='status'?that.setData({
              tempFilePaths: tempFilePaths
            }):that.setData({
              tempFilePaths1: tempFilePaths
            });
      }
    })
  },
  delEvent1(e){
e.target.dataset.type=='status'?
        this.setData({
          tempFilePaths: this.data.tempFilePaths.filter((item, index) => {
            return index != e.target.dataset.id
          })
  }) : this.setData({
    tempFilePaths1: this.data.tempFilePaths1.filter((item, index) => {
      return index != e.target.dataset.id
    })
  })
  },
  artificerEvent(){
           this.setData({
             type:'artificer'
           })
  },
  expertEvent(){
    var _that=this;
    this.setData({
      type: 'expert'
    })
    getApp().request({
      url: getApp().api.default.subjects,
      success: function (t) {
        _that.setData({
          expertArrs: t.data,
          expertArr: t.data.map(item => {
            return item = item.name + '(' + item.price + ')'
          })
        })
        console.log(_that.data.expertArr);
      }
    })
  },
  sexChange(e){
    let sex=Number(e.target.dataset.id);
    console.log(sex);
    this.setData({
      sex:sex
    })
    console.log(this.data.sex);
  },
  checkboxEvent(e){
    arr=e.detail.value;
    let a = '';
    for(let i in arr){
      a=a+arr[i]+',';
    }
    a=a.substring(0,a.length-1);
    this.setData({
      skills:a
    })
  },
  registerEvent(e){
    let name=e.detail.value.name,mobile=e.detail.value.mobile,id_card=e.detail.value.id_card,wx_name=e.detail.value.wx_name,sex=this.data.sex,skills=this.data.skills,pay=e.detail.value.pay;
    console.log(name,mobile,id_card,wx_name);
    
    if(!name || !mobile || !id_card){
      wx.showModal({
        title:'提示',
        content:'必填项不能为空'
      })
      return;
    }
    if (this.data.type == 'artificer' && this.data.skills && this.data.skills.length == 0) {
          wx.showModal({
            title: '提示',
            content: '技师认证，请确保至少选择一项技能',
          })
          return;
    }
   
    if (!(/^1[3456789]\d{9}$/.test(mobile))){
      wx.showModal({
        title: '提示',
        content: '请确保电话号码输入正确',
      })
      return;
    }
    if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id_card)){
      wx.showModal({
        title:'提示',
        content:'请确保身份证号码输入正确'
      })
      return;
    }
    if (!this.data.index && this.data.type == 'expert') {
      wx.showModal({
        title: '提示',
        content: '请完成科室的选择',
      })
      return;
    }
    let obj={};
    this.data.type == 'artificer' ? obj = { mobile, nickname: name, id_card, gender: sex, wx: wx_name, skills, type: 3 } : obj = { mobile, nickname: name, id_card, gender: sex, wx: wx_name, skills, type: 2, price: this.data.expertArrs[this.data.index].price}
    getApp().request({
     url:getApp().api.default.arti_register,
     data:obj,
    //3技师 2专家
     method:'post',
     success: res => {
       if(res.code==0){
         wx.showModal({
           title: '提示',
           content: '待审核...',
           success:function(){
             wx.redirectTo({
               url: '/pages/user/user',
             })
           }
         })
        
       }else{
         wx.showModal({
           title:"提示",
           content:res.msg
         })
       }
     }
    })
   
  },
  pickerEvent(e){
    this.setData({
      index:e.detail.value
    })
    console.log(this.data.index)
    console.log(this.data.arr)
    this.setData({
      skills: this.data.expertArrs[this.data.index].id
    })
  }
  
})