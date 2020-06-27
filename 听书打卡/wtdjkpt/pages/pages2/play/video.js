const app = getApp()
const WxParse = require("../../../wxParse/wxParse.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoSrc: '',
        leftModalVisible: !1,
        videoTitle: '',
        currentIdx: 0,
        time: app.countDownTime,
        currentArticleId: '', // 记录最新观看的章节ID
        clockFlag: !1,
        __wxapp_img: wx.getStorageSync('WXAPP_IMG'),
        pageType: 'STORE'
    },

    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },

    // 生成海报
    getGoodsQrcode: function() {
        var e = this;
        if (e.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), e.data.goods_qrcode) return !0;
        var o = "", t = e.data.pageType;
        if ("PINTUAN" === t) o = getApp().api.group.goods_qrcode; else if ("BOOK" === t) o = getApp().api.book.goods_qrcode; else if ("STORE" === t) o = getApp().api.default.goods_qrcode; else {
            if ("MIAOSHA" !== t) return void getApp().core.showModal({
                title: "提示",
                content: "pageType未定义或组件js未进行判断"
            });
            o = getApp().api.miaosha.goods_qrcode;
        }
        getApp().request({
            url: o,
            data: {
                goods_id: e.data.info.goods_id
            },
            success: function(o) {
                0 == o.code && e.setData({
                    goods_qrcode: o.data.pic_url
                }), 1 == o.code && (e.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: o.msg,
                    showCancel: !1,
                    success: function(o) {
                        o.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
        var e = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: e.data.goods_qrcode,
            success: function(o) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: o.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(o) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: o.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(o) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(o) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: o.errMsg + ";" + e.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(o) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function(o) {
        var e = o.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ e ]
        });
    },

    shareModalClose(){
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    // 选择当前章节
    checkCurrentLession(e) {
        const {item, index} = e.currentTarget.dataset
        if (0 == item.is_ok) return wx.showModal({
            title: '失败',
            content: '当前不可观看',
            showCancel: !1,
            confirmText: '我知道了',
        }),!1
        this.setData({
            currentIdx: index,
            videoSrc: item.content,
            videoTitle: item.title,
            currentArticleId: item.id,
            leftModalVisible: !1
        })
        WxParse.wxParse('article', 'html', item.content1, this, 5)
        this.setArtice()
    },
    showLeftModal() {
        this.setData({
            leftModalVisible: !0
        })
    },

    // 打卡
    goScore() {
        if (!this.data.clockFlag) return wx.showModal({
            title: '提示',
            content: '当前不可打卡, 请在倒计时结束后打卡',
            showCancel: !1,
        }), !1
        wx.navigateTo({
            url: `/pages/pages2/clock/clock?orderNo=${this.data.info.order_no}&id=${this.data.info.id}`
        })
    },

    onCloseLeftModal() {
        this.setData({
            leftModalVisible: !1
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (op) {
       app.page.onLoad(this, op);
        op.info && this.setData({info: JSON.parse(op.info)}), this.loadData(), this.loadCarurl()
    },

    // 加载课程目录
    loadCarurl() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.get_articles,
            data: {
                course_id: this.data.info.id,
                type: this.data.info.type
            },
            success: res => {
                const result = res.data
                this.setData({
                    videoList: result
                })
                // 如果当前观看的章节ID等于章节列表中的第一个,说明没有观看过
                if (this.data.info.artcles_id == result[0].id) {
                    this.setData({
                        videoSrc: res.data[0].content,
                        videoTitle: res.data[0].description,
                        currentArticleId: res.data[0].id
                    })
                    WxParse.wxParse('article', 'html', res.data[0].content1, this, 5)
                } else { // 看过
                    let newArr = result.filter((item) => {
                        return item.id == this.data.info.artcles_id
                    })
                    let currentArticle = null
                    let currentIndex = null
                    for (let i = 0; i < result.length; i++) {
                        if (result[i].id == this.data.info.artcles_id) {
                            currentArticle = result[i]
                            currentIndex = i
                            break
                        }
                    }
                    wx.showModal({
                        title: '提示',
                        content: `当前观看到《${newArr[0].title}》是否继续观看该章节?`,
                        success: res2 => {
                            if (res2.confirm) {
                                this.setData({
                                    videoSrc: newArr[0].content,
                                    videoTitle: newArr[0].description,
                                    currentArticleId: newArr[0].id,
                                    currentIdx: currentIndex
                                })
                                WxParse.wxParse('article', 'html',  newArr[0].content1, this, 5)
                            }else{
                                this.setData({
                                    videoSrc: result[0].content,
                                    videoTitle: result[0].description,
                                    currentArticleId: result[0].id,
                                    currentIdx: 0
                                })
                                WxParse.wxParse('article', 'html', result[0].content1, this, 5)
                            }
                        }
                    })
                }
                this.setArtice()
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    // 倒计时结束打卡
    finishedTime() {
        this.setData({
            clockFlag: !0
        })
        wx.showToast({
            title: '当前可以打卡了',
            icon: 'none'
        })
    },
    // 记录最近一次观看的章节
    setArtice() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.course.set_record,
            method: 'POST',
            data: {
                course_id: this.data.info.id,
                artcles_id: this.data.currentArticleId,
            },
            success: res => {

            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    // 加载课程数据
    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.get_mycourse,
            data: {
                course_id: this.data.info.id,
            },
            success: res => {
                wx.setNavigationBarTitle({
                    title: res.data.name
                })
                this.setData({
                    info: res.data
                })
            },
            complete: () => {
                wx.hideLoading()
            }
        })
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