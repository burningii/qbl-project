const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeTab: 1,
        customList: [],
    },
    onChangeTabBar(event) {
        app.onChangeTabBar(event.detail)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '客户列表'
        })
        this.loadCustomerList()
    },
    /**
     * 获取客户列表
     */
    loadCustomerList(){
        wx.showLoading({
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: 'getCustomerList',
            data: {
                uid: wx.getStorageSync('user_info').id
            }
        }).then(res=>{
            const result = res.data
            this.setData({
                customList: result.data
            })
        })
    },
    /**
     * 增加客户
     */
    addCustomer() {
        wx.navigateTo({
            url: '/pages/add-customer/index'
        })
    },
    // 详情页
    goCustomerInfo(e){
        const {id} = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/add-customer/index?id=${id}`
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