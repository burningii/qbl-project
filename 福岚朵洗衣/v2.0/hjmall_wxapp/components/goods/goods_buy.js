const app = getApp()
module.exports = {
    currentPage: null,
    init: function (t) {
        var a = this;
        void 0 === (a.currentPage = t).favoriteAdd && (t.favoriteAdd = function (t) {
            a.favoriteAdd(t);
        }), void 0 === t.favoriteRemove && (t.favoriteRemove = function (t) {
            a.favoriteRemove(t);
        }), void 0 === t.kfMessage && (t.kfMessage = function (t) {
            a.kfMessage(t);
        }), void 0 === t.callPhone && (t.callPhone = function (t) {
            a.callPhone(t);
        }), void 0 === t.addCart && (t.addCart = function (t) {
            a.addCart(t);
        }), void 0 === t.buyNow && (t.buyNow = function (t) {
            a.buyNow(t);
        }), void 0 === t.onConfirmShape && (t.onConfirmShape = function (t) {
            a.onConfirmShape(t);
        }), void 0 === t.goHome && (t.goHome = function (t) {
            a.goHome(t);
        });
    },
    favoriteAdd: function () {
        var e = this.currentPage;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: e.data.goods.id
            },
            success: function (t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    a.is_favorite = 1, e.setData({
                        goods: a
                    });
                }
            }
        });
    },
    favoriteRemove: function () {
        var e = this.currentPage;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: e.data.goods.id
            },
            success: function (t) {
                if (0 == t.code) {
                    var a = e.data.goods;
                    a.is_favorite = 0, e.setData({
                        goods: a
                    });
                }
            }
        });
    },
    kfMessage: function () {
        getApp().core.getStorageSync(getApp().const.STORE).show_customer_service || getApp().core.showToast({
            title: "未启用客服功能"
        });
    },
    callPhone: function (t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    addCart: function () {
        this.currentPage.data.btn && this.submit("ADD_CART");
    },
    buyNow: function () {
        this.currentPage.data.btn && this.submit("BUY_NOW");
    },
    submit: function (t) {
        var a = this.currentPage;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.miaosha_data && 0 < a.data.miaosha_data.rest_num && a.data.form.number > a.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var e = a.data.attr_group_list, o = [], lists = a.data.attr_group_lists;
        for (var r in e) {
            var i = !1;
            for (var s in e[r].attr_list) if (e[r].attr_list[s].checked) {
                i = {
                    attr_id: e[r].attr_list[s].attr_id,
                    attr_name: e[r].attr_list[s].attr_name
                };
                break;
            }
            if (!i) return getApp().core.showToast({
                title: "请选择" + e[r].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[r].attr_group_id,
                attr_id: i.attr_id
            });
        }

        /**
         * getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.goods.id,
                attr: JSON.stringify(o),
                num: a.data.form.number
            },
            success: function(t) {
                getApp().core.hideLoading(), getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), a.setData({
                    show_attr_picker: !1
                });
            }
        })
         */


        /**
         * getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        })
         */

        function loadLists() {
            let shapeList = []
            for (let i in lists) {
                let data = []
                for (let j in lists[i].attr_lists) {
                    if (lists[i].attr_lists[j].checked) {
                        data.push({
                            attr_id: lists[i].attr_lists[j].attr_id,
                            attr_name: lists[i].attr_lists[j].attr_names
                        })
                    }
                }
                let data2 = []
                console.log('我是data', data);
                data.length > 0 && data.forEach(item => {
                    data2.push(item.attr_id)
                    shapeList.push({
                        id: item.attr_id,
                        value: item.value || '',
                        label: item.attr_name
                    })
                })
                if (data.length > 0) {
                    o.push({
                        attr_group_id: lists[i].attr_group_id,
                        attr_id: data2
                    })
                }
            }
            // 显示模态框配件输入条形码
            if (shapeList.length > 0) { // 有配件值进行输入条形码操作
                a.setData({
                    showShapeVisible: !0,
                    shapeList: shapeList,
                    zbAttrIdList: o
                })
            } else if (0 == shapeList.length) {
                backPage()
            }

            function backPage() {
                console.log('数据位:', o);
                console.log('我是良好', shapeList);
                const pages = getCurrentPages()
                const currPage = pages[pages.length - 3]  // 当前页
                let goods = a.data.goods
                let activeIndex = a.data.defaultIndex
                currPage.setData({
                    currentPageCheckItem: goods,
                    currentAttrList: o,
                    currentPageCheckIndex: activeIndex,
                    currentPageAddShape: undefined
                })
                console.log('接单也');
                console.log(currPage);
                // let checkGoodsInfo = {
                //     currentPageCheckItem: goods,
                //     currentAttrList: o,
                //     currentPageCheckIndex: activeIndex
                // }
                wx.navigateBack({
                    delta: 2
                })
            }

            // wx.setStorageSync('checkGoodsInfo', checkGoodsInfo);
            // console.log(currPage);
            // console.log(a.data.goods);
            // wx.redirectTo({
            //   url: `/pages/service-jiedan/service-jiedan?goodsData=${JSON.stringify(checkGoodsInfo)}`
            // })
        }

        if ("ADD_CART" == t && (loadLists()), "BUY_NOW" == t) {
            a.setData({
                show_attr_picker: !1
            });
            var d = [];
            d.push({
                goods_id: a.data.id,
                num: a.data.form.number,
                attr: o
            });
            var n = a.data.goods, g = 0;
            null != n.mch && (g = n.mch.id);
            var u = [];
            u.push({
                mch_id: g,
                goods_list: d
            }), getApp().core.redirectTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(u)
            });
        }
    },
    // 扫描条形码确定
    onConfirmShape() {
        const _this = this.currentPage
        const {shapeList} = _this.data
        const {zbAttrIdList} = _this.data // 获取要传入的属性数组id值 o
        let shapeArr = []
        // let flag=!1
        // console.log(shapeList);
        for (let item of shapeList) {
            if ('' === item.value) {
                wx.showToast({
                    title: '请填写条形码',
                    duration: 2500,
                    icon: 'none'
                }), _this.setData({
                    showShapeVisible: !0
                })
                return !1
            } else {
                if (Number(item.value) < Number(_this.data.shapeStart) || Number(item.value) > Number(_this.data.shapeEnd)) {
                    wx.showToast({
                        title: '条形码不在范围内',
                        duration: 2500,
                        icon: 'none'
                    }), _this.setData({
                        showShapeVisible: !0
                    })
                    return !1
                } else {
                    shapeArr.push(item.value)
                }
            }
        }
        // console.log(zbAttrIdList);
        // console.log(shapeList);
        const pages = getCurrentPages()
        const currPage = pages[pages.length - 3]  // 当前页
        let goods = _this.data.goods
        let activeIndex = _this.data.defaultIndex
        currPage.setData({
            currentPageCheckItem: goods,
            currentAttrList: zbAttrIdList,
            currentPageCheckIndex: activeIndex,
            currentPageAddShape: shapeArr
        })
        wx.navigateBack({
            delta: 2
        })
    },
    goHome: function (t) {
        var a = this.currentPage.data.pageType;
        if ("PINTUAN" === a) var e = "/pages/pt/index/index"; else if ("BOOK" === a) e = "/pages/book/index/index"; else e = "/pages/index/index";
        getApp().core.redirectTo({
            url: e
        });
    }
};