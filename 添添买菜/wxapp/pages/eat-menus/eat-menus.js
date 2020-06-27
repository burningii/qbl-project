const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active: 0,
        menus: [],
        menusList: [], // 菜谱列表
        type: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.page.onLoad(this, options);
        wx.setNavigationBarTitle({
            title: '今天吃啥'
        })
        this.loadAllFoodsList()
        this.loadZuantiList()
    },
    goZuanti(e) {
        const {id, name} = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/zuanti/index?id=${id}&name=${name}`
        })
    },
    /**
     * 获取顶部专题列表
     */
    loadZuantiList() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.talk_list,
            success: res => {
                if (0 == res.code) {
                    this.setData({
                        zuantiArr: res.data
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    // 获取所有食谱分类以及食谱
    loadAllFoodsList() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.get_foods_list,
            data: {
                type: this.data.type
            },
            success: res => {
                if (0 == res.code) {
                    res.data.food_cat.unshift({
                        id: 0,
                        name: '推荐'
                    })
                    this.setData({
                        foodsCategory: res.data.food_cat,
                        foodsList: res.data.food_list
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                    })
                }
            },
            complete: () => {
                wx.hideLoading()
            }
        })
    },
    onChangeMenus(e) {
        wx.pageScrollTo({
            scrollTop: 150,
            selector: '.menus-cookie'
        })
        this.setData({
            type: this.data.foodsCategory[e.detail.index].id
        })
        this.loadAllFoodsList()
    },
    // 去所有菜谱分类
    goAllMenus() {
        wx.navigateTo({
            url: '/pages/eat-category/eat-category'
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        app.page.onReady(this);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        app.page.onShow(this)
        // let query = wx.createSelectorQuery().in(this);
        // let heightArr = [];
        // query.selectAll('.scroll-cookie').boundingClientRect((react) => {
        //     react.forEach((res) => {
        //         heightArr.push(res.top)
        //     })
        //     this.setData({
        //         cookieArrTop: heightArr
        //     });
        // }).exec();
    },

    /**
     * 去搜索
     */
    goSearch() {
        wx.navigateTo({
            url: '/pages/search-menus/search-menus'
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        app.page.onHide(this)
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        app.page.onUnload(this)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        app.page.onPullDownRefresh(this);
    },

    // 去食谱页面
    goInfo(e) {
        wx.navigateTo({
            url: `/pages/food/food?id=${e.currentTarget.dataset.id}&name=${e.currentTarget.dataset.name}`
        })
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
        app.page.onShareAppMessage(this);
    }
})