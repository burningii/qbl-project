const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        keyword: "",
        resultList: [1,1,1,1,1]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.page.onLoad(this, options);
        wx.setNavigationBarTitle({
            title: '搜索'
        })
    },
    searchNow() {
        if ('' == this.data.keyword) return wx.showModal({
            title: '失败',
            content: '请输入搜索内容',
            showCancel: !1,
        }), !1


    },
    onChangeKeyword(e) {
        this.setData({
            keyword: e.detail.replace(/\s*/g, "")
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.page.onReady(this);
    },
    onCancel() {
        wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.page.onShow(this)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        app.page.onHide(this)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        app.page.onUnload(this)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        app.page.onPullDownRefresh(this);
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
        app.page.onShareAppMessage(this);
    }
})