const app = getApp()
const regexPhone = /^\d{11}$/
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '',
        code: '',
        pwd: '',
        pwd2: '',
        sendMsg: '发送验证码',
        sendMsgAbled: !1,
        verifyCode: '',
        radio: '-1',
        color: '#F86732'
    },
    onChange(event) {
        const _this=this
        this.setData({
            radio: '1'==_this.data.radio? '-1':'1'
        });
    },
    // 去协议内容
    goXieyiContent(e){
        const {f} = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/user/xieyi/xieyi?f=${f}`
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadXieYi()
    },

    // 加载协议
    loadXieYi(){
        app.util.req({
            url: 'get_protocol',
            method: 'POST',
            data: {
                token: app.token
            }
        }).then(res=>{
            const result = res.data
            this.setData({
                xieyi: result.data
            })
        })
    },

    // 发送验证码
    sendCode() {
        if (!regexPhone.test(this.data.phone)) return wx.showToast({
            title: '手机号不正确',
            icon: 'none'
        }), !1

        const _this=this
        let time=60
        let timer = setInterval(()=>{
            if (1==time){
                clearInterval(timer)
                _this.setData({
                    sendMsg: `发送验证码`,
                    sendMsgAbled: !1
                })
            }else{
                time--
                _this.setData({
                    sendMsg: `${time}s`,
                    sendMsgAbled: !0
                })
            }

        }, 1000)
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req2({
            url: 'SendVerifyCode',
            data: {
                mobile: this.data.phone
            }
        }).then(res => {
            wx.hideLoading()
            const result = res.data
            if (1 == result.errno) {
                this.setData({verifyCode: result.data.code})
                wx.showToast({
                    title: '发送成功',
                    icon: 'none',
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: result.message,
                    showCancel: !1,
                })
            }
        })
    },

    // 立即注册
    registerNow() {
        // 验证成功
        const str = this.verfiData()
        if ('' == str) {
            wx.showLoading({
                title:'加载中',
                mask: !0
            }),app.util.req2({
                url: 'regLocalUser',
                method: 'GET',
                data: {
                    loginName: this.data.phone,
                    password: this.data.pwd2
                }
            }).then(res=>{
                wx.hideLoading()
                console.log('注册：',res);
                const result = res.data
                if (1 == result.errno) {
                    wx.showModal({
                        title: '提示',
                        content: '注册成功',
                        showCancel: !1,
                        success: res2 => {
                            if (res2.confirm) {
                                wx.reLaunch({
                                    url:'/pages/index/index'
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: result.message,
                        showCancel: !1,
                    })
                }
            })
        } else {
            wx.showToast({
                title: str,
                icon: 'none'
            })
        }
    },

    // 校验信息
    verfiData() {
        if (!regexPhone.test(this.data.phone)) return '手机号格式不正确'
        if (''==this.data.code)return '验证码不能为空'
        if (this.data.verifyCode != this.data.code) return '验证码无效'
        // console.log('密码长度: ', this.data.pwd.length);
        if (''==this.data.pwd) return '新密码不能为空'
        if (this.data.pwd.length<8 || this.data.pwd.length>16) return '新密码长度是8至16位'
        if (this.data.pwd2=='') return '确认密码不能为空'
        if (this.data.pwd!=this.data.pwd2) return '新密码与确认密码不一致'
        if ('-1'==this.data.radio)return '请勾选协议'
        return ''
    },

    // 输入
    onChangeUser(e) {
        const {flag} = e.currentTarget.dataset
        if ('1' == flag) this.setData({phone: e.detail.replace(/\s*/g, "")})
        if ('2' == flag) this.setData({code: e.detail.replace(/\s*/g, "")})
        if ('3' == flag) this.setData({pwd: e.detail.replace(/\s*/g, "")})
        if ('4' == flag) this.setData({pwd2: e.detail.replace(/\s*/g, "")})
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