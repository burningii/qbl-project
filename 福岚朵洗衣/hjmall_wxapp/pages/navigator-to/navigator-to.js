const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        party_id: '',
        orderList: [],
        orderOldList: null,
        orderOldListFlag: undefined
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        options.party_id && this.setData({
            party_id: options.party_id
        })
        options.part_id && this.setData({
            part_id: options.part_id
        })
        this.loadData(this.data.part_id)
    },

    // 加载数据
    loadData(part_id) {
        if (1 == part_id) {
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.request({
                url: app.api.logist.logistics,
                method: 'POST',
                data: {
                    party_id: this.data.party_id
                },
                success: res => {
                    // code=1 不是物流员
                    // code=2 不是指定的物流员
                    if (0 == res.code) {
                        this.setData({
                            orderList: res.data
                        })
                    } else if (1 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    } else if (2 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '抱歉,系统出错',
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        } else if (2 == part_id) {
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.request({
                url: app.api.logist.cuation,
                method: 'POST',
                data: {
                    party_id: this.data.party_id
                },
                success: res => {
                    if (0 == res.code) {
                        this.setData({
                            orderList: res.data,
                            orderOldList: function (){
                                if (null!=res.dat){
                                    return res.dat
                                }else{
                                    return null
                                }
                            }(),
                            orderOldListFlag: function () {
                                if (null!=res.dat && res.dat.length>0){
                                    return !0
                                }else{
                                    return undefined
                                }
                            }()
                        })
                    } else if (1 == res.code) {
                        wx.showModal({
                            title: '提示',
                            content: res.msg,
                            showCancel: !1,
                            success: res => {
                                res.confirm && wx.reLaunch({
                                    url: '/pages/index/index'
                                })
                            }
                        })
                    } else if (2 == res.code) { wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                        success: res => {
                            res.confirm && wx.reLaunch({
                                url: '/pages/index/index'
                            })
                        }
                    })

                    }
                },
                complete: () => {
                    wx.hideLoading()
                }
            })
        }


    },

    // 点数确认按钮
    checkAllOrder() {
        if (null==this.data.orderOldList){
            let allOrderList = this.data.orderList
            let tempArrayOrder = []
            allOrderList.forEach(item => {
                tempArrayOrder.push(item.id)
            })
            wx.showModal({
                title: '提示',
                content: `检测到共有${this.data.orderList.length}条条目信息,请确认`,
                success: res => {
                    res.confirm && (wx.showLoading({
                        title: '加载中',
                        mask: !0
                    }),1==this.data.part_id?( app.request({
                        url: app.api.logist.queen,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
                        },
                        success: res => {
                            0 == res.code ? wx.showModal({
                                title: '成功',
                                content: '操作成功',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            }) : wx.showModal({
                                title: '异常',
                                content: '系统异常',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })):2==this.data.part_id?( app.request({
                        url: app.api.logist.cuten,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
                        },
                        success: res => {
                            0 == res.code ? wx.showModal({
                                title: '成功',
                                content: '操作成功',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            }) : 1==res.code?(wx.showModal({
                                title: '提示',
                                content: res.msg,
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })):''
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })):'')
                }
            })
        }else if (null!=this.data.orderOldList.length && this.data.orderOldList.length>0){
            let allOrderList = this.data.orderOldList
            let tempArrayOrder = []
            allOrderList.forEach(item => {
                tempArrayOrder.push(item.id)
            })
            wx.showModal({
                title: '提示',
                content: `检测到共有${allOrderList.length}条条目信息,请确认`,
                success: res => {
                    res.confirm && (wx.showLoading({
                        title: '加载中',
                        mask: !0
                    }),1==this.data.part_id?( app.request({
                        url: app.api.logist.queen,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
                        },
                        success: res => {
                            0 == res.code ? wx.showModal({
                                title: '成功',
                                content: '操作成功',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            }) : wx.showModal({
                                title: '异常',
                                content: '系统异常',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })):2==this.data.part_id?( app.request({
                        url: app.api.logist.cuten,
                        method: 'POST',
                        data: {
                            order_id: JSON.stringify(tempArrayOrder)
                        },
                        success: res => {
                            0 == res.code ? wx.showModal({
                                title: '成功',
                                content: '操作成功',
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            }) : 1==res.code?(wx.showModal({
                                title: '提示',
                                content: res.msg,
                                showCancel: !1,
                                success: res => {
                                    res.confirm && wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                }
                            })):''
                        },
                        complete: () => {
                            wx.hideLoading()
                        }
                    })):'')
                }
            })
        }else{
            wx.showModal({
              title: '提示',
              content: '暂时没有要提交的订单',
                showCancel: !1
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