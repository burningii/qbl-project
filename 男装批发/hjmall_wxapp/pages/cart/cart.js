const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
const app=getApp()
Page({
    data: {
        total_price: 0,
        cart_check_all: !1,
        cart_list: [],
        mch_list: [],
        loading: !0,
        check_all_self: !1,

        show_attr_picker: !1,

        checkedAttrList: [],// 已选的规格列表

    },
    onLoad: function (t) {
        getApp().page.onLoad(this, t);
        // if (!wx.getStorageSync('ACCESS_TOKEN')){
        //     wx.showModal({
        //       title: '提示',
        //       content: '您当前未登录, 是否登录?',
        //       success: res=>{
        //         if (res.confirm) {
        //             wx.reLaunch({
        //                 url:'/pages/user/user'
        //             })
        //         }else{
        //             wx.reLaunch({
        //                 url: '/pages/index/index'
        //             })
        //         }
        //       }
        //     })
        // }else{
        //     this.getCartList();
        // }
    },
    onReady: function () {
    },
    // 减少
    myNumberSub(e) {
        console.log('----触发减少----');
        const {checkedAttrList = [], attr_group_list, mySizeList} = this.data
        const {info, index} = e.currentTarget.dataset
        let newAttrList = attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
        })
        let currentNum = info.attr_num -= 1
        if (currentNum < 0) {
            return
        }
        // mySizeList[0].attr_list[index].attr_num = currentNum
        this.setData({
            [`mySizeList[0].attr_list[${index}].attr_num`]: currentNum
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
        let newAttrList = attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
        })
        let currentNum = info.attr_num += 1
        // mySizeList[0].attr_list[index].attr_num = currentNum
        this.setData({
            [`mySizeList[0].attr_list[${index}].attr_num`]: currentNum
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
        this.loadRealCartList(info)
    },
    /**
     * 处理购物车的数据
     */
    loadRealCartList(o) {
        // let currentGoods = this.data.cart_list2.filter(item=>item.goods_id==this.data.goods.id)
        let newAttrList = this.data.attr_group_list.filter(item => {
            return '尺码' != item.attr_group_name
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
        for (let item of this.data.cart_list2) {
            if (item.goods_id == this.data.goods.id) {
                if (item.attr_list[0].attr_name == group_name && o.attr_name == item.attr_list[1].attr_name) {
                    item.num = o.attr_num
                    item.price = item.unitPrice * item.num
                    break
                }
            }
        }
        this.setData({
            cart_list2: this.data.cart_list2
        })
        this.updateTotalPrice();
        console.log(o, '----点击参数---');
        // console.log(currentGoods,'----顾虑后---');
    },
    getGoods: function (id) {
        var n = this;
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: id
            },
            success: function (t) {
                if (0 == t.code) {
                    var e = t.data;
                    e.attr_pic = t.data.attr_pic, e.cover_pic = t.data.pic_list[0].pic_url;
                    var a = e.pic_list, i = [];
                    for (var s in a) i.push(a[s].pic_url);
                    // 处理尺码问题
                    const attrList = t.data.attr_group_list
                    let newList = attrList.filter(item => {
                        return '尺码' != item.attr_group_name
                    })
                    let sizeList = attrList.filter(item => {
                        return '尺码' == item.attr_group_name
                    })
                    for (let item of sizeList) {
                        // item.group_name =  t.data.attr_group_list[0].attr_list[0].attr_name
                        // item.group_id =  t.data.attr_group_list[0].attr_list[0].attr_id
                        for (let item2 of item.attr_list) {
                            item2.attr_num = 0
                        }
                    }
                    t.data.attr_group_list[0].attr_list[0].checked = !0
                    t.data.attr_group_list[0].attr_list[0].attr_num_0 = !1
                    t.data.attr_group_list[0].attr_list.forEach(item => {
                        item.attr_nums = 0
                    })
                    e.pic_list = i, n.setData({
                        goods: e,
                        // attr_group_list: newList,
                        attr_group_list: t.data.attr_group_list,
                        mySizeList: sizeList,
                        btn: !0,
                        show_attr_picker: !0,
                    })
                    let array = n.data.cart_list2.filter(item => item.goods_id == n.data.goods.id)
                    const arr = [...t.data.attr_group_list]
                    n.getGroupAttrList(JSON.stringify(array), JSON.stringify(arr))
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    /**
     * 根据规则数组格式化数据
     * @param arr
     */
    getGroupAttrList(arr, attr_group_list) {
        arr = JSON.parse(arr)
        attr_group_list = JSON.parse(attr_group_list)
        const _this = this
        // const attr_group_list = _this.data.attr_group_list
        // if (true){
        //     return
        // }
        const cartList = arr
        const newArr = []
        const getGroupIdByName = (s) => {
            let r = ''
            attr_group_list[0].attr_list.forEach(item => {
                if (s == item.attr_name) {
                    r = item.attr_id
                }
            })
            return r
        }
        const getArrAttr = (arr) => {
            console.log(arr, '----初始数据----');
            const getName = (s) => {
                let r = ''
                attr_group_list[1].attr_list.forEach(item => {
                    if (s == item.attr_name) {
                        r = item.attr_id
                    }
                })
                return r
            }
            const newArr = []
            for (let j = 0; j < arr.length; j++) {
                for (let k = 0; k < arr[j].length; k++) {
                    const arr2 = arr[j][1].split(' ')
                    // arr[j][1] = []
                    // console.log(arr2);
                    for (let i = 0; i < arr2.length; i += 2) {
                        // console.log('okk');
                        newArr.push({
                            attr_name: arr2[i],
                            attr_id: getName(arr2[i]),
                            attr_num: arr2[i + 1]
                        })
                    }
                    console.log(newArr, '----操你妈的----');
                    // console.log(arr[j][1].split(' '));
                }
            }
            // return newArr
        }
        const getData = (arr) => {
            console.log(arr, '---数据---');
            const newArr = []
            const getName = (s) => {
                let r = ''
                attr_group_list[1].attr_list.forEach(item => {
                    if (s == item.attr_name) {
                        r = item.attr_id
                    }
                })
                return r
            }

            function getAttrList(s) {
                const list = []
                const arr2 = s.split(' ')
                // console.log(arr2,'-----ok1----');
                for (let i = 0; i < arr2.length; i += 2) {
                    let arr = arr2[i+1].split('')
                    for (let j = 0; j < arr.length; j++) {
                        if (isNaN(parseInt(arr[j])))arr.splice(j--,1)
                    }
                    // console.log(arr.join(''),'----哈哈哈哈哈-----');
                    list.push({
                        attr_name: arr2[i],
                        attr_id: getName(arr2[i]),
                        attr_num: Number(arr.join(''))
                    })
                }
                return list
            }

            for (let i = 0; i < arr.length; i++) {
                newArr.push({
                    group_name: arr[i][0],
                    group_id: getGroupIdByName(arr[i][0]),
                    list: getAttrList(arr[i][1])
                })
            }
            console.log(newArr, '-----处理后----');
            return newArr
        }

        for (let i = 0; i < cartList.length; i++) {
            let flag = !0
            if (newArr[cartList[i].goods_id]) {
                for (let y = 0; y < newArr[cartList[i].goods_id]['new_attr'].length; y++) {
                    if (newArr[cartList[i].goods_id]['new_attr'][y][0] == cartList[i]['attr_list'][0]['attr_name']) {
                        cartList[i]['attr_list'][1]['num'] = cartList[i]['num'];
                        // newArr[cartList[i].goods_id]['new_attr'][y].push(
                        //     cartList[i]['attr_list'][1]
                        // );
                        newArr[cartList[i].goods_id]['new_attr'][y][1] += ' ' + cartList[i]['attr_list'][1]['attr_name'] + ' ' + cartList[i]['num'] + '件';
                        flag = !1;
                        break;
                    }
                    // newArr[cartList[i].goods_id]['new_attr'].push(
                    //     cartList[i]['attr_list']
                    // );
                    // newArr[cartList[i].goods_id]['new_attr'][newArr[cartList[i].goods_id]['new_attr'].length - 1][1]['num'] = cartList[i]['num'];


                }
                if (!flag) {
                    continue;
                }
                newArr[cartList[i].goods_id]['new_attr'].push(
                    [cartList[i]['attr_list'][0]['attr_name']]
                );
                newArr[cartList[i].goods_id]['new_attr'][newArr[cartList[i].goods_id]['new_attr'].length - 1][1] = [];
                newArr[cartList[i].goods_id]['new_attr'][newArr[cartList[i].goods_id]['new_attr'].length - 1][1] = cartList[i]['attr_list'][1]['attr_name'] + ' ' + cartList[i]['num'] + '件';

            } else {
                newArr[cartList[i].goods_id] = cartList[i];
                newArr[cartList[i].goods_id]['new_attr'] = [];
                newArr[cartList[i].goods_id]['new_attr'][0] = [];
                newArr[cartList[i].goods_id]['new_attr'][0].push(
                    cartList[i]['attr_list'][0]['attr_name']
                );
                // newArr[cartList[i].goods_id]['new_attr'][0][1]['num'] = cartList[i]['num'];
                newArr[cartList[i].goods_id]['new_attr'][0][1] = [];
                newArr[cartList[i].goods_id]['new_attr'][0][1] = cartList[i]['attr_list'][1]['attr_name'] + ' ' + cartList[i]['num'] + '件';
            }
            // }
        }
        for (let j = 0; j < newArr.length; j++) {
            if (newArr[j] == undefined) newArr.splice(j--, 1)
        }
        console.log(newArr,'----1发送----');
        for (let i = 0; i < newArr.length; i++) {
            newArr[i].checkedAttrList = []
            newArr[i].checkedAttrList = getData(newArr[i].new_attr)
        }
        let totalNumsArr = []
        newArr[0].checkedAttrList.forEach(item => {
            let totalNums = 0
            item.list.forEach(item2 => {
                totalNums += item2.attr_num
            })
            totalNumsArr.push({
                nums: Number(totalNums),
                id: item.group_id
            })
        })
        attr_group_list[0].attr_list.forEach(item => {
            totalNumsArr.forEach(item2 => {
                if (item2.id == item.attr_id) item.attr_nums = item2.nums
            })
        })
        console.log(_this.data.mySizeList, '----处理汇顶科技21212-合计啥的看法-----');

        let tempId = attr_group_list[0].attr_list[0].attr_id
        let temp2 = newArr[0].checkedAttrList
        let index = 0
        for (let i = 0; i < temp2.length; i++) {
            if (temp2[i].group_id==tempId){
                index = i
                break
            }
        }
        for (let item of _this.data.mySizeList) {
            for (let item2 of item.attr_list) {
                for (let item3 of newArr[0].checkedAttrList[index].list) {
                    if (item3.attr_id == item2.attr_id) {
                        item2.attr_num = item3.attr_num
                    }
                }
            }
        }
        _this.setData({
            checkedAttrList: newArr[0].checkedAttrList,
            mySizeList: _this.data.mySizeList,
            // [`mySizeList[0].attr_list`]: newArr[0].checkedAttrList[0].list,
            attr_group_list: attr_group_list
        })
    },
    storeAttrClick: function (t) {
        console.log('----参数----', t);
        var e = this, a = t.target.dataset.groupId, r = parseInt(t.target.dataset.id),
            i = JSON.parse(JSON.stringify(e.data.attr_group_list)), o = e.data.goods.attr, s = [];
        // e.setData({
        //     myStepDisabled: !1
        // })

        for (var n in "string" == typeof o && (o = JSON.parse(o)), i) if (i[n].attr_group_id == a) for (var d in i[n].attr_list) {
            var p = i[n].attr_list[d];
            parseInt(p.attr_id) === r && p.checked ? p.checked = !1 : p.checked = parseInt(p.attr_id) === r;
        }
        for (var n in i) for (var d in i[n].attr_list) i[n].attr_list[d].checked && s.push(i[n].attr_list[d].attr_id);
        for (var n in i) for (var d in i[n].attr_list) {
            if ((p = i[n].attr_list[d]).attr_id === r && !0 === p.attr_num_0) return;
        }
        var u = [];
        for (var n in o) {
            var c = [], _ = 0;
            for (var d in o[n].attr_list) getApp().helper.inArray(o[n].attr_list[d].attr_id, s) || (_ += 1),
                c.push(o[n].attr_list[d].attr_id);
            0 === o[n].num && _ <= 1 && u.push(c);
        }
        var g = s.length, l = [];
        if (i.length - g <= 1) for (var n in s) for (var d in u) if (getApp().helper.inArray(s[n], u[d])) for (var f in u[d]) u[d][f] !== s[n] && l.push(u[d][f]);
        for (var n in i) for (var d in i[n].attr_list) {
            var m = i[n].attr_list[d];
            getApp().helper.inArray(m.attr_id, l) && !getApp().helper.inArray(m.attr_id, s) ? m.attr_num_0 = !0 : m.attr_num_0 = !1;
        }
        i[0].attr_list.forEach(item => {
            if (item.attr_id == r) {
                item.checked = !0
            }
        })
        e.setData({
            attr_group_list: i
        });
        var h = [], A = !0;
        // console.log('-----i的值----', i);
        // debugger
        for (var n in i) {
            var v = !1;
            for (var d in i[n].attr_list) {
                if (i[n].attr_list[d].checked) {
                    if ("INTEGRAL" !== e.data.pageType) {
                        h.push(i[n].attr_list[d].attr_id), v = !0;
                        break;
                    }
                    o = {
                        attr_id: i[n].attr_list[d].attr_id,
                        attr_name: i[n].attr_list[d].attr_name
                    };
                    h.push(o);
                }
            }
            // console.log('----哈哈哈哈哈----', v);
            if ("INTEGRAL" !== e.data.pageType && !v) {
                A = !1;
                break;
            }
        }
        // console.log('---A的值为---', A);
        if ("INTEGRAL" === e.data.pageType || A) {
            // console.log('---发起请求,A的值为---', A);
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            });
            var b = e.data.pageType;
            v = 0;
            if ("STORE" === b) var k = getApp().api.default.goods_attr_info; else if ("PINTUAN" === b) {
                k = getApp().api.group.goods_attr_info;
                v = e.data.group_checked;
            } else {
                if ("INTEGRAL" === b) return getApp().core.hideLoading(), void this.integralMallAttrClick(h);
                if ("BOOK" === b) k = getApp().api.book.goods_attr_info; else if ("STEP" === b) k = getApp().api.default.goods_attr_info; else {
                    if ("MIAOSHA" !== b) return getApp().core.showModal({
                        title: "提示",
                        content: "pageType变量未定义或变量值不是预期的"
                    }), void getApp().core.hideLoading();
                    k = getApp().api.default.goods_attr_info;
                }
            }
            getApp().request({
                url: k,
                data: {
                    goods_id: "MIAOSHA" === b ? e.data.id : e.data.goods.id,
                    group_id: e.data.group_checked,
                    attr_list: JSON.stringify(h),
                    type: "MIAOSHA" === b ? "ms" : "",
                    group_checked: v
                },
                success: function (t) {
                    if (getApp().core.hideLoading(), 0 == t.code) {
                        var a = e.data.goods;
                        if (a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.is_member_price = t.data.is_member_price,
                            a.single_price = t.data.single_price ? t.data.single_price : 0, a.group_price = t.data.price,
                        "MIAOSHA" === b) {
                            var r = t.data.miaosha;
                            a.price = r.price, a.num = r.miaosha_num, a.is_member_price = r.is_member_price,
                                a.attr_pic = r.pic, e.setData({
                                miaosha_data: r
                            });
                        }
                        "BOOK" === b && (a.price = 0 < a.price ? a.price : "免费预约"), e.setData({
                            goods: a
                        });
                    }
                }
            });
        }
        let {checkedAttrList, mySizeList} = e.data
        console.log('-----开始的父节点咖啡机----', checkedAttrList);
        let result = checkedAttrList.find(item => {
            return item.group_id == t.currentTarget.dataset.id
        })
        const detailData = () => {
            for (let m = 0; m < mySizeList.length; m++) {
                for (let j = 0; j < mySizeList[m].attr_list.length; j++) {
                    mySizeList[m].attr_list[j].attr_num = 0
                }
                break
            }
        }
        //(mySizeList[0].attr_list = result.list)
        const reloadData = () => {
            if (result.list.length == 0) {
                mySizeList[0].attr_list.forEach(item => {
                    item.attr_num = 0
                })
            } else {
                mySizeList[0].attr_list.forEach(item => {
                    item.attr_num = 0
                    result.list.forEach(item2 => {
                        if (item.attr_id == item2.attr_id) {
                            item.attr_num = item2.attr_num
                        }
                    })
                })
            }
        }
        console.log('---查询出来的数据---', result);
        console.log('---设置的数据---', mySizeList);
        // void 0 !== result ? (mySizeList[0].attr_list = result.list) : detailData()
        void 0 !== result ? reloadData() : detailData()
        e.setData({
            mySizeList,
        })
    },
    hideAttrPicker() {
        this.setData({
            show_attr_picker: !1
        })
    },
    showEditModal(e) {
        const {id} = e.currentTarget.dataset
        this.getGoods(id)
    },
    onShow: function () {
        getApp().page.onShow(this);
        this.setData({
            cart_check_all: !1,
            show_cart_edit: !1,
            check_all_self: !1
        })
        this.getCartList()
    },
    getCartList: function () {
        var a = this;
        getApp().core.showNavigationBarLoading(), a.setData({
            show_no_data_tip: !1,
            loading: !0
        }), getApp().request({
            url: getApp().api.cart.list,
            success: function (t) {
                if (0 == t.code) {
                    const cartList = t.data.list
                    const newArr = []
                    const cartIdList = []
                    for (let i = 0; i < cartList.length; i++) {
                        let flag = !0
                        cartIdList.push(Number(cartList[i].cart_id));
                        // if (cartList[i].goods_id==1){
                        if (newArr[cartList[i].goods_id]) {
                            for (let y = 0; y < newArr[cartList[i].goods_id]['new_attr'].length; y++) {
                                if (newArr[cartList[i].goods_id]['new_attr'][y][0] == cartList[i]['attr_list'][0]['attr_name']) {
                                    cartList[i]['attr_list'][1]['num'] = cartList[i]['num'];
                                    // newArr[cartList[i].goods_id]['new_attr'][y].push(
                                    //     cartList[i]['attr_list'][1]
                                    // );
                                    newArr[cartList[i].goods_id]['new_attr'][y][1] += ' ' + cartList[i]['attr_list'][1]['attr_name'] + ' ' + cartList[i]['num'] + '件';
                                    flag = !1;
                                    break;
                                }
                                // newArr[cartList[i].goods_id]['new_attr'].push(
                                //     cartList[i]['attr_list']
                                // );
                                // newArr[cartList[i].goods_id]['new_attr'][newArr[cartList[i].goods_id]['new_attr'].length - 1][1]['num'] = cartList[i]['num'];


                            }
                            if (!flag) {
                                continue;
                            }
                            newArr[cartList[i].goods_id]['new_attr'].push(
                                [cartList[i]['attr_list'][0]['attr_name']]
                            );
                            newArr[cartList[i].goods_id]['new_attr'][newArr[cartList[i].goods_id]['new_attr'].length - 1][1] = [];
                            newArr[cartList[i].goods_id]['new_attr'][newArr[cartList[i].goods_id]['new_attr'].length - 1][1] = cartList[i]['attr_list'][1]['attr_name'] + ' ' + cartList[i]['num'] + '件';

                        } else {
                            newArr[cartList[i].goods_id] = cartList[i];
                            newArr[cartList[i].goods_id]['new_attr'] = [];
                            newArr[cartList[i].goods_id]['new_attr'][0] = [];
                            newArr[cartList[i].goods_id]['new_attr'][0].push(
                                cartList[i]['attr_list'][0]['attr_name']
                            );
                            // newArr[cartList[i].goods_id]['new_attr'][0][1]['num'] = cartList[i]['num'];
                            newArr[cartList[i].goods_id]['new_attr'][0][1] = [];
                            newArr[cartList[i].goods_id]['new_attr'][0][1] = cartList[i]['attr_list'][1]['attr_name'] + ' ' + cartList[i]['num'] + '件';
                        }
                        // }

                    }

                    for (let i = 0; i < newArr.length; i++) {
                        if (newArr[i] == null || undefined == newArr[i]) {
                            newArr.splice(i--, 1)
                        }
                    }
                    // 计算总价
                    console.log(t.data.list);
                    for (let i = 0; i < newArr.length; i++) {
                        let totalPrice = 0
                        for (let j = 0; j < t.data.list.length; j++) {
                            if (t.data.list[j].goods_id==newArr[i].goods_id){
                                totalPrice += t.data.list[j].unitPrice*t.data.list[j].num
                            }
                        }
                        newArr[i].totalPriceMy = parseFloat(totalPrice).toFixed(2)
                    }
                    console.log(newArr, '----数据为---');
                    a.setData({
                        // cart_list: t.data.list,
                        cart_list: newArr,
                        cart_list2: t.data.list,
                        mch_list: t.data.mch_list,
                        // 设置所有的购物车ID
                        cart_id_list: cartIdList,
                        total_price: 0,
                        cart_check_all: !1,
                        show_cart_edit: !1
                    }), a.setData({
                        show_no_data_tip: 0 == a.data.cart_list.length
                    });
                }
            },
            complete: function () {
                getApp().core.hideNavigationBarLoading(), a.setData({
                    loading: !1
                });
            }
        });
    },

    /**
     * 修改属性后确定
     */
    async checkEditAttrMy() {
        this.setData({
            show_attr_picker: !1
        })
        /**
         * 先把选中的商品在购物车中清空,然后再整体加入购物车
         */
        await this.clearCurrentCartId()
        await this.myAddCart()
        await this.getCartList()
        // this.saveCart()
    },
    /**
     * 整体加入购物车
     */
    myAddCart(){
        return new Promise(resolve => {
            const {checkedAttrList} = this.data
            const d = [], _this=this;
            checkedAttrList.forEach((item) => {
                if (item.list.length > 0) {
                    item.list.forEach((item2, index) => {
                        d.push({
                            goods_id: _this.data.goods.id,
                            num: item2.attr_num,
                            attr: [{
                                attr_group_id: _this.data.attr_group_list[0].attr_group_id,
                                attr_id: item.group_id
                            }, {
                                attr_group_id: _this.data.attr_group_list[1].attr_group_id,
                                attr_id: item.list[index].attr_id
                            }]
                        });
                    })
                }
            })
            app.request({
                url: app.api.cart.add_cart,
                method: "POST",
                data: {
                    goods_id: _this.data.goods.id,
                    attr: JSON.stringify(d),
                },
                success: function (t) {
                    getApp().core.hideLoading()
                    resolve()
                }
            })
        })
    },
    /**
     * 清空当前选中的购物车商品
     */
    clearCurrentCartId(){
        return new Promise(resolve => {
            let cartIdArr = []
            for (let item of this.data.cart_list2){
                if (item.goods_id==this.data.goods.id){
                    cartIdArr.push(item.cart_id)
                }
            }
            app.core.showLoading({
                title: "加载中..",
                mask: !0
            })
            getApp().request({
                url: app.api.cart.delete,
                data: {
                    cart_id_list: JSON.stringify(cartIdArr)
                },
                success: function (t) {
                    getApp().core.hideLoading()
                    resolve()
                }
            });
        })
    },

    /**
     * 减少数量
     * @param t
     */
    cartLess: function (t) {
        var a = this;
        if (t.currentTarget.dataset.type && "mch" == t.currentTarget.dataset.type) {
            var i = t.currentTarget.dataset.mchIndex, c = t.currentTarget.dataset.index;
            a.data.mch_list[i].list[c].num = a.data.mch_list[i].list[c].num - 1, a.data.mch_list[i].list[c].price = a.data.mch_list[i].list[c].num * a.data.mch_list[i].list[c].unitPrice,
                a.setData({
                    mch_list: a.data.mch_list
                });
        } else {
            var e = a.data.cart_list;
            for (var s in e) t.currentTarget.id == e[s].cart_id && (e[s].num = a.data.cart_list[s].num - 1,
                e[s].price = a.data.cart_list[s].unitPrice * e[s].num, a.setData({
                cart_list: e
            }));
        }
        a.updateTotalPrice();
    },
    /**
     * 增加数量
     * @param t
     */
    cartAdd: function (t) {
        var a = this;
        if (t.currentTarget.dataset.type && "mch" == t.currentTarget.dataset.type) {
            var i = t.currentTarget.dataset.mchIndex, c = t.currentTarget.dataset.index;
            a.data.mch_list[i].list[c].num = a.data.mch_list[i].list[c].num + 1, a.data.mch_list[i].list[c].price = a.data.mch_list[i].list[c].num * a.data.mch_list[i].list[c].unitPrice,
                a.setData({
                    mch_list: a.data.mch_list
                });
        } else {
            var e = a.data.cart_list;
            for (var s in e) t.currentTarget.id == e[s].cart_id && (e[s].num = a.data.cart_list[s].num + 1,
                e[s].price = a.data.cart_list[s].unitPrice * e[s].num, a.setData({
                cart_list: e
            }));
        }
        a.updateTotalPrice();
    },
    /**
     * 点击某一个商品item
     * @param t
     */
    cartCheck: function (t) {
        console.log(t,'---点击参数---');
        console.log(this.data.cart_list2);
        const cart_list2 = this.data.cart_list2
        const index = t.currentTarget.dataset.index
        const goods_id = this.data.cart_list[t.currentTarget.dataset.index].goods_id
        cart_list2.forEach(item=>{
            if (item.goods_id==goods_id)item.checked=!item.checked
        })
        if (this.data.cart_list[index].checked!==undefined){
            this.setData({
                [`cart_list[${index}].checked`]: !this.data.cart_list[index].checked
            })
        }else{
            this.setData({
                [`cart_list[${index}].checked`]: !0
            })
        }

        var a = this, i = t.currentTarget.dataset.index, c = t.currentTarget.dataset.type,
            e = t.currentTarget.dataset.mchIndex;
        "self" == c && (a.data.cart_list[i].checked = !a.data.cart_list[i].checked, a.setData({
            // cart_list: a.data.cart_list
            cart_list: a.data.cart_list,
            cart_list2: cart_list2
        })), "mch" == c && (a.data.mch_list[e].list[i].checked = !a.data.mch_list[e].list[i].checked,
            a.setData({
                mch_list: a.data.mch_list
            })), a.updateTotalPrice();
    },
    /**
     * 全选或者反选
     */
    cartCheckAll: function () {
        var t = this, a = t.data.cart_list2, i = !1, b = t.data.cart_list;
        for (var c in i = !t.data.cart_check_all, a) a[c].disabled && !t.data.show_cart_edit || (a[c].checked = i);
        if (t.data.mch_list && t.data.mch_list.length) for (var c in t.data.mch_list) for (var e in t.data.mch_list[c].list) t.data.mch_list[c].list[e].checked = i;
        b.forEach(item => {
            item.checked = i
        })
        t.setData({
            cart_check_all: i,
            cart_list2: a,
            cart_list: b,
            mch_list: t.data.mch_list
        }), t.updateTotalPrice();
    },
    updateTotalPrice: function () {
        // var t = this, a = 0, i = t.data.cart_list;
        var t = this, a = 0, i = t.data.cart_list2;
        for (var c in i) i[c].checked && (a += i[c].price);
        for (var c in t.data.mch_list) for (var e in t.data.mch_list[c].list) t.data.mch_list[c].list[e].checked && (a += t.data.mch_list[c].list[e].price);
        t.setData({
            total_price: a.toFixed(2)
        });
    },
    cartSubmit: function () {
        var t = this, a = t.data.cart_list2, i = t.data.mch_list, c = [], e = [], s = [], r = [];
        for (var l in a) a[l].checked && (c.push(a[l].cart_id), r.push({
            cart_id: a[l].cart_id
        }));
        for (var l in 0 < c.length && s.push({
            mch_id: 0,
            goods_list: r
        }), i) {
            var d = [], h = [];
            if (i[l].list && i[l].list.length) for (var n in i[l].list) i[l].list[n].checked && (d.push(i[l].list[n].cart_id),
                h.push({
                    cart_id: i[l].list[n].cart_id
                }));
            d.length && (e.push({
                id: i[l].id,
                cart_id_list: d
            }), s.push({
                mch_id: i[l].id,
                goods_list: h
            }));
        }
        if (0 == c.length && 0 == e.length) return !0;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), t.saveCart(function () {
            getApp().core.navigateTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(s)
            });
        }), getApp().core.hideLoading();
    },
    cartEdit: function () {
        var t = this.data.cart_list;
        for (var a in t) t[a].checked = !1;
        this.setData({
            cart_list: t,
            show_cart_edit: !0,
            cart_check_all: !1
        }), this.updateTotalPrice();
    },
    cartDone: function () {
        var t = this.data.cart_list;
        for (var a in t) t[a].checked = !1;
        this.setData({
            cart_list: t,
            show_cart_edit: !1,
            cart_check_all: !1
        }), this.updateTotalPrice();
    },
    cartDelete: function () {
        var a = this, t = a.data.cart_list, i = [], zbArr = a.data.cart_list, zbArr2 = a.data.cart_list2;
        for (var c in t) t[c].checked && i.push(t[c].cart_id);
        if (a.data.mch_list && a.data.mch_list.length) for (var c in a.data.mch_list) for (var e in a.data.mch_list[c].list) a.data.mch_list[c].list[e].checked && i.push(a.data.mch_list[c].list[e].cart_id);
        if (0 == i.length) return !0;
        let filterArr = zbArr.filter(item=>{
            return item.checked==!0
        })
        let goodsIdArr = filterArr.map(item=>{
            return item.goods_id
        })
        let cartIdArr = []
        for (let item of goodsIdArr){
            for (let item2 of zbArr2){
                if (item2.goods_id==item){
                    cartIdArr.push(item2.cart_id)
                }
            }
        }
        // console.log(cartIdArr,'---杨删除的---');
        // if (true){
        //     return
        // }
        getApp().core.showModal({
            title: "提示",
            content: "确认删除" + i.length + "项内容？",
            success: function (t) {
                if (t.cancel) return !0;
                getApp().core.showLoading({
                    title: "正在删除",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.cart.delete,
                    data: {
                        // cart_id_list: JSON.stringify(i)
                        cart_id_list: JSON.stringify(cartIdArr)
                    },
                    success: function (t) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: t.msg
                        }), 0 == t.code && a.getCartList(), a.updateCartCouont(), t.code;
                    }
                });
            }
        });
    },
    /**
     * 更新购物车底部角标
     */
    updateCartCouont(){
        getApp().request({
            url: getApp().api.cart.list,
            success:res=> {
                const cartList = res.data.list, newArr = []
                for (let i = 0; i < cartList.length; i++) {
                    newArr[cartList[i].goods_id] = cartList[i];
                }
                for (let i = 0; i < newArr.length; i++) {
                    if (newArr[i] == null || undefined == newArr[i]) {
                        newArr.splice(i--, 1)
                    }
                }
                this.setData({
                    totalCartCount: newArr.length
                })
            }
        });
    },
    onHide: function () {
        this.saveCart();
    },
    onUnload: function () {
        this.saveCart();
    },
    saveCart: function (t) {
        if (wx.getStorageSync('ACCESS_TOKEN')) {
            var a = JSON.stringify(this.data.cart_list2);
            wx.showLoading({
                title:'加载中',
                mask: !0
            })
            getApp().request({
                url: getApp().api.cart.cart_edit,
                method: "post",
                data: {
                    list: a,
                    mch_list: JSON.stringify(this.data.mch_list)
                },
                success: function (t) {
                    t.code;
                },
                complete: function () {
                    wx.hideLoading()
                    "function" == typeof t && t();
                }
            });
        }
    },
    checkGroup: function (t) {
        var a = this, i = t.currentTarget.dataset.type, c = t.currentTarget.dataset.index;
        if ("self" == i) {
            for (var e in a.data.cart_list) a.data.cart_list[e].checked = !a.data.check_all_self;
            a.setData({
                check_all_self: !a.data.check_all_self,
                cart_list: a.data.cart_list
            });
        }
        if ("mch" == i) {
            for (var e in a.data.mch_list[c].list) a.data.mch_list[c].list[e].checked = !a.data.mch_list[c].checked_all;
            a.data.mch_list[c].checked_all = !a.data.mch_list[c].checked_all, a.setData({
                mch_list: a.data.mch_list
            });
        }
        a.updateTotalPrice();
    }
});
