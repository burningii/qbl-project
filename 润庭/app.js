const siteInfo = require('./siteinfo')
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
        let menuButtonObject = wx.getMenuButtonBoundingClientRect();
        // 获取手机系统信息
        wx.getSystemInfo({
            success: res => {
                let statusBarHeight = res.statusBarHeight,
                    navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
                    navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight)*2;//导航高度
                this.globalData.navHeight = navHeight;
                this.globalData.navTop = navTop;
                this.globalData.windowHeight = res.windowHeight;
            },
            fail(err) {
                console.log(err);
            }
        })
        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    myFormattime(e, flag = 1) {
        if (1 == flag) {
            const date = new Date(e * 1000)
            return date.getFullYear() + '-'
                + (date.getMonth() + 1) + "-"
                + date.getDate() + ' '
                + date.getHours() + ":"
                + date.getMinutes() + ":"
                + date.getSeconds()
        } else {
            const date = new Date(e)
            return date.getFullYear() + '-'
                + (date.getMonth() + 1) + "-"
                + date.getDate() + ' '
                + date.getHours() + ":"
                + date.getMinutes() + ":"
                + date.getSeconds()
        }
    },
    forMatCurrentTime(){
        const date = new Date()
        const year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        if (month>=1 && month<=9)  month = '0'+month
        if (day>=0&&day<=9) day = '0'+day
        return year+'-'+month+'-'+day
    },
    formatTimestap(e){
        const date = new Date(e)
        const year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        if (month>=1 && month<=9)  month = '0'+month
        if (day>=0&&day<=9) day = '0'+day
        return year+'-'+month+'-'+day
    },
    formatTimestapToSecond(e){
        const date = new Date(e)
        const year = date.getFullYear()
        let month = date.getMonth()+1
        let day = date.getDate()
        let hours = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
        if (month>=1 && month<=9)  month = '0'+month
        if (day>=0&&day<=9) day = '0'+day
        if (hours>=0&&hours<=9) hours = '0'+hours
        if (minutes>=0&&minutes<=9) minutes="0"+minutes
        if (seconds>=0&&seconds<=9)seconds = '0'+seconds
        return year+'-'+month+'-'+day+' '+hours+':'+minutes+":"+seconds
    },
    util: require('./utils/req'),
    globalData: {
        userInfo: null,
        navHeight: 0
    },
    _isNull(s){
        if (s=='' || s==undefined || s==null){
            return !0
        }else{
            return !1
        }
    },
    myFormattime(e, flag=1){
        if (1==flag){
            const date = new Date(e*1000)
            return date.getFullYear()+'-'
                + (date.getMonth()+1)+"-"
                + date.getDate()+' '
                + date.getHours()+":"
                + date.getMinutes()+":"
                + date.getSeconds()
        }else{
            const date = new Date(e)
            return date.getFullYear()+'-'
                + (date.getMonth()+1)+"-"
                + date.getDate()+' '
                + date.getHours()+":"
                + date.getMinutes()+":"
                + date.getSeconds()
        }
    },
    wxLoginApi: 'https://api.weixin.qq.com/sns/jscode2session',
    appid: 'wx27ab23190615e671',
    appsecect: 'b482397c4930fc027575087a08bb7d1c',
    token: '861C338E1D07D6F85BAF6FA5183EA50F',
    siteInfo: require('./siteinfo'),
    imgUrl2: siteInfo.imgUrl2
})