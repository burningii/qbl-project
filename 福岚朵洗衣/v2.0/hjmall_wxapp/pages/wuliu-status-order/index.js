const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.f && this.setData({
            status: options.f
        }), this.loadData()
    },

    // 去详情页面
    goInfo(e){
        const {id} = e.currentTarget.dataset
        wx.navigateTo({
          url: `./list?id=${id}&status=${this.data.status}`
        })
    },

    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.logist.detailed,
            method: 'POST',
            data: {
              sates: this.data.status
            },
            success: res => {
                console.log('详情数据为: ',res);
                if (0 == res.code) {
                    this.setData({orderList: res.data})
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
            }
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