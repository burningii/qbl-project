const InnerAudioContext = wx.createInnerAudioContext()
const InnerAudioContext2 = wx.createInnerAudioContext()
const webSocket = require('./lib/socket.js');
// const regeneratorRuntime = require('./lib/regenerator-runtime/runtime')
App({
    onLaunch: function () {
        let that = this;
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        // 获取手机系统信息
        wx.getSystemInfo({
            success: res => {
                let statusBarHeight = res.statusBarHeight,
                    navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
                    navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
                that.globalData.navHeight = navHeight;
                that.globalData.navTop = navTop;
                that.globalData.windowHeight = res.windowHeight;
            },
            fail(err) {
                console.log(err);
            }
        })
        // 获取系统信息
        wx.getSystemInfo({
            success: function (res) {
                // 获取可使用窗口宽度
                let clientHeight = res.windowHeight;
                // 获取可使用窗口高度
                let clientWidth = res.windowWidth;
                // 算出比例
                let ratio = 750 / clientWidth;
                // 算出高度(单位rpx)
                let height = clientHeight * ratio;
                // 宽度
                let width = clientWidth * ratio
                // 设置高度
                that.globalData.heigth = height
                that.globalData.width = width
            }
        })
        this.loadSounds()
        this.loadBackgroundMusic()
        this.initSocket2()
        // this.checkSocketClose()
    },
    // 服务器连接断开自动重连
    checkSocketClose() {
        this.globalData.socketTask.onClose((err) => {
            console.log('连接断开----', err);
        })
    },
    initSocket2(){
        // 创建连接
        webSocket.connectSocket();
        this.globalData.socketTask = webSocket
        // webSocket.onSocketMessageCallback = this.onSocketMessageCallback()
    },
    initSocket() {
        // 创建Socket
        wx.showLoading({
            title: '连接服务器中...',
            mask: !0
        }), this.globalData.socketTask = wx.connectSocket({
            url: 'wss://shijie.qibuluo.net:8888/api/',
            data: 'data',
            header: {
                'content-type': 'application/json'
            },
            method: 'post',
            success: function (res) {
                wx.hideLoading()
                console.log('WebSocket连接创建,开始监听返回数据', res)
            },
            fail: function (err) {
                wx.showToast({
                    title: '网络异常！',
                    icon: 'none'
                })
                console.log(err)
            },
            complete: msg => {
                console.log('---连接完成---', msg);
            }
        })
    },

    globalData: {
        userInfo: null,
        bgSoundSrc: '',
        socketTask: null
    },
    util: require('./utils/rquest'),
    // color: '#1989fa',
    color: '#ff9900',
    _is_null(s) {
        if ('' == s || undefined == s || null == s) {
            return !0
        } else {
            return !1
        }
    },
    /**
     * 处理背景音频和音效
     */
    loadSounds() {
        if (wx.getStorageSync('sound') == undefined || wx.getStorageSync('sound') == '') {
            wx.setStorageSync('sound', !0);
        }
    },
    /**
     * 播放背景音乐
     */
    loadBackgroundMusic() {
        if (this._is_null(wx.getStorageSync('backgroundMusic'))) {
            // this.util.request({
            //     url: 'getMusic'
            // }).then(res => {
            //     const bgmList = res.data.data
            //     let list = bgmList.map(item => {
            //         return {
            //             url: 'http://' + item.headimg,
            //             id: item.id,
            //             title: item.title,
            //             check: !1
            //         }
            //     })
            //     const backgroundMusicnew = {
            //         flag: !0,
            //         list
            //     }
            //     console.log('---背景零一二----', backgroundMusicnew);
            //     backgroundMusicnew.list[0].check = !0
            //     // InnerAudioContext2.src = backgroundMusicnew.list[0].url
            //     InnerAudioContext2.src = 'https://shijie.qibuluo.net/uploads/sound/bgm.mp3'
            //     InnerAudioContext2.loop = !0
            //     InnerAudioContext2.play()
            //     wx.setStorageSync('backgroundMusic', backgroundMusicnew);
            // })
            const list = [{
                url: 'https://shijie.qibuluo.net/uploads/sound/bgm.mp3'
            }]
            const backgroundMusicnew = {
                flag: !0,
                list
            }
            backgroundMusicnew.list[0].check = !0
            InnerAudioContext2.src = backgroundMusicnew.list[0].url
            InnerAudioContext2.loop = !0
            InnerAudioContext2.play()
            wx.setStorageSync('backgroundMusic', backgroundMusicnew);
        } else {
            const bgm = wx.getStorageSync('backgroundMusic')
            if (bgm.flag) {
                let checkUrl = bgm.list.filter(item => {
                    return item.check == !0
                })[0].url
                InnerAudioContext2.src = checkUrl
                InnerAudioContext2.loop = !0
                InnerAudioContext2.play()
            }
        }
    },
    /**
     * 获取背景音乐
     */
    getBgm() {
        return this.util.request({
            url: 'getMusic'
        })
    },
    playBgmNow() {
        const bgm = wx.getStorageSync('backgroundMusic')
        let currBgmUrl = bgm.list.filter(item => {
            return item.check == !0
        })[0].url
        InnerAudioContext2.src = currBgmUrl
        InnerAudioContext2.loop = !0
        InnerAudioContext2.play()
    },
    paruseBgmNow() {
        InnerAudioContext2.pause()
    },
    /**
     * 播放音效
     */
    playSound() {
        const soundSwitch = wx.getStorageSync('sound');
        if (!this._is_null(soundSwitch) && soundSwitch == !0) {
            // InnerAudioContext.src='https://api5.qibuluo.net/web/source/bullet.mp3'
            InnerAudioContext.src = this.globalData.bgSoundSrc
            InnerAudioContext.play()
        }
    },
})