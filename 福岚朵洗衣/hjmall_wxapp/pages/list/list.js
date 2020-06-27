var is_loading_more = !1, is_no_more = !1, app=getApp();

Page({
    data: {
        cat_id: "",
        page: 1,
        cat_list: [],
        goods_list: [],
        sort: 0,
        sort_type: -1,
        quick_icon: !0,
        activeGoodsIndex: null,
        activeGoodsItem: null
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t)
        let mch_id = wx.getStorageSync('USER_INFO').mch_id;
        wx.showLoading({
            title:'加载中',
            mask: !0
        })
        app.request({
            url:app.api.mch.shop_cat,
            data: {
                mch_id: mch_id
            },
            success: res=>{
                app.core.setStorageSync(app.const.CAT_LIST, res.data.list);
                this.loadData(t);
            },
            complete: ()=>{
                wx.hideLoading()
            }
        })
        if (t.index){
            this.setData({
                defaultIndex: t.index
            })
        }
    },
    loadData: function(t) {
        var a = getApp().core.getStorageSync(getApp().const.CAT_LIST), e = "";
        if (t.cat_id) for (var i in a) {
            var o = !1;
            for (var s in a[i].id == t.cat_id && (a[i].checked = !0, 0 < a[i].list.length && (e = "height-bar")), 
            a[i].list) a[i].list[s].id == t.cat_id && (o = a[i].list[s].checked = !0, e = "height-bar");
            o && (a[i].checked = !0);
        }
        if (t.goods_id) var r = t.goods_id;
        this.setData({
            cat_list: a,
            cat_id: t.cat_id || "",
            height_bar: e,
            goods_id: r || ""
        }), this.reloadGoodsList();
    },
    // 选定商品
    checkGoods(e){
        let currentItem = e.currentTarget.dataset.item
        let currentIndex = e.currentTarget.dataset.index
        this.setData({
            activeGoodsIndex: currentIndex,
            activeGoodsItem: currentItem
        })
    },
    // 点击确定按钮返回上一页
    sureGoodsBtn(){
        if (null==this.data.activeGoodsItem || Object.keys(this.data.activeGoodsItem).length==0){
            wx.showModal({
              title: '提示',
              content: '请选择商品',
                showCancel: false
            })
            return
        }

        // 将参数传回上一页
        const pages = getCurrentPages()
        const prevPage = pages[pages.length-2] // 上一页
        let activeItem = this.data.activeGoodsItem
        let activeGoodsIndex = this.data.defaultIndex
           prevPage.setData({
               currentPageCheckItem: activeItem,
               currentPageCheckIndex: activeGoodsIndex
           })
        wx.navigateBack()
    },
    catClick: function(t) {
        this.setData({
            activeGoodsIndex: null,
            activeGoodsItem: {}
        })
        var a = this, e = "", i = t.currentTarget.dataset.index, o = a.data.cat_list;
        for (var s in o) {
            for (var r in o[s].list) o[s].list[r].checked = !1;
            s == i ? (o[s].checked = !0, e = o[s].id) : o[s].checked = !1;
        }
        var d = "";
        0 < o[i].list.length && (d = "height-bar"), a.setData({
            cat_list: o,
            cat_id: e,
            height_bar: d
        }), a.reloadGoodsList();
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    subCatClick: function(t) {

        this.setData({
            activeGoodsIndex: null,
            activeGoodsItem: {}
        })
        var a = this, e = "", i = t.currentTarget.dataset.index, o = t.currentTarget.dataset.parentIndex, s = a.data.cat_list;
        for (var r in s) for (var d in s[r].list) r == o && d == i ? (s[r].list[d].checked = !0, 
        e = s[r].list[d].id) : s[r].list[d].checked = !1;
        a.setData({
            cat_list: s,
            cat_id: e
        }), a.reloadGoodsList();
    },
    allClick: function() {
        this.setData({
            activeGoodsIndex: null,
            activeGoodsItem: {}
        })
        var t = this, a = t.data.cat_list;
        for (var e in a) {
            for (var i in a[e].list) a[e].list[i].checked = !1;
            a[e].checked = !1;
        }
        t.setData({
            cat_list: a,
            cat_id: "",
            height_bar: ""
        }), t.reloadGoodsList();
    },
    reloadGoodsList: function() {
        var a = this;
        is_no_more = !1, a.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1
        });
        // var t = a.data.cat_id || "", e = a.data.page || 1;
        var t = wx.getStorageSync('USER_INFO').mch_id || "", e = a.data.page || 1,cart_id=a.data.cat_id || '';
        // getApp().request({
        //     url: getApp().api.default.goods_list,
        //     data: {
        //         cat_id: t,
        //         page: e,
        //         sort: a.data.sort,
        //         sort_type: a.data.sort_type,
        //         goods_id: a.data.goods_id
        //     },
        //     success: function(t) {
        //         0 == t.code && (0 == t.data.list.length && (is_no_more = !0), a.setData({
        //             page: e + 1
        //         }), a.setData({
        //             goods_list: t.data.list
        //         })), a.setData({
        //             show_no_data_tip: 0 == a.data.goods_list.length
        //         });
        //     },
        //     complete: function() {}
        // });
        wx.showLoading({
            title:'加载中',
            mask: !0
        })
        getApp().request({
            url: getApp().api.mch.shop,
            data: {
                mch_id: t,
                page: e,
                tab: 2,
                cat_id: cart_id,
                sort: a.data.sort,
                sort_type: a.data.sort_type,
                goods_id: a.data.goods_id
            },
            success: function(t) {
                0 == t.code && (0 == t.data.goods_list.length && (is_no_more = !0), a.setData({
                    page: e + 1
                }), a.setData({
                    // goods_list: t.data.list
                    goods_list: t.data.goods_list
                })), a.setData({
                    show_no_data_tip: 0 == a.data.goods_list.length
                });
            },
            complete: function() {
                wx.hideLoading()
            }
        });
    },
    loadMoreGoodsList: function() {
        var e = this;
        if (!is_loading_more) {
            e.setData({
                show_loading_bar: !0
            }), is_loading_more = !0;
            var t = e.data.cat_id || "", i = e.data.page || 2, a = e.data.goods_id,mch_id = wx.getStorageSync('USER_INFO').mch_id || "";
            app.request({
                url: app.api.mch.shop,
                data: {
                    mch_id: mch_id,
                    page: i,
                    tab: 2,
                    cat_id: t,
                    sort: e.data.sort,
                    sort_type: e.data.sort_type,
                    goods_id: e.data.goods_id
                },
                success: function(t) {
                    0 == t.data.goods_list.length && (is_no_more = !0);
                    var a = e.data.goods_list.concat(t.data.goods_list);
                    e.setData({
                        goods_list: a,
                        page: i + 1
                    });
                },
                complete: function() {
                    is_loading_more = !1, e.setData({
                        show_loading_bar: !1
                    });
                }
            });
            // getApp().request({
            //     url: getApp().api.default.goods_list,
            //     data: {
            //         page: i,
            //         cat_id: t,
            //         sort: e.data.sort,
            //         sort_type: e.data.sort_type,
            //         goods_id: a
            //     },
            //     success: function(t) {
            //         0 == t.data.list.length && (is_no_more = !0);
            //         var a = e.data.goods_list.concat(t.data.list);
            //         e.setData({
            //             goods_list: a,
            //             page: i + 1
            //         });
            //     },
            //     complete: function() {
            //         is_loading_more = !1, e.setData({
            //             show_loading_bar: !1
            //         });
            //     }
            // });
        }
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this), is_no_more || this.loadMoreGoodsList();
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var a = this;
        if (getApp().core.getStorageSync(getApp().const.LIST_PAGE_RELOAD)) {
            var e = getApp().core.getStorageSync(getApp().const.LIST_PAGE_OPTIONS);
            getApp().core.removeStorageSync(getApp().const.LIST_PAGE_OPTIONS), getApp().core.removeStorageSync(getApp().const.LIST_PAGE_RELOAD);
            var i = e.cat_id || "";
            a.setData({
                cat_id: i
            });
            var o = a.data.cat_list;
            for (var s in o) {
                var r = !1;
                for (var d in o[s].list) o[s].list[d].id == i ? r = o[s].list[d].checked = !0 : o[s].list[d].checked = !1;
                r || i == o[s].id ? (o[s].checked = !0, o[s].list && 0 < o[s].list.length && a.setData({
                    height_bar: "height-bar"
                })) : o[s].checked = !1;
            }
            a.setData({
                cat_list: o
            }), a.reloadGoodsList();
        }
    },
    sortClick: function(t) {
        var a = this, e = t.currentTarget.dataset.sort, i = null == t.currentTarget.dataset.default_sort_type ? -1 : t.currentTarget.dataset.default_sort_type, o = a.data.sort_type;
        if (a.data.sort == e) {
            if (-1 == i) return;
            o = -1 == a.data.sort_type ? i : 0 == o ? 1 : 0;
        } else o = i;
        a.setData({
            sort: e,
            sort_type: o
        }), a.reloadGoodsList();
    },
    onShareAppMessage: function(t) {
        return getApp().page.onShareAppMessage(this), {
            path: "/pages/list/list?user_id=" + getApp().getUser().id + "&cat_id=" + this.data.cat_id,
            success: function(t) {}
        };
    }
});