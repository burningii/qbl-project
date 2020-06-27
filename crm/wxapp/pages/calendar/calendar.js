const app = getApp()
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeTab: 3,
        showCalendar: !0,
        todoList: [],
        calendarConfig: {
            // 配置内置主题
            theme: 'elegant',
            showLunar: true,
            inverse: true,
            markToday: '今',
            highlightToday: true,
        }
    },
    onChangeTabBar(event) {
        app.onChangeTabBar(event.detail)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '日历管理'
        })
        this.init()
        this.loadHolday()
    },
    async init(){
        await this.loadHolday()
        this.initTodoList()
    },
    loadHolday(){
        return new Promise(resolve => {
            const user_id = wx.getStorageSync('user_info').id
            wx.showLoading({
                title:'加载中',
                mask: !0
            }),app.util.req({
                url: `calendarData/${user_id}`
            }).then(res=>{
                const result = res.data
                this.setData({
                    todoList: result.data
                })
                resolve()
            })
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const options = {
            lunar: true // 在配置showLunar为false, 但需返回农历信息时使用该选项
        }
        const selectedDay = this.calendar.getSelectedDay(options);
        console.log(selectedDay,'---返回信息---');
    },
    onTapDay(e){
        const date = `${e.detail.year}-${e.detail.month}-${e.detail.day}`
        const user_id=wx.getStorageSync('user_info').id
        wx.showLoading({
            title:'加载中',
            mask: !0
        }),app.util.req({
            url: `getDayData/${user_id}/${date}`
        }).then(res=>{
            const result = res.data
            if (result.data.holiday){
                const arr = [
                    {
                        year: e.detail.year,
                        month: e.detail.month,
                        day: e.detail.day,
                        todoText: result.data.holiday,
                    }
                ]
                this._setTodoLabels(arr)
            }
        })
    },
    /**
     * 设置待办事项
     * @private
     */
    _setTodoLabels(arr){
        /**
         *   year: 2020,
             month: 6,
             day: 11,
             todoText: '拜访你妈发的发送到发送到发',
         */
        this.calendar.setTodoLabels({
            // 待办点标记设置
            pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
            dotColor: 'purple', // 待办点标记颜色
            circle: false, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
            showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
            days: arr
        });
    },
    initTodoList(){
        const {todoList} = this.data
        todoList.forEach(item=>{
            item.color = '#f40'
        })
        this._setTodoLabels(todoList)
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