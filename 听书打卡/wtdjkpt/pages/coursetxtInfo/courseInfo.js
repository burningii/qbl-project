Page({
    playEvent() {
        this.setData({
            status: true
        })
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: options.til,
        })
        this.setData({
            course_id: options.course_id
        })
        this.init(options.course_id);
        this.chapterInit(options.course_id, options.type);
    },
    init(e) {
        var _that = this;
        getApp().request({
            url: getApp().api.default.get_mycourse,
            data: {
                course_id: e,
            },
            success: res => {
                _that.setData({
                    bookInfo: res.data
                })
                console.log(_that.data.bookInfo)
            }
        })
    },
    chapterInit(e, t) {
        var _that = this;
        getApp().request({
            url: getApp().api.default.get_articles,
            data: {
                course_id: e,
                type: t
            },
            success: res => {
                _that.setData({
                    chapters: res.data
                })
            }
        })
    }
})