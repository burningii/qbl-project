Page({
  onLoad(){
      this.init();
      this.setData({
        avatar_url:wx.getStorageSync('USER_INFO').avatar_url
      })
  },
  init(){
    var _that=this;
    getApp().request({
      url:getApp().api.default.withdraw_log,
      success: res =>{
        console.log(new Date(res[0].addtime*1000).getFullYear());
        for(let i=0;i<res.length;i++){
          res[i].addtime=_that.dealTime(res[i].addtime)
        }
        _that.setData({
          logs:res
        })
        console.log(res,'res测试');
      }
    })
  },
  dealTime(e){
    let a = new Date(e * 1000);
    return a.getMonth()+'/'+a.getDate()+' '+a.getHours()+':'+a.getMinutes()
  }
})