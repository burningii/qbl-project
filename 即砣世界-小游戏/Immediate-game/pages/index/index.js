const app = getApp()
const InnerAudioContext = wx.createInnerAudioContext()
let SocketTask = app.globalData.socketTask
Page({
    /**
     * 页面的初始数据
     */
    data: {
        arr: [],
        classFlag: !1,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '即砳世界'
        })
        SocketTask.onSocketMessageCallback = this.onWsMsg
    },
    onWsMsg(message){
        const _this=this
        console.log('这是我的回调---',message);
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
    startTouch() {
        this.setData({
            classFlag: !0
        })
    },
    /**
     * 播放背景音频
     */
    playSound(){
        app.globalData.bgSoundSrc = 'http://shijie.qibuluo.net/uploads/sound/start-game.mp3'
        app.playSound()
    },
    endTouch() {
        this.setData({
            classFlag: !1
        })
    },
    setingzongcallback(){

    },
    // 获取用户信息
    getUserInfo(e) {
        if (1==app.globalData.pageFlagData){
            wx.reLaunch({
                url: '/pages/view/index'
            })
            return
        }
        'getUserInfo:ok' == e.detail.errMsg ? this.next() : wx.showModal({
            title: '失败',
            content: '您拒绝了授权,将无法进行游戏',
            showCancel: !1,
        })
    },
    sendMsg(title, msg) {
        SocketTask.send({
            data: JSON.stringify([title, msg]),
            success: res => {
                console.log('--发送成功----', res);
            },
            fail: err => {
                console.log('---发送失败----', err);
                wx.showToast({
                    title: '服务器连接失败,请重新刷新小程序',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    next() {
        const c = this
        wx.showLoading({
            title: '登录中...',
            mask: !0
        })
        wx.login({
            success: function (t) {
                var e = t.code;
                wx.getSetting({
                    success: function (t) {
                        t.authSetting["scope.userInfo"] ? wx.getUserInfo({
                            success: function (t) {
                                const a = t.userInfo.nickName, n = t.userInfo.avatarUrl, g = t.userInfo.gender
                                const msg = ['getmember',{
                                    code: e,
                                    username: a,
                                    sex: g,
                                    headimg: n,
                                }]
                                SocketTask.sendSocketMessage({
                                    msg: JSON.stringify(msg)
                                })
                                // c.sendMsg('getmember',{
                                //     code: e,
                                //     username: a,
                                //     sex: g,
                                //     headimg: n,
                                // })
                            }
                        }) : (console.log("未授权过"), c.setData({
                            hydl: !0
                        }));
                    }
                });
            }, complete: () => {
                wx.hideLoading()
            }
        })
    },
    getcountcallback(){

    },
    connectcallback2(e){
        app.globalData.pageFlagData = e
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    getroomscallback(){

    },
    joincallback(){

    },
    getdatacallback(){

    },
    configcallback(){

    },
    setusercallback(){

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        const _this=this
    },
    setingcallback(){

    },
    membercallback(e){
        const result = e.data
        wx.setStorageSync('user_info', result);
        wx.reLaunch({
            url:'/pages/center/center'
        })
        console.log(result,'----登录结果----');
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