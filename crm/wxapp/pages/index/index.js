const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeTab: 0,
        todoList: [], // 事项列表
        option1: [
            { text: '所有类型', value: 0 },
            { text: '微信', value: 1 },
            { text: '电话', value: 2 },
            { text: '面谈', value: 3 },
            { text: '短信', value: 4 },
        ],
        option2: [
            { text: '所有链接', value: 0 },
            { text: '活动', value: 1 },
            { text: '礼物', value: 2 },
        ],
        value1: 0,
        value2: 0,
        type: '',
        link_mode: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    // 改变菜单
    onChangeMenu(e){
        this.setData({
            type:　this.data.option1[e.detail].value
        })
        this.loadData()
    },
    onChangeMenu2(e){
        this.setData({
            link_mode:this.data.option2[e.detail].value
        })
        this.loadData()
    },
    /**
     * 加载拜访列表
     */
    loadData(){
        wx.showLoading({
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: 'getVisitList',
            data: {
                type: this.data.type,
                link_mode: this.data.link_mode
            }
        }).then(res=>{
            const result = res.data
            this.setData({
                todoList: result.data
            })
        })
    },
    // 去拜访详情
    goTodoInfo(e){
        const {id} = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/add-todo/add-todo?id=${id}`
        })
    },
    /**
     * 增加条目
     */
    addItem(){
        wx.navigateTo({
          url: '/pages/add-todo/add-todo'
        })
    },
    onChangeTabBar(event) {
        app.onChangeTabBar(event.detail)
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
        this.loadData()
        if (!wx.getStorageSync('user_info')){
            wx.reLaunch({
                url: '/pages/login/login'
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