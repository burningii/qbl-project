var WxParse = require("../../wxParse/wxParse.js");
console.log(WxParse);
Page({
    data: {
        s: true
    },
    onLoad(e) {
        wx.setNavigationBarTitle({
            title: e.til
        })
        this.chapterInit(e.course_id, e.id)
    },
    chapterInit(e, a) {
        var _that = this;
        getApp().request({
            url: getApp().api.default.get_articles,
            data: {
                course_id: e
            },
            success: res => {
                _that.setData({
                    data: res.data.filter(item => {
                        return item.id == a
                    })[0],
                    content: res.data.filter(item => {
                        return item.id == a
                    })[0].content
                })
                console.log(_that.data.data, '***************');
                WxParse.wxParse("detail", "html", _that.data.content, _that);
            }
        })
    },
    onShow() {
        var _that = this;
        setTimeout(function () {
            console.log(this)
            _that.setData({
                s: false
            })
        }, 5000)
    }
})