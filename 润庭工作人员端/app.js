//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

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
    util: require('./utils/req'),
    globalData: {
        userInfo: null
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
    url: 'https://api5.qibuluo.net/app/index.php/',
    token: '861C338E1D07D6F85BAF6FA5183EA50F',
})