const app = getApp()
const imgUrl = app.siteInfo.imgUrl
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bottom_bgc: `${imgUrl}bg01-main.png`,
        landlord_bgc: `${imgUrl}bgorangle.png`,
        navH: app.globalData.navHeight,
        navBarTitle: '润庭',
        currentUserAvatar: ''
    },

    goMyPage(){
        wx.navigateTo({
          url: `/pages/user/info/info`
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    // 去房东页面
    goLandlord() {
        wx.navigateTo({
            url: '/pages/landlord/landlord'
        })
    },

    // 去租户页面
    goTenant() {
        wx.navigateTo({
            url: '/pages/tenant/tenant'
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    // 检测是否登录
    checkLogin() {
        if (!wx.getStorageSync('user_id')) {
            wx.reLaunch({
                url: '/pages/index/index'
            })
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            currentUserAvatar: wx.getStorageSync('user_info').img
        })
        this.checkLogin()
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