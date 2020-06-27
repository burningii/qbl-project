Page({
  data:{
  },
  onLoad(options){
    var _that=this;
   this.setData({
      type:options.type || 3,
      cate_id:options.id
    })
    options.type==1?(wx.setNavigationBarTitle({
      title: '在线课程',
    }),
      this.init()
    ):options.type==2?(
      wx.setNavigationBarTitle({
      title:'专家列表'
    }),
     getApp().request({
       url:getApp().api.default.subjects,
       success: res => {
         _that.setData({
           skills:res.data
         })
         _that.init();
       }
     })
    ):(wx.setNavigationBarTitle({
      title:'技师列表'
    }),
          getApp().request({
            url: getApp().api.default.skills,
            success: res => {
              _that.setData({
                skills: res.data
              })
              _that.init();
            }
          })
    )
  },
  init(){
    var _that = this;
    if(this.data.type==1){
      getApp().request({
        url: getApp().api.default.get_course, 
        data: {
          cate_id: _that.data.cate_id,//专家2 技师3
          // type: _that.data.type
        },
        success: res => {
          console.log(res);
          _that.setData({
            arr: res.data
          })
        }
      })
      }
    else{

    getApp().request({
      url: getApp().api.default.get_artificers,
      data: {
        cate_id: _that.data.cate_id,//专家2 技师3
        type: _that.data.type
      },
      success: res => {
        for(let i=0;i<res.data.length;i++){
          res.data[i].skills=_that.skillsDeal(res.data[i].skills)
        };
        for(let j=0;j<res.data.length;j++){
          res.data[j].skills=_that.dealData(res.data[j].skills)
        }
        _that.setData({
          arr: res.data
        })
      }
    })
    }
  },
  skillsDeal(e){
    let f=[],
    a=e.split(',');
    for(let i=0;i<a.length;i++){
       if(Number(a[i])>0) {f.push(a[i])}
    }
    return f;
  },
  //技师专家技能处理
  dealData(e){
    var _that=this;
    let f=[];
    var a=this.data.skills;
    for(let i=0;i<e.length;i++){
     
      f.push(a.filter(item => {
        return item.id==e[i]
      })[0].name)
    }
    return f;
  },
  goArtificerInfo(){
    wx.navigateTo({
      url: '/pages/artificerInfo/artificerInfo',
    })
  }
})