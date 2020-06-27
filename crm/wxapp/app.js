//app.js
App({
    onLaunch: function () {
    },
    util: require('./utils/req'),
    _isNull(s) {
        if (s == '' || s == undefined || s == null) {
            return !0
        } else {
            return !1
        }
    },
    onChangeTabBar(index) {
        if (index == 0){
            wx.reLaunch({
                url: '/pages/index/index'
            })
        }else if (1==index){
            wx.reLaunch({
                url: '/pages/customer/customer'
            })
        }else if (2==index){
            wx.reLaunch({
                url: '/pages/info/info'
            })
        }else if (3==index){
            wx.reLaunch({
                url: '/pages/calendar/calendar'
            })
        }
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
    siteInfo: require('./siteinfo'),
    globalData: {
        userInfo: null
    }
})