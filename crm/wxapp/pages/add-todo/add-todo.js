const app = getApp()
const regeneratorRuntime = require('../../lib/regenerator-runtime/runtime')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        todoDate: '',
        todoObj: {
            id: 0,
            value: ''
        },
        todoContent: '', // 拜访内容
        objArr: [],
        dataPickerVisible: !1,
        objPickerVisible: !1,
        currentDate: new Date().getTime(),
        minDate: new Date().getTime(),
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`;
            } else if (type === 'day') {
                return `${value}日`
            }
            return value;
        },

        todoType: [
            {
                checked: !0,
                id: 1,
                name: '微信'
            },
            {
                checked: !1,
                id: 2,
                name: '电话'
            },
            {
                checked: !1,
                id: 3,
                name: '面谈'
            },
            {
                checked: !1,
                id: 4,
                name: '短信'
            }
        ],
        // 拜访链接
        todoLink: [
            {
                checked: !0,
                id: 1,
                name: '活动'
            },
            {
                checked: !1,
                id: 2,
                name: '礼物'
            }
        ],
        remindDate: '', //提醒时间
        remindDateModal: !1, // 提醒时间框,

        reloadTodoInfo: {},
        // 默认是提交新的
        pageFlag: 1
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '拜访信息'
        })
        options.id && this.setData({id: options.id, pageFlag: 0})
        options.customId && this.setData({customId: options.customId})
        this.init()
    },
    async init() {
        await this.loadCustomerList()
        this.data.id && this.loadReloadData()
        this.data.customId && this.loadEditCustomer()
    },
    /**
     * 加载需要提交的客户数据
     */
    loadEditCustomer(){
        const result = this.data.objArr.find(item => item.id == this.data.customId)
        this.setData({
            todoObj: {
                id:  this.data.customId,
                value: result.name
            },
        })
    },
    /**
     * 修改
     */
    editNow() {
        let visiteTypeArr = this.data.todoType.filter(item => item.checked == !0)
        let visiteLinkArr = this.data.todoLink.filter(item => item.checked == !0)
        let visiteIdList = visiteTypeArr.map(item => {
            return item.id
        })
        let visiteLinkidList = visiteLinkArr.map(item => {
            return item.id
        })
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: `editVisitInfo/${this.data.id}`,
            method: 'PUT',
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                user_id: wx.getStorageSync('user_info').id,
                visit_date: this.data.todoDate,
                visit_content: this.data.todoContent,
                customer_id: this.data.todoObj.id,
                type: visiteIdList.join(','),
                link_mode: visiteLinkidList.join(','),
                remind_date: this.data.remindDate
            }
        }).then(res => {
            const result = res.data
            if (0 == result.code) {
                wx.showModal({
                    title: '成功',
                    content: '',
                    showCancel: !1,
                    success: res2 => {
                        if (res2.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: result.msg,
                    showCancel: !1,
                })
            }
        })
    },
    /**
     * 加载重新提交的数据
     */
    loadReloadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'getVisitInfo',
            data: {
                id: this.data.id
            }
        }).then(res => {
            const result = res.data
            this.setData({
                reloadTodoInfo: result.data
            })
            this.showReloadData()
        })
    },
    /**
     * 展示需要重新提交的数据
     */
    showReloadData() {
        const todo = this.data.reloadTodoInfo
        const {todoType, todoLink} = this.data
        todoType.forEach(item => {
            item.checked = !1
        })
        todoLink.forEach(item => {
            item.checked = !1
        })
        if (todo.type.length > 1) {
            const tempArr = todo.type.split(',')
            todoType.forEach(item => {
                tempArr.forEach(item2 => {
                    if (item2 == item.id) item.checked = !0
                })
            })
        } else {
            todoType.forEach(item => {
                if (todo.type == item.id) item.checked = !0
            })
        }
        if (todo.link_mode.length > 1) {
            const tempArr = todo.link_mode.split(',')
            todoLink.forEach(item => {
                tempArr.forEach(item2 => {
                    if (item2 == item.id) item.checked = !0
                })
            })
        } else {
            todoLink.forEach(item => {
                if (todo.link_mode == item.id) item.checked = !0
            })
        }
        const result = this.data.objArr.find(item => item.id == todo.customer_id)
        console.log(result);
        this.setData({
            todoDate: todo.visit_date,
            todoContent: todo.visit_content,
            remindDate: todo.remind_date,
            todoObj: {
                id: todo.customer_id,
                value: result.name
            },
            todoType,
            todoLink
        })
    },
    // 加载拜访列表
    loadCustomerList() {
        return new Promise(resolve => {
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.util.req({
                url: 'getCustomerList',
                data: {
                    uid: wx.getStorageSync('user_info').id
                }
            }).then(res => {
                const result = res.data
                this.setData({
                    objArr: result.data
                })
                resolve()
            })
        })
    },
    // 确认日期选择
    onConfirmDate(e) {
        this.setData({
            todoDate: app.formatTimestap(e.detail),
            dataPickerVisible: !1,
        })
    },
    onChangeType(e) {
        const {check, index} = e.currentTarget.dataset
        this.setData({
            [`todoType[${index}].checked`]: !check
        })
    },
    onChangeLink(e) {
        const {check, index} = e.currentTarget.dataset
        this.setData({
            [`todoLink[${index}].checked`]: !check
        })
    },
    // 确认提醒日期
    onConfirmRemind(e) {
        this.setData({
            remindDate: app.formatTimestap(e.detail),
            remindDateModal: !1,
        })
    },
    /**
     * 校验信息
     * @private
     */
    _verifyData() {
        if ('' == this.data.todoDate) return '请选择拜访日期'
        if ('' == this.data.todoObj.value) return '请选择拜访对象'
        if ('' == this.data.todoContent) return '请输入拜访内容'
        if (-1 == this.data.todoType.findIndex(item => item.checked == !0)) return '请至少选择一个拜访类别'
        if (-1 == this.data.todoLink.findIndex(item => item.checked == !0)) return '请至少选择一个拜访链接'
        if ('' == this.data.remindDate) return '请选择提醒时间'
        return ''
    },
    /**
     * 立即提交
     */
    submitNow() {
        const s = this._verifyData()
        if ('' != s) {
            return wx.showModal({
                title: '失败',
                content: s,
                showCancel: !1,
            }), !1
        }
        let visiteTypeArr = this.data.todoType.filter(item => item.checked == !0)
        let visiteLinkArr = this.data.todoLink.filter(item => item.checked == !0)
        let visiteIdList = visiteTypeArr.map(item => {
            return item.id
        })
        let visiteLinkidList = visiteLinkArr.map(item => {
            return item.id
        })
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'setVisitInfo',
            method: 'POST',
            data: {
                user_id: wx.getStorageSync('user_info').id,
                visit_date: this.data.todoDate,
                visit_content: this.data.todoContent,
                customer_id: this.data.todoObj.id,
                type: visiteIdList.join(','),
                link_mode: visiteLinkidList.join(','),
                remind_date: this.data.remindDate
            }
        }).then(res => {
            const result = res.data
            if (0 == result.code) {
                wx.showModal({
                    title: '成功',
                    content: '',
                    showCancel: !1,
                    success: res2 => {
                        if (res2.confirm) {
                            wx.navigateBack()
                        }
                    }
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: result.msg,
                    showCancel: !1,
                })
            }
        })
    },
    // 展示日期选择框
    showTimeModal() {
        this.setData({
            dataPickerVisible: !0
        })
    },
    showObjModal() {
        this.setData({
            objPickerVisible: !0
        })
    },
    // 展示提醒日期框
    showRemindDateModal() {
        this.setData({
            remindDateModal: !0
        })
    },
    onCloseDateModal() {
        this.setData({
            dataPickerVisible: !1
        })
    },
    onCloseRemindModal() {
        this.setData({
            remindDateModal: !1
        })
    },
    onCloseObjModal() {
        this.setData({
            objPickerVisible: !1
        })
    },
    onConfirmObj(e) {
        this.setData({
            todoObj: {
                id: e.detail.value.id,
                value: e.detail.value.name
            },
            objPickerVisible: !1,
        })
    },
    onChangeTodoContent(e) {
        this.setData({
            todoContent: e.detail.replace(/\s*/g, "")
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