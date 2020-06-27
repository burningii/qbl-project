const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        menus: [{
            title: '推荐'
        }, {
            title: '夏季'
        }, {
            title: '午晚餐'
        },{
            title: '推荐'
        }, {
            title: '夏季'
        }, {
            title: '午晚餐'
        }],
        menusList: [1,2,1,2,1,2,1,21], // 菜谱列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.page.onLoad(this, options);
        wx.setNavigationBarTitle({
            title: '今天吃啥'
        })
    },
    onChangeMenus(e){
        wx.pageScrollTo({
            scrollTop: 50,
            selector: '.menus-cookie'
        })
    },
    // 去所有菜谱分类
    goAllMenus(){
        wx.navigateTo({
          url: '/pages/eat-category/eat-category'
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
     * 去搜索
     */
    goSearch(){
        wx.navigateTo({
          url: '/pages/search-menus/search-menus'
        })
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

    // 去食谱页面
    goInfo(e){
        wx.navigateTo({
          url: `/pages/food/food?id=2`
        })
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