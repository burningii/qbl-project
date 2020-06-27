var shoppingCart = require("../../../components/shopping_cart/shopping_cart.js"),
    specificationsModel = require("../../../components/specifications_model/specifications_model.js");

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        },

        checkedAttrList: [], // 已选的规格
    },
    onLoad: function (o) {
        getApp().page.onLoad(this, o);
    },
    onShow: function () {
        getApp().page.onShow(this), shoppingCart.init(this), specificationsModel.init(this, shoppingCart),
            this.loadData();
    },
    onHide: function () {
        getApp().page.onHide(this), shoppingCart.saveItemData(this);
    },
    // 减少
    myNumberSub(e) {
        console.log('----触发减少----');
        const {checkedAttrList = [], attr_group_list, mySizeList} = this.data
        const {info, index} = e.currentTarget.dataset
        let newAttrList = attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
        })
        let currentNum = info.attr_nums -= 1
        if (currentNum < 0) {
            return
        }
        // mySizeList[0].attr_list[index].attr_num = currentNum
        this.setData({
            [`sizeAttrList[0].attr_list[${index}].attr_nums`]: currentNum
        })
        let group_name = ''
        let group_id = ''
        for (let item of newAttrList) {
            for (let item2 of item.attr_list) {
                if (void 0 != item2.checked && item2.checked == !0) {
                    group_name = item2.attr_name
                    group_id = item2.attr_id
                    break
                }
            }
        }
        if (checkedAttrList.length > 0) {
            for (let i = 0; i < checkedAttrList.length; i++) {
                if (checkedAttrList[i].group_name && checkedAttrList[i].group_name == group_name) {
                    if (checkedAttrList[i].list && checkedAttrList[i].list.length > 0) {
                        for (let j = 0; j < checkedAttrList[i].list.length; j++) {
                            if (checkedAttrList[i].list[j].attr_name == info.attr_name) {
                                if (0 == currentNum) {
                                    checkedAttrList[i].list.splice(j--, 1)
                                } else {
                                    checkedAttrList[i].list[j].attr_num = currentNum
                                }
                            } else {
                                let flag1 = !0
                                for (let k = 0; k < checkedAttrList[i].list.length; k++) {
                                    if (checkedAttrList[i].list[k].attr_name == info.attr_name) {
                                        flag1 = !1
                                    }
                                }
                                flag1 && checkedAttrList[i].list.push({
                                    attr_name: info.attr_name,
                                    attr_id: info.attr_id,
                                    attr_num: currentNum
                                })
                            }
                        }
                    } else {
                        checkedAttrList[i].list.push({
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        })
                    }
                } else {
                    let flag1 = !0
                    for (let k = 0; k < checkedAttrList.length; k++) {
                        if (checkedAttrList[k].group_name == group_name) {
                            flag1 = !1
                            break
                        }
                    }

                    flag1 && checkedAttrList.push({
                        group_name: group_name,
                        group_id: group_id,
                        list: [{
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        }]
                    })
                }
            }
        } else if (0 == checkedAttrList.length) {
            checkedAttrList.push({
                group_name: group_name,
                group_id: group_id
            })
            checkedAttrList[0].list = []
            checkedAttrList[0].list.push({
                attr_name: info.attr_name,
                attr_id: info.attr_id,
                attr_num: currentNum
            })
        }
        let totalNums = 0
        checkedAttrList.forEach(item => {
            if (item.group_id == group_id) {
                item.list.forEach(item2 => {
                    totalNums += item2.attr_num
                })
            }
        })
        attr_group_list[0].attr_list.forEach(item => {
            if (item.attr_id == group_id) {
                item.attr_nums = totalNums
            }
        })
        // checkedAttrList.push(str)
        this.setData({
            checkedAttrList, attr_group_list
        })
    },
    // 增加
    myNumberAdd(e) {
        console.log('----触发增加----');
        const {checkedAttrList = [], attr_group_list} = this.data
        const {info, index} = e.currentTarget.dataset
        console.log('---info---', info);
        let newAttrList = attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
        })
        let currentNum = info.attr_nums += 1
        // mySizeList[0].attr_list[index].attr_num = currentNum
        this.setData({
            [`sizeAttrList[0].attr_list[${index}].attr_nums`]: currentNum
        })
        let group_name = ''
        let group_id = ''
        // 获取选中的组名和组ID
        for (let item of newAttrList) {
            for (let item2 of item.attr_list) {
                if (void 0 != item2.checked && item2.checked == !0) {
                    group_name = item2.attr_name
                    group_id = item2.attr_id
                    break
                }
            }
        }
        if (checkedAttrList.length > 0) {
            for (let i = 0; i < checkedAttrList.length; i++) {
                if (checkedAttrList[i].group_name && checkedAttrList[i].group_name == group_name) {
                    if (checkedAttrList[i].list && checkedAttrList[i].list.length > 0) {
                        for (let j = 0; j < checkedAttrList[i].list.length; j++) {
                            if (checkedAttrList[i].list[j].attr_name == info.attr_name) {
                                if (0 == currentNum) {
                                    checkedAttrList[i].list.splice(j--, 1)
                                } else {
                                    checkedAttrList[i].list[j].attr_num = currentNum
                                }
                            } else {
                                let flag1 = !0
                                for (let k = 0; k < checkedAttrList[i].list.length; k++) {
                                    if (checkedAttrList[i].list[k].attr_name == info.attr_name) {
                                        flag1 = !1
                                    }
                                }
                                flag1 && checkedAttrList[i].list.push({
                                    attr_name: info.attr_name,
                                    attr_id: info.attr_id,
                                    attr_num: currentNum
                                })
                            }
                        }
                    } else {
                        checkedAttrList[i].list.push({
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        })
                    }
                } else {
                    let result = checkedAttrList.find(item => {
                        return item.group_name == group_name
                    })
                    void 0 === result && checkedAttrList.push({
                        group_name: group_name,
                        group_id: group_id,
                        list: [{
                            attr_name: info.attr_name,
                            attr_id: info.attr_id,
                            attr_num: currentNum
                        }]
                    })
                }
            }
        } else if (0 == checkedAttrList.length) {
            checkedAttrList.push({
                group_name: group_name,
                group_id: group_id,
                list: [{
                    attr_name: info.attr_name,
                    attr_id: info.attr_id,
                    attr_num: currentNum
                }]
            })
        }
        console.log('----增加后---', checkedAttrList);
        console.log('----mySizeList---', this.data.mySizeList);
        let totalNums = 0
        checkedAttrList.forEach(item => {
            if (item.group_id == group_id) {
                item.list.forEach(item2 => {
                    totalNums += item2.attr_num
                })
            }
        })
        attr_group_list[0].attr_list.forEach(item => {
            if (item.attr_id == group_id) {
                item.attr_nums = totalNums
            }
        })
        this.setData({
            checkedAttrList,
            attr_group_list
        })
    },
    onUnload: function () {
        getApp().page.onUnload(this), shoppingCart.saveItemData(this);
    },
    loadData: function (o) {
        var h = this, u = getApp().core.getStorageSync(getApp().const.ITEM);
        h.setData({
            total: void 0 !== u.total ? u.total : {
                total_num: 0,
                total_price: 0
            },
            carGoods: void 0 !== u.carGoods ? u.carGoods : []
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.quick.quick,
            success: function (o) {
                if (getApp().core.hideLoading(), 0 == o.code) {
                    var t = o.data.list, a = [], e = [], s = [];
                    for (var i in t) if (0 < t[i].goods.length) for (var c in e.push(t[i]), t[i].goods) {
                        var n = !0;
                        if (getApp().helper.inArray(t[i].goods[c].id, s) && (t[i].goods.splice(c, 1), n = !1),
                            n) {
                            var d = h.data.carGoods;
                            for (var r in d) u.carGoods[r].goods_id === parseInt(t[i].goods[c].id) && (t[i].goods[c].num = t[i].goods[c].num ? t[i].goods[c].num : 0,
                                t[i].goods[c].num += u.carGoods[r].num);
                            if (parseInt(t[i].goods[c].hot_cakes)) {
                                var p = !0;
                                for (var g in a) a[g].id == t[i].goods[c].id && (p = !1);
                                p && a.push(t[i].goods[c]);
                            }
                            s.push(t[i].goods[c].id);
                        }
                    }
                    console.log(e), h.setData({
                        quick_hot_goods_lists: a,
                        quick_list: e
                    });
                }
            }
        });
    },
    get_goods_info: function (o) {
        var t = this, a = t.data.carGoods, e = t.data.total, s = t.data.quick_hot_goods_lists, i = t.data.quick_list,
            c = {
                carGoods: a,
                total: e,
                quick_hot_goods_lists: s,
                check_num: t.data.check_num,
                quick_list: i
            };
        getApp().core.setStorageSync(getApp().const.ITEM, c);
        var n = o.currentTarget.dataset.id;
        getApp().core.navigateTo({
            url: "/pages/goods/goods?id=" + n + "&quick=1"
        });
    },
    selectMenu: function (o) {
        var t = o.currentTarget.dataset, a = this.data.quick_list;
        if ("hot_cakes" == t.tag) for (var e = !0, s = a.length, i = 0; i < s; i++) a[i].cat_checked = !1; else {
            var c = t.index;
            for (s = a.length, i = 0; i < s; i++) a[i].cat_checked = !1, a[i].id == a[c].id && (a[i].cat_checked = !0);
            e = !1;
        }
        this.setData({
            toView: t.tag,
            quick_list: a,
            cat_checked: e
        });
    },
    onShareAppMessage: function (o) {
        getApp().page.onShareAppMessage(this);
        var t = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id,
            success: function (o) {
                share_count++, 1 == share_count && t.shareSendCoupon(t);
            }
        };
    },
    /**
     * 清空已选规则的列表
     */
    clearCheckedAttrList() {
        const {checkedAttrList} = this.data
        checkedAttrList.length = 0
        this.setData({checkedAttrList})
    },
    /**
     * 添加到购物车
     */
    addCart() {
        // 验证
        const {checkedAttrList} = this.data
        if (0 == checkedAttrList.length) {
            return wx.showToast({
                title: '请选择颜色或尺码',
                icon: 'none'
            }), !1
        } else {
            let flag = checkedAttrList.findIndex(value => value.list.length > 0)
            if (flag == -1) {
                return wx.showToast({
                    title: '请选择颜色或尺码',
                    icon: 'none'
                }), !1
            }
        }
        const attrGroupList = this.data.currentGood.attr_group_list[0].attr_list
        const latestNum = this.data.currentGood.start_sale_count
        let totalNum = 0
        attrGroupList.forEach(item => {
            if (item.attr_nums){
                totalNum += Number(item.attr_nums)
            }
        })
        if (totalNum < latestNum) {
            wx.showModal({
                title: '提示',
                content: `该商品至少${latestNum}件起购`,
                showCancel: !1,
            })
            return !1
        }
        const d = [];
        checkedAttrList.forEach((item) => {
            if (item.list.length > 0) {
                item.list.forEach((item2, index) => {
                    d.push({
                        goods_id: this.data.currentGood.id,
                        num: item2.attr_num,
                        attr: [{
                            attr_group_id: this.data.currentGood.attr_group_list[0].attr_group_id,
                            attr_id: item.group_id
                        }, {
                            attr_group_id: this.data.currentGood.attr_group_list[1].attr_group_id,
                            attr_id: item.list[index].attr_id
                        }]
                    });
                })
            }
        })
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: this.data.currentGood.id,
                // attr: JSON.stringify(o),
                attr: JSON.stringify(d),
                // num: a.data.form.number
            },
            success: res => {
                if (0 == res.code) {
                    wx.showToast({
                        title: '添加成功',
                        icon: 'none',
                    })
                    this.close_box(1)
                } else {
                    wx.showModal({
                        title: '提示',
                        content: res.msg,
                        showCancel: !1,
                    })
                }
            },
            complete: () => {
                getApp().core.hideLoading()
            }
        })
    },
    close_box: function (o) {
        this.setData({
            showModal: !1
        });
        this.clearCheckedAttrList()
    },
    hideModal: function () {
        this.setData({
            showModal: !1
        });
        this.clearCheckedAttrList()
    }
});