const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.f && this.setData({flag: options.f})
        if ('1'==options.f){
            wx.setNavigationBarTitle({
              title: '用户协议'
            })
        }else{
          wx.setNavigationBarTitle({
            title: '隐私协议'
          })
        }
        this.loadXieYi()
    },

    // 加载协议
    loadXieYi() {
      wx.showLoading({
        title:'加载中',
        mask: !0
      })
        app.util.req({
            url: 'get_protocol',
            method: 'POST',
            data: {
                token: app.token,
                proType: Number(this.data.flag)
            }
        }).then(res => {
          wx.hideLoading()
            const result = res.data
            this.setData({
                xieyi: result.data
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})