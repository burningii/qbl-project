// pages/landlord/landlord.js
Page({

    /**
     * 页面的初始数据
     */
    data: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 去租户信息申报
    goPage1() {
        wx.navigateTo({
            url: '/pages/tenant/house-num/house-num'
        })
    },
    // 去申报查询
    goPage2() {
        wx.navigateTo({
            url: '/pages/tenant/page2/page2'
        })
    },
    // 去预约查询
    goPage3() {
        wx.navigateTo({
            url: '/pages/tenant/page3/page3'
        })
    },
    // 去租赁许可证查询
    goPage4() {
        wx.navigateTo({
            url: '/pages/tenant/page4/page4'
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