const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeNames: ['1'],
        /**
         * 本人
         */
        // 姓名
        myName: '',
        // 出生日期
        MyBirthday: '',
        // 农历生日
        lunarBirthday: '',
        // 出生日期选择框
        myBirthdayModalVisible: !1,
        currentDate: new Date().getTime(),
        minDate: new Date(1900, 0, 1).getTime(),
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
        // 是否抽烟
        mySmockFlag: '是',
        // 是否喝酒
        myDrinkFlag: '是',
        // 身体状况
        bodyStatus: '',
        // 有无社保
        Social: '有',
        // 老家
        myHometown: '',
        // 行业
        industryFlag: '',
        // 公司名称
        companyName: '',
        // 公司职务
        companyJob: '',
        // 公司地址
        companyAddr: '',
        // 兴趣爱好
        hobby: '',
        // 年收入
        yearSalary: '',
        // 住址
        address: '',
        // 备注
        remark: '',

        /**
         * 家庭成员
         */
        // 姓名
        spouseName: '',
        // 出生日期
        spouseBirthday: '',
        // 农历生日
        spouseLunarBirthday: '',
        // 抽烟
        spouseSmockFlag: '是',
        // 喝酒
        spouseDrinkFlag: '是',
        // 身体状况
        spouseBodyStatus: '',
        // 有无社保
        spouseSocial: '有',
        // 配偶老家
        spouseHometown: '',
        // 行业
        spouseIndustryFlag: '',
        // 兴趣爱好
        spouseHobby: '',
        // 年收入
        spouseYearSalary: '',
        // 配偶住址
        spouseAddress: '',
        // 配偶备注
        spouseRemark: '',

        /**
         * 不动产
         */
        // 面积
        realEstateArea: '',
        // 姓名
        realEstateName: '',
        // 月供
        realEstateMonth: '',

        /**
         * 负债
         */
        // 项目
        liabilitiesProject: '',
        // 金额
        liabilitiesMoney: '',

        /**
         * 车辆信息
         */
        // 品牌
        carBrand: '',
        // 限行日期
        caRestrictionDay: '',
        // 车险日期
        carInsuranceDay: '',
        // 车辆备注
        carRemark: '',

        /**
         * 金融
         */
        // 理财产品
        financeProduct: '',
        // 股票
        financeShares: '',
        // 期货
        financeGoods: '',
        // 股权
        financePower: '',

        /**
         * 其他
         */
        // 保险
        otherInsurance: '',
        // 活动
        otherActivity: '',
        // 礼物
        otherGift: '',
        // 跟进记录
        otherNotes: '',
        // 备注
        otherRemark: '',
        pageFlag: 1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '客户录入'
        })
        if (options.id){
            this.setData({customerId: options.id, pageFlag: 0}),this.loadData()
        }
    },

    /**
     * 加载重新提交的数据
     */
    loadData() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        }), app.util.req({
            url: 'getCustomerInfo',
            data: {
                id: this.data.customerId
            },
        }).then(res => {
            const result = res.data
            if (0 == result.code) {
                this.setData({
                    customerInfo: result.data
                })
                this.showReloadData()
            } else {
                wx.showModal({
                    title: '提示',
                    content: res.msg,
                    showCancel: !1,
                })
            }
        })
    },
    /**
     * 立即修改
     */
    editNow(){
        const a = this.data
        /**
         * 本人公历生日
         * @param s
         */
        const getBirthDay = s => {
            return s.split('-').join('')
        }
        wx.showLoading({
            title: '提交中',
            mask: !0
        }), app.util.req({
            url: 'editCustomerInfo',
            method: 'POST',
            data: {
                customer: {
                    user_id: wx.getStorageSync('user_info').id,
                    name: a.myName,
                    birth_gong: getBirthDay(a.MyBirthday),
                    birth_nong: a.lunarBirthday,
                    is_smoking: '是' == a.mySmockFlag ? 1 : 0,
                    is_drink: '是' == a.myDrinkFlag ? 1 : 0,
                    health: a.bodyStatus,
                    is_security: '是' == a.Social ? 1 : 0,
                    hometown: a.myHometown,
                    industry: a.industryFlag,
                    corporate_name: a.companyName,
                    duties: a.companyJob,
                    corporate_address: a.companyAddr,
                    interest: a.hobby,
                    annual_income: a.yearSalary,
                    address: a.address,
                    remarks: a.remark,
                    insurance: a.otherInsurance,
                    activity: a.otherActivity,
                    gift: a.otherGift,
                    follow_record: a.otherNotes,
                },
                family: {
                    name: a.spouseName,
                    birth_gong: a.spouseBirthday,
                    birth_nong: a.spouseLunarBirthday,
                    is_smoking: '是' == a.spouseSmockFlag ? 1 : 0,
                    is_drink: '是' == a.spouseDrinkFlag ? 1 : 0,
                    health: a.spouseBodyStatus,
                    is_security: '有' == a.spouseSocial ? 1 : 0,
                    hometown: a.spouseHometown,
                    industry: a.spouseIndustryFlag,
                    interest: a.spouseHobby,
                    annual_income: a.spouseYearSalary,
                    address: a.spouseAddress,
                    remarks: a.spouseRemark,
                },
                real_estate: {
                    name: a.realEstateName,
                    area: a.realEstateArea,
                    supply: a.realEstateMonth
                },
                liabilities: {
                    name: a.liabilitiesProject,
                    amount: a.liabilitiesMoney,
                },
                car: {
                    brand: a.carBrand,
                    restricted_date: a.caRestrictionDay,
                    insurance_date: a.carInsuranceDay,
                    remarks: a.carRemark
                },
                investment: {
                    name: a.financeProduct,
                    shares: a.financeShares,
                    futures: a.financeGoods,
                    stock_right: a.financePower
                },
                id: a.customerId
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
            }else{
                wx.showModal({
                    title: '失败',
                    content: result.msg,
                    showCancel: !1,
                })
            }
        })
    },
    /**
     * 处理要重新显示出的数据
     */
    showReloadData(){
        const a = this.data.customerInfo
        this.setData({
            myName: a.name,
            MyBirthday: a.birth_gong,
            lunarBirthday: a.birth_nong,
            mySmockFlag: 1==a.is_smoking?'是':'否',
            myDrinkFlag: 1==a.is_drink?'是':'否',
            bodyStatus: a.health,
            Social: 1==a.is_security?'有':'无',
            myHometown: a.hometown,
            industryFlag: a.industry,
            companyName: a.corporate_name,
            companyJob: a.duties,
            companyAddr: a.corporate_address,
            hobby: a.interest,
            yearSalary: a.annual_income,
            address: a.address,
            remark: a.remarks,
            otherInsurance: a.insurance,
            otherActivity: a.activity,
            otherGift: a.gift,
            otherNotes: a.follow_record,
        })
        // 家庭成员
        if (a.family && Object.keys(a.family).length>0){
            const f = a.family
            this.setData({
                spouseName: f.name,
                spouseBirthday: f.birth_gong,
                spouseLunarBirthday: f.birth_nong,
                spouseSmockFlag: 1==f.is_smoking?'是':'否',
                spouseDrinkFlag: 1==f.is_drink?'是':'否',
                spouseBodyStatus: f.health,
                spouseSocial: 1==f.is_security?'有':'无',
                spouseHometown: f.hometown,
                spouseIndustryFlag: f.industry,
                spouseHobby: f.interest,
                spouseYearSalary: f.annual_income,
                spouseAddress: f.address,
                spouseRemark: f.remarks
            })
        }
        // 不动产
        if (a.real_estate && Object.keys(a.real_estate).length>0){
            const r = a.real_estate
            this.setData({
                realEstateArea: r.area,
                realEstateName: r.name,
                realEstateMonth: r.supply
            })
        }
        // 车辆信息
        if (a.car &&　Object.keys(a.car).length>0){
            const c = a.car
            this.setData({
                carBrand: c.brand,
                caRestrictionDay: c.restricted_date,
                carInsuranceDay: c.insurance_date,
                carRemark: c.remarks
            })
        }
        // 负债信息
        if (a.liabilities &&　Object.keys(a.liabilities).length>0){
            const liab = a.liabilities
            this.setData({
                liabilitiesProject: liab.name,
                liabilitiesMoney: liab.amount
            })
        }
        // 金融信息
        if (a.investment &&　Object.keys(a.investment).length>0){
            const inv = a.investment
            this.setData({
                financeProduct: inv.name,
                financeShares: inv.shares,
                financeGoods: inv.futures,
                financePower: inv.stock_right
            })
        }
    },
    /**
     * 立即提交
     */
    submitNow() {
        const a = this.data
        /**
         * 本人公历生日
         * @param s
         */
        const getBirthDay = s => {
            return s.split('-').join('')
        }
        wx.showLoading({
            title: '提交中',
            mask: !0
        }), app.util.req({
            url: 'setCustomerInfo',
            method: 'POST',
            data: {
                customer: {
                    user_id: wx.getStorageSync('user_info').id,
                    name: a.myName,
                    birth_gong: getBirthDay(a.MyBirthday),
                    birth_nong: a.lunarBirthday,
                    is_smoking: '是' == a.mySmockFlag ? 1 : 0,
                    is_drink: '是' == a.myDrinkFlag ? 1 : 0,
                    health: a.bodyStatus,
                    is_security: '是' == a.Social ? 1 : 0,
                    hometown: a.myHometown,
                    industry: a.industryFlag,
                    corporate_name: a.companyName,
                    duties: a.companyJob,
                    corporate_address: a.companyAddr,
                    interest: a.hobby,
                    annual_income: a.yearSalary,
                    address: a.address,
                    remarks: a.remark,
                    insurance: a.otherInsurance,
                    activity: a.otherActivity,
                    gift: a.otherGift,
                    follow_record: a.otherNotes,
                },
                family: {
                    name: a.spouseName,
                    birth_gong: a.spouseBirthday,
                    birth_nong: a.spouseLunarBirthday,
                    is_smoking: '是' == a.spouseSmockFlag ? 1 : 0,
                    is_drink: '是' == a.spouseDrinkFlag ? 1 : 0,
                    health: a.spouseBodyStatus,
                    is_security: '有' == a.spouseSocial ? 1 : 0,
                    hometown: a.spouseHometown,
                    industry: a.spouseIndustryFlag,
                    interest: a.spouseHobby,
                    annual_income: a.spouseYearSalary,
                    address: a.spouseAddress,
                    remarks: a.spouseRemark,
                },
                real_estate: {
                    name: a.realEstateName,
                    area: a.realEstateArea,
                    supply: a.realEstateMonth
                },
                liabilities: {
                    name: a.liabilitiesProject,
                    amount: a.liabilitiesMoney,
                },
                car: {
                    brand: a.carBrand,
                    restricted_date: a.caRestrictionDay,
                    insurance_date: a.carInsuranceDay,
                    remarks: a.carRemark
                },
                investment: {
                    name: a.financeProduct,
                    shares: a.financeShares,
                    futures: a.financeGoods,
                    stock_right: a.financePower
                },
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
            }else{
                wx.showModal({
                    title: '失败',
                    content: result.msg,
                    showCancel: !1,
                })
            }
        })
    },
    onChangeColl(event) {
        this.setData({
            activeNames: event.detail,
        });
    },
    // 输入内容在此
    onChangeData(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            // 农历生日
            this.setData({
                lunarBirthday: e.detail
            })
        } else if ('2' == f) {
            // 身体状况
            this.setData({
                bodyStatus: e.detail
            })
        } else if ('3' == f) {
            // 行业
            this.setData({
                industryFlag: e.detail
            })
        } else if ('4' == f) {
            // 兴趣爱好
            this.setData({
                hobby: e.detail
            })
        } else if ('5' == f) {
            // 年收入(万)
            this.setData({
                yearSalary: e.detail
            })
        } else if ('6' == f) {
            // 住址
            this.setData({
                address: e.detail
            })
        } else if ('7' == f) {
            // 备注
            this.setData({
                remark: e.detail
            })
        } else if ('8' == f) {
            // 配偶农历生日
            this.setData({
                spouseLunarBirthday: e.detail
            })
        } else if ('9' == f) {
            // 配偶身体
            this.setData({
                spouseBodyStatus: e.detail
            })
        } else if ('10' == f) {
            // 配偶行业
            this.setData({
                spouseIndustryFlag: e.detail
            })
        } else if ('11' == f) {
            // 配偶兴趣爱好
            this.setData({
                spouseHobby: e.detail
            })
        } else if ('12' == f) {
            // 配偶年收入
            this.setData({
                spouseYearSalary: e.detail
            })
        } else if ('13' == f) {
            // 配偶住址
            this.setData({
                spouseAddress: e.detail
            })
        } else if ('14' == f) {
            // 配偶备注
            this.setData({
                spouseRemark: e.detail
            })
        } else if ('15' == f) {
            // 不动产面积
            this.setData({
                realEstateArea: e.detail
            })
        } else if ('16' == f) {
            // 不动产名称
            this.setData({
                realEstateName: e.detail
            })
        } else if ('17' == f) {
            // 不动产月供
            this.setData({
                realEstateMonth: e.detail
            })
        } else if ('18' == f) {
            // 负债项目
            this.setData({
                liabilitiesProject: e.detail
            })
        } else if ('19' == f) {
            // 负债金额
            this.setData({
                liabilitiesMoney: e.detail
            })
        } else if ('20' == f) {
            // 车辆品牌
            this.setData({
                carBrand: e.detail
            })
        } else if ('21' == f) {
            // 车辆限行日期
            this.setData({
                caRestrictionDay: e.detail
            })
        } else if ('22' == f) {
            // 车辆备注
            this.setData({
                carRemark: e.detail
            })
        } else if ('23' == f) {
            // 金融-理财产品
            this.setData({
                financeProduct: e.detail
            })
        } else if ('24' == f) {
            // 金融-股票
            this.setData({
                financeShares: e.detail
            })
        } else if ('25' == f) {
            // 金融-期货
            this.setData({
                financeGoods: e.detail
            })
        } else if ('26' == f) {
            // 金融-股权
            this.setData({
                financePower: e.detail
            })
        } else if ('27' == f) {
            // 其他-保险
            this.setData({
                otherInsurance: e.detail
            })
        } else if ('28' == f) {
            // 其他-活动
            this.setData({
                otherActivity: e.detail
            })
        } else if ('29' == f) {
            // 其他-礼物
            this.setData({
                otherGift: e.detail
            })
        } else if ('30' == f) {
            // 其他-跟进记录
            this.setData({
                otherNotes: e.detail
            })
        } else if ('31' == f) {
            // 其他-备注
            this.setData({
                otherRemark: e.detail
            })
        } else if ('32' == f) {
            // 补充-姓名
            this.setData({
                myName: e.detail
            })
        } else if ('33' == f) {
            // 补充-老家
            this.setData({
                myHometown: e.detail
            })
        } else if ('34' == f) {
            // 补充-本人-公司名称
            this.setData({
                companyName: e.detail
            })
        } else if ('35' == f) {
            // 补充-本人-公司职务
            this.setData({
                companyJob: e.detail
            })
        } else if ('36' == f) {
            // 补充-本人-公司地址
            this.setData({
                companyAddr: e.detail
            })
        } else if ('37' == f) {
            // 补充-家庭-姓名
            this.setData({
                spouseName: e.detail
            })
        } else if ('38' == f) {
            // 补充-家庭-老家
            this.setData({
                spouseHometown: e.detail
            })
        }
    },
    // 有无社保
    showMySocialModal(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            wx.showActionSheet({
                itemList: ['有', '无'],
                success: res => {
                    this.setData({
                        Social: '0' == res.tapIndex ? '有' : '无'
                    })
                },
                fail: err => {
                    console.log(err.errMsg)
                }
            })
        } else if ('2' == f) {
            // 配偶
            wx.showActionSheet({
                itemList: ['有', '无'],
                success: res => {
                    this.setData({
                        spouseSocial: '0' == res.tapIndex ? '有' : '无'
                    })
                },
                fail: err => {
                    console.log(err.errMsg)
                }
            })
        }
    },
    // 展示出生日期选择框
    showMyBirthdayModal(e) {
        const {f} = e.currentTarget.dataset
        this.setData({
            myBirthdayModalVisible: !0,
            birthdayModalFlag: f
        })
    },
    // 选择是否抽烟
    showMySmockModal(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            wx.showActionSheet({
                itemList: ['是', '否'],
                success: res => {
                    this.setData({
                        mySmockFlag: '0' == res.tapIndex ? '是' : '否'
                    })
                },
                fail: err => {
                    console.log(err.errMsg)
                }
            })
        } else if ('2' == f) {
            // 配偶
            wx.showActionSheet({
                itemList: ['是', '否'],
                success: res => {
                    this.setData({
                        spouseSmockFlag: '0' == res.tapIndex ? '是' : '否'
                    })
                },
                fail: err => {
                    console.log(err.errMsg)
                }
            })
        }
    },
    // 选择是否喝酒
    showDrinkModal(e) {
        const {f} = e.currentTarget.dataset
        if ('1' == f) {
            wx.showActionSheet({
                itemList: ['是', '否'],
                success: res => {
                    this.setData({
                        myDrinkFlag: '0' == res.tapIndex ? '是' : '否'
                    })
                },
                fail: err => {
                    console.log(err.errMsg)
                }
            })
        } else if ('2' == f) {
            wx.showActionSheet({
                itemList: ['是', '否'],
                success: res => {
                    this.setData({
                        spouseDrinkFlag: '0' == res.tapIndex ? '是' : '否'
                    })
                },
                fail: err => {
                    console.log(err.errMsg)
                }
            })
        }
    },
    // 选择出生日期
    onConfirmMyBirthday(e) {
        if ('1' == this.data.birthdayModalFlag) {
            this.setData({
                MyBirthday: app.formatTimestap(e.detail),
            })
        } else if ('2' == this.data.birthdayModalFlag) {
            this.setData({
                spouseBirthday: app.formatTimestap(e.detail),
            })
        } else if ('3' == this.data.birthdayModalFlag) {
            // 车险日期
            this.setData({
                carInsuranceDay: app.formatTimestap(e.detail),
            })
        }
        this.setData({
            myBirthdayModalVisible: !1,
        })
    },
    onCloseMyBirthdayModal() {
        this.setData({
            myBirthdayModalVisible: !1
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