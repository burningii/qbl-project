const app = getApp()
let SocketTask = app.globalData.socketTask
Page({
    /**
     * 页面的初始数据
     */
    data: {
        navH: app.globalData.navHeight,
        navBarTitle: '即砳世界'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.id && this.setData({id: options.id})
        SocketTask.onSocketMessageCallback = this.onWsMsg
    },
    goLastPage(){
        wx.reLaunch({
            url: '/pages/center/center'
        })
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
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const msg = ['getroomsziji',{
            zimu: this.data.id
        }]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    getroomszijicallback(e) {
        this.setData({
            roomList: e.data
        })
    },
    goRoom(e) {
        const {id, name} = e.currentTarget.dataset
        this.data.currentId = id
        this.data.currentName = name
        const msg = ['join',{
            identifier: id + ''
        }]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    // 点击加入房间回调
    joincallback(e) {
        console.log('---点击房间回调---', e);
        if (0 == e.code) {
            wx.reLaunch({
                url: `/pages/game/game?id=${this.data.currentId}&name=${this.data.currentName}`
            })
            return
        } else {
            wx.showModal({
                title: '提示',
                content: e.msg,
                showCancel: !1,
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