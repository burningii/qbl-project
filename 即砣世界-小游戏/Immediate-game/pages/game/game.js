const app = getApp()
let SocketTask = app.globalData.socketTask
Page({

    /**
     * 页面的初始数据
     */
    data: {
        menus: ['地图', '论坛', '设置', '关于'],
        colorList: [
            {
                color: '#ffffff',
                name: '白色'
            },
            {
                color: '#CA3142',
                name: '猩红'
            },
            {
                color: '#EA3891',
                name: '深粉色'
            },
            {
                color: '#EA33F7',
                name: '洋红'
            },
            {
                color: '#3432C4',
                name: '深兰花紫'
            },
            {
                color: '#19196B',
                name: '午夜的蓝色'
            },
            {
                color: '#00007B',
                name: '海军蓝'
            },
            {
                color: '#56BCF9',
                name: '深天蓝'
            },
            {
                color: '#EA3323',
                name: '纯红'
            },
            {
                color: '#A4312A',
                name: '耐火砖'
            },
            {
                color: '#808080',
                name: '灰色'
            },
            {
                color: '#000000',
                name: '纯黑'
            },
            {
                color: '#67CA4D',
                name: '酸橙绿'
            },
            {
                color: '#377E22',
                name: '纯绿'
            },
            {
                color: '#808026',
                name: '橄榄'
            },
            {
                color: '#FFFF54',
                name: '纯黄'
            },
            {
                color: '#F9D849',
                name: '金'
            },
            {
                color: '#F2A93B',
                name: '橙色'
            },
            {
                color: '#824920',
                name: '马鞍棕色'
            },
            {
                color: '#F2A481',
                name: '浅鲜肉色'
            },
            {
                color: '#EB5528',
                name: '橙红色'
            }
        ],
        currentColor: '#CA3142',
        activeIndex: 0,
        checkedOne: !0,
        checkedTwo: !0,
        color: app.color,
        currentColorText: '猩红',
        aboutText: '',
        geziList: [],
        loadingFlag: !0,
        bgmList: [],
        checkBgmItem: '0',

        pageWidth: 1000,
        pageHeight: 1000,

        allCountNum: 0,
        showLoadingFlag: !0,
        percentage: 90,

        areaWidth: 1000,
        areaHeight: 1000,

        x: 0,
        // x: -1467,
        y: 0,
        scaleF: 1,

        scaleRadio: -540,
        // scaleRadio: -1080,
        scaleYRadio: -260,
        // scaleYRadio: -520
        navH: app.globalData.navHeight,
        user_info: {},
        myGeziNums: 0,

        time: 0,
        navBarTitle: '即砳世界'
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
          title: '即砳世界'
        })
        SocketTask.onSocketMessageCallback = this.onWsMsg
        this.setData({
            user_info: wx.getStorageSync('user_info')
        })
        options.id && this.setData({roomId: options.id})
        options.name && this.setData({roomName: options.name})
        let {geziList} = this.data
        const arr1 = []
        for (let i = 0; i < 60; i++) {
            arr1.push({
                color: '#fff'
            })
        }
        for (let i = 0; i < 59; i++) {
            geziList.push(arr1)
        }
        this.loadBgmList()
        // this.setData({geziList, showLoadingFlag: !0})
        this.setData({geziList})
        const msg = ['getdata',{
            user_id: wx.getStorageSync('user_info').id,
            identifier: this.data.roomId
        }]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    loadBgmList() {
        if (wx.getStorageSync('backgroundMusic') != undefined) {
            const bgm = wx.getStorageSync('backgroundMusic')
            let currentRadio = '0'
            bgm.list.forEach((item, index) => {
                if (item.check) currentRadio = index
            })
            this.setData({
                bgmList: bgm.list,
                checkBgmItem: currentRadio
            })
        }
    },
    finishTime(){
        this.setData({
            time: 0
        })
    },
    // 返回上一页
    goLastPage(){
        let room = wx.getStorageSync('checkRoom')
        wx.reLaunch({
            url: `/pages/list/list?id=${room}`
        })
    },
    /**
     * 点击变换颜色并推动给服务器
     */
    onChangeColor(e) {
        const {findex, index} = e.currentTarget.dataset
        if (this.data.time!=0){
            return
        }
        this.setData({
            ['geziList[' + findex + '][' + index + '].color']: this.data.currentColor,
            loadingFlag: !1,
            time: 1000
        })
        const msg = ['seting',{
            zuobiaoX: findex,
            zuobiaoY: index,
            color: this.data.currentColor,
            user_id: wx.getStorageSync('user_info').id,
            identifier: this.data.roomId
        }]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    onCheckedOne(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            this.setData({checkedTwo: e.detail})
            const backgroundMusic = wx.getStorageSync('backgroundMusic')
            backgroundMusic.flag = e.detail
            if (e.detail) {
                app.playBgmNow()
            } else {
                app.paruseBgmNow()
            }
            wx.setStorageSync('backgroundMusic', backgroundMusic);
        } else if ('2' == f) {
            this.setData({checkedOne: e.detail}), wx.setStorageSync('sound', e.detail);
        }
    },
    onChangeMenus(e) {
        const {index} = e.currentTarget.dataset
        if (0 == index) app.globalData.bgSoundSrc = 'http://shijie.qibuluo.net/uploads/sound/map.mp3'
        if (2 == index) app.globalData.bgSoundSrc = 'http://shijie.qibuluo.net/uploads/sound/setting.mp3'
        // if (3 == index) app.globalData.bgSoundSrc = 'http://shijie.qibuluo.net/uploads/sound/setting.mp3'
        app.playSound()
        if ('1' == index) {
            this.setData({showLoadingFlag: !1})
            wx.navigateTo({
                url: '/pages/web-view/index'
            })
        }
        this.setData({
            activeIndex: index
        })
    },
    checkColor(e) {
        const {item} = e.currentTarget.dataset
        this.setData({
            currentColor: item.color,
            currentColorText: item.name
        })
    },
    /**
     * 加载关于我们
     */
    loadAbout() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.request({
            url: 'getConfig',
        }).then(res => {
            wx.hideLoading()
            const result = res.data
            if (0 == result.code) {
                this.setData({
                    aboutText: result.data
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
    setusercallback(){

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        const msg = ['getconfig',{}]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    // 展示进度条
    showMyLoading() {

    },
    /**
     * 监听服务器返回的消息
     */
    onWsMsg(message) {
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
    joincallback(){

    },
    setingzongcallback(){

    },
    configcallback(e){
        this.setData({
            aboutText: e.data
        })
    },
    setingcallback(e){
        this.setData({
            [`geziList[${e.zuobiaoX}][${e.zuobiaoY}].color`]: e.color
        })
        const msg = ['getcount',{
            user_id: wx.getStorageSync('user_info').id,
            identifier: this.data.roomId
        }]
        SocketTask.sendSocketMessage({
            msg: JSON.stringify(msg)
        })
    },
    getcountcallback(e){
        this.setData({
            myGeziNums: e.count
        })
    },
    // 获取房间初始数据
    getdatacallback(e){
        // if (this.data.loadingFlag == !0) {
        //
        // }
        const _this=this
        const result = e.data
        _this.setData({
            myGeziNums: e.count
        })
        let nums = result.length * 50
        setTimeout(()=>{
            for (let i = 0; i < result.length; i++) {
                if (typeof result[i] == "string") {
                    result[i] = JSON.parse(result[i])
                }
                result[i].zuobiaoX = Number(result[i].zuobiaoX)
                result[i].zuobiaoY = Number(result[i].zuobiaoY)
                if ((result[i].zuobiaoX <= 59 && result[i].zuobiaoX >= 0) && (result[i].zuobiaoY <= 59 && result[i].zuobiaoY >= 0)) {
                    _this.setData({
                        [`geziList[${result[i].zuobiaoX}][${result[i].zuobiaoY}].color`]: result[i].color
                    })
                }
            }
        }, 1000)
        setTimeout(() => {
            _this.setData({
                percentage: 100,
                showLoadingFlag: !1,
                loadingFlag: !1
            })
        }, nums)
    },
    /**
     * 拖动页面触发
     */
    onChangScale(e) {
        // console.log(e);
    },
    leavecallback(){

    },
    getroomscallback(){

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.loadSoundFlag()
        this.loadBgmFlag()
        this.setData({activeIndex: 0,})
    },
    /**
     * 检测音效是否开启
     */
    loadSoundFlag() {
        if (wx.getStorageSync('sound') != undefined) {
            this.setData({checkedOne: wx.getStorageSync('sound')})
        }
    },
    /**
     * 检测bgm
     */
    loadBgmFlag() {
        if (wx.getStorageSync('backgroundMusic') != undefined) {
            const bgm = wx.getStorageSync('backgroundMusic')
            this.setData({
                checkedTwo: bgm.flag,
            })
        }
    },
    onChange(event) {
        this.setData({
            checkBgmItem: event.detail
        });
    },
    onClick(event) {
        const {name} = event.currentTarget.dataset;
        const bgm = wx.getStorageSync('backgroundMusic')
        bgm.list.forEach(item => {
            item.check = !1
        })
        bgm.list[Number(name)].check = !0
        wx.setStorageSync('backgroundMusic', bgm);
        app.playBgmNow()
        this.setData({
            checkBgmItem: name
        });
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
        // SocketTask.close(function (close) {
        //     console.log('关闭 WebSocket 连接。', close)
        // })
        // this.sendMsg('leave',{
        //     identifier: this.data.roomId
        // })
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