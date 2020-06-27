const app = getApp()
import area from './province-list/area'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        roleArray: [],
        roleIndex: 0,
        // roleFlag: null
        roleFlag: null,
        showAddressVisible: !1,
        areaList: area,
        serviceAddressSelected: '',
        serviceName: '', // 收件点名称
        serviceAddress: '', // 收件点地址
        serviceNickname: '', // 收件点简称
        servicePhone: '', // 收件点电话
        wuliuName: '', // 物流员名字
        wuliuPhone: '', // 物流员手机号
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // // app.page.onLoad(this, options)
        // if (options.flag && options.flag==1){
        //     this.setData({
        //       roleFlag: false
        //     })
        // }else if (options.flag && options.flag==0){
        //   this.setData({
        //     roleFlag: true
        //   })
        // }
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.request({
            url: app.api.user.result,
            success: res => {
                if (null == res.data.verify) {
                    this.setData({
                        roleFlag: true
                    })
                    app.request({
                        url: app.api.part.role,
                        method: 'POST',
                        success: res2 => {
                            this.setData({
                                roleArray: res2.data
                            })
                            let tempRole = this.data.roleArray
                            let tmempRoleArray = []
                            tempRole.forEach(item => {
                                tmempRoleArray.push(item.name)
                            })
                            this.setData({
                                roleArrayTemp: tmempRoleArray
                            })
                        }
                    })

                } else if (2 == res.data.verify) {
                    this.setData({
                        roleFlag: false
                    })
                } else if (0 == res.data.verify) {
                    this.setData({
                        roleFlag: false
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },

    onChangeServiceName(e) {
        this.setData({
            serviceName: e.detail
        })
    },

    // onChangeServiceAddress(e) {
    //     this.setData({
    //         serviceAddress: e.detail
    //     })
    // },

    onChangeServiceNickname(e) {
        this.setData({
            serviceNickname: e.detail
        })
    },

    onChangeServicePhone(e) {
        this.setData({
            servicePhone: e.detail
        })
    },

    onChangeWuliuName(e) {
        this.setData({
            wuliuName: e.detail
        })
    },
    onChangeWuliuPhone(e) {
        this.setData({
            wuliuPhone: e.detail
        })
    },

    onClose() {
        this.setData({
            showAddressVisible: !1
        })
    },

    // 选择地址
    confirmAddress(e) {
        let addressList = e.detail.values
        let stringAdd = ''
        addressList.forEach(item => {
            stringAdd = stringAdd + item.name
        })
        this.setData({
            showAddressVisible: !1,
            serviceAddressSelected: stringAdd
        })
    },

    hideAddressModal() {
        this.setData({
            showAddressVisible: !1
        })
    },

    // 申请角色
    bindRoleChange(e) {
        this.setData({
            roleIndex: e.detail.value
        })
    },

    // 显示地址选择模态框
    showAddressModal() {
        // this.setData({
        //     showAddressVisible: !0
        // })
// serviceAddressSelected
        wx.chooseLocation({
            success:res=>{
                this.setData({
                    serviceAddressSelected:res.address
                })
            }
        })
    },

    // 立即申请按钮
    now_Apply() {
        /*   serviceAddressSelected: '',
            serviceName: '', // 收件点名称
            serviceAddress: '', // 收件点地址
            serviceNickname: '', // 收件点简称
            servicePhone: '', // 收件点电话
        */


        /**
         *   wuliuName: '', // 物流员名字
         wuliuPhone: '', // 物流员手机号
         */
        let roleName = this.data.roleArray[this.data.roleIndex]
        if (0 == this.data.roleIndex) { // 收件点
            const regexPhone = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
            if ('' == this.data.serviceAddressSelected || '' == this.data.serviceName || '' == this.data.serviceNickname || '' == this.data.servicePhone) {
                wx.showModal({
                    title: '提示',
                    content: '请认真填写信息',
                    confirmText: '我知道了',
                    showCancel: !1
                })
                return
            }
            if (!regexPhone.test(this.data.servicePhone)) {
                wx.showModal({
                    title: '提示',
                    content: '请输入正确的手机号',
                    confirmText: '我知道了',
                    showCancel: !1
                })

                return
            }

            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            app.request({
                url: app.api.user.apply,
                method: 'POST',
                data: {
                    part_id: roleName.id,
                    name: this.data.serviceName,
                    address: this.data.serviceAddressSelected,
                    shorter: this.data.serviceNickname,
                    contact_way: this.data.servicePhone
                },
                success: res => {
                    0 == res.code && wx.showToast({
                        title: '申请成功',
                        icon: 'none',
                        duration: 2500
                    })
                    this.onLoad()
                },
                complete: () => {
                    wx.hideLoading()
                }
            })

        } else if (1 == this.data.roleIndex) { // 物流员
            const regexPhone = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/
            if ('' == this.data.wuliuName || '' == this.data.wuliuPhone) {
                wx.showModal({
                    title: '提示',
                    content: '请认真填写信息',
                    confirmText: '我知道了',
                    showCancel: !1
                })
                return
            }

            if (!regexPhone.test(this.data.wuliuPhone)) {
                wx.showModal({
                    title: '提示',
                    content: '请输入正确的手机号',
                    confirmText: '我知道了',
                    showCancel: !1
                })
                return
            }
            wx.showLoading({
                title: '加载中',
                mask: !0
            })
            app.request({
                url: app.api.user.apply,
                method: 'POST',
                data: {
                    part_id: roleName.id,
                    name:this.data.wuliuName,
                    contact_way: this.data.wuliuPhone
                },
                success: res => {
                    0 == res.code && wx.showToast({
                        title: '申请成功',
                        icon: 'none',
                        duration: 2500
                    })
                    this.onLoad()
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
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
        app.page.onShow(this)
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