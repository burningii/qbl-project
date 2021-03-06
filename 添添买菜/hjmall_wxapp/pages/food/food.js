const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        interval: 2000,
        img: [
            'https://s1.ax1x.com/2020/05/07/YZ0CGT.jpg',
            'https://s1.ax1x.com/2020/04/14/Gzd54A.jpg'
        ],
        active: 0,
        showTabs: !1,
        id: 'default',
        height: '',

        goodsModalVisible: !1,
        activeGoods: 0,
        goodsIntoView: 'default'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        app.page.onLoad(this, options);
        wx.getSystemInfo({
            success: res => {
                this.setData({
                    height :res.windowHeight-(res.windowWidth*90/750)
                })
            }
        })
    },
    showGoodsModal(){
        this.setData({
            goodsModalVisible: !0
        })
        setTimeout(()=>{
            let query2 = wx.createSelectorQuery().in(this)
            let heightArr2 = []
            query2.selectAll('.modal-container .floorGoods').boundingClientRect((react)=>{
                react.forEach((res)=>{
                    console.log(res);
                    // h+=(res.top);
                    heightArr2.push(res.height)
                })
                this.setData({
                    anchorArray2:heightArr2
                });
            }).exec();

        }, 800)

    },
    onCloseGoodsModal(){
        this.setData({
            goodsModalVisible: !1
        })
    },
    onChangeGoodsTab(e){
        // console.log('okk');
        if (0==e.detail.index){
            this.setData({
                goodsIntoView: 'goods1'
            })
        }else{
            this.setData({
                goodsIntoView: 'goods2'
            })
        }
    },
    onChangeTab(e){
       if (0==e.detail.index){
           this.setData({
               id: 'hash1'
           })
       }else if (1==e.detail.index){
           this.setData({
               id: 'hash2'
           })
       }else if (2==e.detail.index){
           this.setData({
               id: 'hash3'
           })
       }

    },
    handelScroll(e) {
        let scrollTop=e.detail.scrollTop + 70;
        let scrollArr= this.data.anchorArray;
        // console.log(scrollTop);
        if (scrollTop >= scrollArr[0]){
            this.setData({
                showTabs: !0
            })
        }else{
            this.setData({
                showTabs: !1
            })
        }

        if(scrollTop>=scrollArr[0]&&scrollTop<scrollArr[1]){
            // selectFloorIndex控制筛选块高亮显示
            this.setData({
                active: 0
            });
        } else if (scrollTop>=scrollArr[1] && scrollTop<=scrollArr[2]){
            this.setData({
                active: 1
            });
        } else if (scrollTop>=scrollArr[2]){
            this.setData({
                active: 2
            });
        }
    },
    handelScrollGoods(e){
        // console.log(e.detail.scrollTop);
        let scrollTop=e.detail.scrollTop;
        let scrollArr= this.data.anchorArray2;
        if (scrollTop<=scrollArr[0]){
            this.setData({
                activeGoods: 0
            });
        }else{
            this.setData({
                activeGoods: 1
            });
        }
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
        let query = wx.createSelectorQuery().in(this);
        let heightArr =[];
        let h = 0;
        query.selectAll('.floorType').boundingClientRect((react)=>{
            react.forEach((res)=>{
                console.log(res);
                // h+=(res.top);
                heightArr.push(res.top)
            })
            this.setData({
                anchorArray:heightArr
            });
        }).exec();

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