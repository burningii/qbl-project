var arr = [], idCardArr = [];
Page({
  data: {
    arr: [],
  },
  onLoad() {
    console.log(wx.getStorageSync('USER_INFO'));
    var _that = this;
    
    let f = [',', '1', ','];
    getApp().request({
      url: getApp().api.default.get_artificer,
      data:{
        uid:wx.getStorageSync('USER_INFO').id
      },
      success: function (e) {
        console.log(e,'e数据');
        if(e.data==null){
          wx.showModal({
            title: '提示',
            content: '你还未成为技师/专家',
            success:function(){
              wx.redirectTo({
                url: '/pages/user/user',
              })
            }
          })
          return;
        }
        e.data.type==2?(
          _that.setData({type:'expert'}),wx.setNavigationBarTitle({
          title: '专家资料修改',
        }), 
          getApp().request({
            url: getApp().api.default.subjects,
            success: function (t) {
              var exArr = t.data.map(item => {
                return item = { delname: item.name + '(' + item.price + ')', id: item.id }
              });
              _that.setData({
                expertArrs: t.data,
                expertArr: t.data.map(item => {
                  return item = item.name + '(' + item.price + ')'
                }),
                index: _that.expertIndexDeal(exArr)
              })
            }
          })
        ):(_that.setData({type:'artificer'}),wx.setNavigationBarTitle({
          title: '技师资料修改',
        }),
            getApp().request({
              url: getApp().api.default.skills,
              success: function (t) {
                console.log(t);
                _that.setData({
                  arr: t.data
                })
              }
            })
        )
        let f=e.data.skills.split(',');
        _that.setData({
          oldArr: e.data,
          sex:e.data.gender,
          idx: f.filter(item => {
           if(!isNaN(item))
            return item;
          })
        })
       console.log(_that.data.idx,'技能');
      }
    })
    
  },
  expertIndexDeal(a){
    console.log(a);
   let f=a.map((item, index) => {
    //  this.data.idx
      if (item.id == 3) {
        return item = { z: index };
      }
    })
    let g = f.filter(item => {
      return typeof item != 'undefined'
    })[0].z;
    console.log(g);
    return g;
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

        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths;
        e.target.dataset.type == 'status' ? that.setData({
          tempFilePaths: tempFilePaths
        }) : that.setData({
          tempFilePaths1: tempFilePaths
        });
      }
    })
  },
  delEvent1(e) {
    e.target.dataset.type == 'status' ?
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
  sexChange(e) {
    let sex = Number(e.target.dataset.id);
    console.log(sex);
    this.setData({
      sex: sex
    })
    console.log(this.data.sex);
  },
  checkboxEvent(e) {
    arr = e.detail.value;
    let a = '';
    for (let i in arr) {
      a = a + arr[i] + ',';
    }
    a = a.substring(0, a.length - 1);
    this.setData({
      skills: a
    })
  },
  registerEvent(e) {
    console.log(e);
    let name = e.detail.value.name || this.data.oldArr.nickname, mobile = e.detail.value.mobile || this.data.value.mobile, id_card = e.detail.value.id_card || this.data.oldArr.id_card, wx_name = e.detail.value.wx_name || this.data.value.wx, sex = this.data.sex, skills = this.data.skills || this.data.oldArr.skills, pay = e.detail.value.pay;
    console.log(name, mobile, id_card, wx_name);
    if (!name || !mobile || !id_card) {
      wx.showModal({
        title: '提示',
        content: '必填项不能为空'
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
    if (this.data.skills && this.data.skills.length == 0 && this.data.type == 'expert') {
      wx.showModal({
        title: '提示',
        content: '请完成科室的选择',
      })
      return;
    }
    // if (isNaN(pay) && this.data.type == 'expert') {
    //   wx.showModal({
    //     title: '提示',
    //     content: "请确保输入佣金类型为数值类型"
    //   })
    // }
    if (!(/^1[3456789]\d{9}$/.test(mobile))) {
      wx.showModal({
        title: '提示',
        content: '请确保电话号码输入正确',
      })
      return;
    }
    if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(id_card)) {
      wx.showModal({
        title: '提示',
        content: '请确保身份证号码输入正确'
      })
      return;
    }
    let obj = {};
    this.data.type == 'artificer' ? obj = { mobile, nickname: name, id_card, gender: sex, wx: wx_name, skills, type: 3,id:this.data.oldArr.id } : obj = { mobile, nickname: name, id_card, gender: sex, wx: wx_name, skills, type: 2,id:this.data.oldArr.id,price:this.data.expertArrs[this.data.index].price};
    getApp().request({
      url: getApp().api.diy.arti_edit,
      data: obj,
      //  data:{
      //    mobile,
      //    nickname:name,
      //    id_card,
      //    gender:sex,
      //    wx:wx_name,
      //    skills,
      //    type:1//1技师
      //  },
      method: 'post',
      success: res => {
          wx.showModal({
            title: '提示',
            content: res.msg,
            success:function(){
              wx.redirectTo({
                url: '/pages/index/index',
              })
            }
          })
      }
    })

  },
  pickerEvent(e) {
    this.setData({
      index: e.detail.value,
      skills:this.data.expertArrs[this.data.index].id
    })
  }

})