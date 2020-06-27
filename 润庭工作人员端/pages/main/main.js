const app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 去房屋信息审核
    goPage1() {
        wx.navigateTo({
            url: '/pages/houseInfoCheck/index'
        })
    },
    // 去租户信息审核
    goPage2() {
        wx.navigateTo({
            url: '/pages/tenantInfoCheck/index'
        })
    },
    // 去预约信息查询
    goPage3() {
        wx.navigateTo({
            url: '/pages/orderInfoCheck/index'
        })
    },

    goPage4(){
        wx.navigateTo({
            url: '/pages/page5/page5'
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
        this.checkLogin()
    },

    // 检测是否登录
    checkLogin(){
        if (!wx.getStorageSync('user_id')){
            wx.reLaunch({
                url: '/pages/index/index'
            })
        }
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