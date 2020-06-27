const app = getApp()
let SocketTask = app.globalData.socketTask
Page({

    /**
     * 页面的初始数据
     */
    data: {
        roomList: [],
        route: 'pages/center/center'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '所有板块'
        })
        SocketTask.onSocketMessageCallback = this.onWsMsg
    },
    onWsMsg(message){
        const _this=this
        let newStr = ''
        let idx1 = message.indexOf('[')
        let idx2 = message.indexOf('sid')
        if (idx1 != -1 && idx2 == -1) newStr = message.substr(message.indexOf('['), message.length)
        if (newStr.indexOf('[') != -1) {
            console.log(JSON.parse(newStr), '----解析数据----');
            let dataNew = JSON.parse(newStr)
            if ('connectcallback' != dataNew[0]) {
                _this[`${dataNew[0]}`](dataNew[1])
            }
        }
    },
    // 去具体列表页面
    goRoom(e) {
        const {id, name} = e.currentTarget.dataset
        this.data.currentId = id
        this.data.currentName = name
        wx.setStorageSync('checkRoom', id);
        // this.sendMsg('join', {identifier: id + ''})
        wx.navigateTo({
            url: `/pages/list/list?id=${id}`
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const msg = ['setuser',{
            user_id: wx.getStorageSync('user_info').id
        }]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    getroomscallback(e) {
        console.log('获取房间回调---', e);
        this.setData({
            roomList: e.data
        })
    },
    leavecallback() {

    },
    setusercallback(e) {
        let user_info = wx.getStorageSync('user_info')
        user_info.old_fd = e.old_fd
        wx.setStorageSync('user_info', user_info);
    },
    setingzongcallback() {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // const _this = this
        // _this.sendMsg('getrooms', {})
        const msg = ['getrooms',{}]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
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