const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeTab: 2,
        infoList: [2,1,2,12,1,2]
    },
    onChangeTabBar(event) {
        app.onChangeTabBar(event.detail)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '消息列表'
        })
        this.loadData()
    },
    /**
     * 加载消息列表
     */
    loadData(){
        const user_id=wx.getStorageSync('user_info').id
        wx.showLoading({
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: `getMsgList/${user_id}`,
        }).then(res=>{
            const result = res.data
            if (0 == result.code) {
                this.setData({
                    infoList: result.data
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: result.msg,
                    showCancel: !1,
                })
            }
        })
    },
    /**
     * 去详情页面
     */
    goInfo(e){
        const {item} = e.currentTarget.dataset
        if ('1'==item.msg_type){
            // 拜访
            wx.navigateTo({
                url: `/pages/add-todo/add-todo?id=${item.id}`
            })
        }else if ('2'==item.msg_type){
            // 生日公历
            wx.navigateTo({
              url: `/pages/add-todo/add-todo?customId=${item.id}`
            })
        }else if ('3'==item.msg_type){
            // 生日农历
            wx.navigateTo({
                url: `/pages/add-todo/add-todo?customId=${item.id}`
            })
        }else if ('4'==item.msg_type){
            // 车险提醒
            wx.navigateTo({
                url: `/pages/add-todo/add-todo`
            })
        }
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