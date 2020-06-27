const app=getApp()
const compare = function (prop, flag) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (1==flag){
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        }else{
            if (val1 > val2) {
                return -1;
            } else if (val1 < val2) {
                return 1;
            } else {
                return 0;
            }
        }
    }
}
Page({
    data: {
        option1: [],
        value1: 0,
        value2: 'a',
        value3: 0,
        cate_id: '',
        lessionList: [],
        imgUp:`${app.imgUrl2}icon-sort-up.png`,
        imgUp1:`${app.imgUrl2}icon-sort-up.png`,
        img1Flag: !0,
        imgdown:`${app.imgUrl2}icon-sort-down.png`,
        imgdown2:`${app.imgUrl2}icon-sort-down.png`,
        img2Flag: !0,
        showAnimation: !1


    },
    // 价格排序
    priceSort(){
        const _this=this
        this.setData({
            showAnimation: !1
        })
        let {lessionList = []} = this.data
        // const newArr = lessionList.sort(compare('price'))
        // console.log(newArr);
        // 升序
        if (this.data.img1Flag){
            this.setData({
                imgUp: `${app.imgUrl2}icon-sort-up-active.png`,
                imgdown:`${app.imgUrl2}icon-sort-down.png`,
                img1Flag: !1
            })
            lessionList = lessionList.sort(compare('price', 1))
        }else{ // 降序
            this.setData({
                imgUp: `${app.imgUrl2}icon-sort-up.png`,
                imgdown:`${app.imgUrl2}icon-sort-down-active.png`,
                img1Flag: !0
            })
            lessionList = lessionList.sort(compare('price', 0))
        }
        setTimeout(()=>{
            _this.setData({
                showAnimation: !0
            })
        }, 100)
        this.setData({lessionList})
    },
    // 热度排序
    hotSort(){
        this.setData({
            showAnimation: !1
        })
        const _this=this
        let {lessionList = []} = this.data
        // 升序
        if (this.data.img2Flag){
            this.setData({
                imgUp1: `${app.imgUrl2}icon-sort-up-active.png`,
                imgdown2:`${app.imgUrl2}icon-sort-down.png`,
                img2Flag: !1
            })
            lessionList = lessionList.sort(compare('virtual_sales', 1))
        }else{ // 降序
            this.setData({
                imgUp1: `${app.imgUrl2}icon-sort-up.png`,
                imgdown2:`${app.imgUrl2}icon-sort-down-active.png`,
                img2Flag: !0
            })
            lessionList = lessionList.sort(compare('virtual_sales', 0))
        }
        setTimeout(()=>{
            _this.setData({
                showAnimation: !0
            })
        }, 100)
        this.setData({lessionList})
    },

    goArtificerList() {
        wx.navigateTo({
            url: '/pages/artificerList/artificerList'
        })
    },
    onLoad: function (options) {
        const _that = this;
        getApp().request({
            url: getApp().api.default.get_cates,
            success: res => {
                const data = res.data
                const newArr = []
                for (let i = 0; i < data.length; i++) {
                    newArr.push({
                        text: data[i].name,
                        value: i + 1,
                        id: data[i].id
                    })
                }
                newArr.unshift({
                    text: '全部课程',
                    value: 0,
                    id: ''
                })
                _that.setData({
                    option1: newArr
                })
                _that.loadLessionList()
            }
        })
    },

    // 去课程详情页
    goLession(e){
        const {item} = e.currentTarget.dataset
        wx.navigateTo({
          url: `/pages/goods/goods?id=${item.id}&ids=${item.id}`
        })
    },
    // 改变菜单显示
    onChangeMenus(e){
        const index = e.detail
        const _this=this
        _this.setData({
            cate_id: _this.data.option1[index].id,
            imgUp:`${app.imgUrl2}icon-sort-up.png`,
            imgUp1:`${app.imgUrl2}icon-sort-up.png`,
            img1Flag: !0,
            imgdown:`${app.imgUrl2}icon-sort-down.png`,
            imgdown2:`${app.imgUrl2}icon-sort-down.png`,
            img2Flag: !0,
            showAnimation: !1
        })
        _this.loadLessionList()
    },

    // 加载课程列表页面
    loadLessionList() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.request({
            url: app.api.default.get_course,
            method: 'POST',
            data: {
                cate_id: this.data.cate_id
            },
            success: res => {
                if (0 == res.code) {
                    const data = res.data
                    this.setData({
                        lessionList: data,
                        showAnimation: !0,
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
})