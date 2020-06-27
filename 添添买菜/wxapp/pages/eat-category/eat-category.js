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
        app.page.onLoad(this, options);
        wx.setNavigationBarTitle({
            title: '菜谱分类'
        })
        this.loadFoodsCategory()
    },
    /**
     * 加载所有菜谱分类
     */
    loadFoodsCategory() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.get_cats,
            success: res => {
                if (0 == res.code) {
                    this.setData({
                        foods: res.data
                    })
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

    goFoodsInfo(e) {
        const {id, name} = e.currentTarget.dataset
        wx.navigateTo({
          url: `./info?id=${id}&name=${name}`
        })
    },

    /**
     * 去搜索
     */
    goSearch() {
        wx.navigateTo({
            url: '/pages/search-menus/search-menus'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.page.onReady(this);
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