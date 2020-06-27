const QQMapWX = require('../../../utils/qqmap-wx-jssdk.min');
let qqmapsdk;
const app = getApp()
const regexPhone = /^\d{11}$/
Page({

    /**
     * 页面的初始数据
     */
    data: {
        streetName: '',
        communityName: '',
        houseName: '',
        houseType: '点击选择',
        houseTypeValue: '',
        modalVisible: !1,
        houseTypeArr: ['公房', '私房'],
        landlordGender: '拍照或者上传身份证图片',
        landlordGenderValue: '',
        modal2Visible: !1,
        genderArr: ['男', '女'],
        landlordNation: '',
        landlordIdcard: '',
        landlordName: '',
        phone: '',
        houseNumber: '',
        houseAddress: '',
        houseNum2: '',
        houseSelectionNum: '',
        houseFloorNum: '',
        canquanType: '点击选择',
        canquanTypeValue: '0',
        modal3Visible: !1,
        canquanArr: ['商品房', '经济适用房', '集资建房', '房改房', '农权房', '自建房', '廉租房', '其他'],
        addressVisible: !1,
        communityVisible: !1,
        houseJieGou: ['框架', '砖混', '砖木', '土木', '其他'],
        modal4Visible: !1,
        houseArea: '',
        houseJiegou: '点击选择',
        houseJiegouValue: '',
        fileList: [],
        fileList2: [],

        HukouTxt: '点击选择',
        HukouTxtValue: -1,
        hukouVisible: !1,
        hukouArr: ['农业', '非农业'],
        confirmJiuYeTxt: '点击选择',
        confirmJiuYeTxtValue: -1,
        jiuYeVisible: !1,
        jiuYeArr: ['是', '否'],
        remark: '',

        jiuYeCompany: '', // 就业单位
        jiuYeCompanyPhone: '', // 就业单位电话
        jiuYeCompanyAddr: '', // 就业单位地址
        personAllList: [],
        relactionShipVisible: !1,
        relationshipArr: ['夫妻', '亲属', '朋友'],
        // relationshipArr: ['夫妻', '朋友', '同事', '子女', '父母'],

        showJiuyeItem: !0, // 是否显示就业信息的填写
        removeFlag: !0,// 是否保存数据
        reloadFlag: !0,

        personHukouVisible: !1,
        personisCompanyVisible: !1,
        actions: [
            {
                name: '农业'
            },
            {
                name: '非农业'
            }
        ],
        actions2: [
            {
                name: '是'
            },
            {
                name: '否'
            }
        ]
    },
    onClosePersonHukou(){
        this.setData({
            personHukouVisible:!1
        })
    },
    onClosePersonIsCompany(){
        this.setData({
            personisCompanyVisible:!1
        })
    },
    onSelect(e){
        const {personAllList} = this.data
        personAllList[this.data.currentIndexPerson].household.text=e.detail.name
        personAllList[this.data.currentIndexPerson].household.value='农业'==e.detail.name? 1: 2
        this.setData({personAllList})
    },
    onSelect2(e){
        const {personAllList} = this.data
        personAllList[this.data.currentPersonIsCompanyIndex].isCompany='是'==e.detail.name? !0: !1
        this.setData({personAllList})
    },
    selectPersonIsCompany(e){
        this.setData({
            currentPersonIsCompanyIndex: e.currentTarget.dataset.idx,
            personisCompanyVisible: !0
        })
    },
    changePhone(e) {
        this.setData({
            phone: e.detail.replace(/\s*/g, "")
        })
    },
    changeJiuYeCompany(e) {
        this.setData({
            jiuYeCompany: e.detail.replace(/\s*/g, "")
        })
    },
    changeJiuYeCompanyPhone(e) {
        this.setData({
            jiuYeCompanyPhone: e.detail.replace(/\s*/g, "")
        })
    },
    changeJiuYeCompanyAddr(e) {
        this.setData({
            jiuYeCompanyAddr: e.detail.replace(/\s*/g, "")
        })
    },
    changeRemark(e) {
        this.setData({
            remark: e.detail.replace(/\s*/g, "")
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(options.data);
        options.id && this.setData({
            idNum: options.id
        })
        if (options.data && options.flag && '1' == options.flag) {
            console.log('ok1');
            this.setData({
                houseData: JSON.parse(options.data),
                reloadFlag: !0,
            })
        } else if (options.data && options.flag && '2' == options.flag) {
            console.log('ok2');
            this.setData({
                reloadFlag: !1,
            })
            const data = JSON.parse(options.data)
            console.log(data,'----返回数据---');
            this.setData({
                tenantId: data.tenantId
            })
            const companyArr = []
            function formatData(s) {
                if (1 == s) {
                    return '夫妻'
                } else if (2 == s) {
                    return '朋友'
                } else if (3 == s) {
                    return '同事'
                } else if (4 == s) {
                    return '子女'
                } else if (5 == s) {
                    return '父母'
                } else {
                    return ''
                }
            }
            const formatHukou = (s)=>{
                if (1==s){
                    return '农业'
                }else if (2==s){
                    return '非农业'
                }
            }
            const formatEmopy = (s)=>{
                if (1==s){
                    return !0
                }else if (2==s){
                    return !1
                }
            }
            if (data.accompany && data.accompany.length > 0) {
                for (let i = 0; i < data.accompany.length; i++) {
                    companyArr.push({
                        name: data.accompany[i].accompanyName,
                        idCard: data.accompany[i].accompanyIdNo,
                        gender: '1' == data.accompany[i].accompanyGender ? "男" : "女",
                        nation: data.accompany[i].accompanyNation,
                        phone: data.accompany[i].accompanyTel,
                        household: {
                            text: formatHukou(data.accompany[i].accompanyRegType),
                            value: data.accompany[i].accompanyRegType
                        },
                        isCompany: formatEmopy(data.accompany[i].employment),
                        companyName: data.accompany[i].companyName,
                        companyPhone: data.accompany[i].companyTel,
                        companyAddr: data.accompany[i].companyAddr,
                        idPic: [{
                            url: `${app.imgUrl2}${data.accompany[i].accompanyIdPic}`
                        }],
                        idPicBack: [{
                            url: `${app.imgUrl2}${data.accompany[i].accompanyIdPicBack}`
                        }],
                        relationship: {
                            text: formatData(data.accompany[i].relation),
                            value: data.accompany[i].relation
                        }
                    })
                }
            }
            this.setData({
                landlordName: data.tenantName || '',
                landlordIdcard: data.tenantIdNo || '',
                landlordGender: 1 == data.tenantGender ? '男' : '女',
                landlordGenderValue: data.tenantGender,
                landlordNation: data.tenantNation,
                phone: data.tenantTel,
                houseData: {
                    street: data.street,
                    community: data.community,
                    neighborhood: data.neighborhood,
                    houseAddr: data.houseAddr,
                    buildNo: data.buildNo,
                    unitNo: data.unitNo,
                    roomNo: data.roomNo,
                    organNo: data.organNo
                },
                idNum: data.lRecordNo,
                HukouTxt: 1 == data.tenantRegType ? '农业' : '非农业',
                HukouTxtValue: Number(data.tenantRegType) - 1,
                confirmJiuYeTxt: 1 == data.employment ? '是' : '否',
                confirmJiuYeTxtValue: Number(data.employment) - 1,
                showJiuyeItem: 1 == data.employment ? !0 : !1,
                jiuYeCompany: data.companyName,
                jiuYeCompanyPhone: data.companyTel,
                jiuYeCompanyAddr: data.companyAddr,
                remark: data.remark,
                declareTime: data.declareTime,
                recordTime1: data.recordTime1,
                recordTime2: data.recordTime2,
                personAllList: companyArr,
                fileList: [{
                    url: data.idPic
                }],
                fileList2: [{
                    url: data.idPicBack
                }]
            })
        }
        if (!app._isNull(wx.getStorageSync('tenantInfo')) && options.flag == '1') {
            const data = wx.getStorageSync('tenantInfo')
            const getGender = (e)=>{
                if (1==e){
                    return '男'
                }else if (2==e){
                    return '女'
                }else{
                    return '拍照或者上传身份证图片'
                }
            }
            const getHukou = (e)=>{
                if (0==e){
                    return '农业'
                }else if (1==e){
                    return '非农业'
                }else {
                    return ''
                }
            }
            this.setData({
                landlordName: data.landlordName || '',
                landlordIdcard: data.landlordIdcard || '',
                landlordGender: getGender(data.landlordGenderValue),
                landlordGenderValue: data.landlordGenderValue,
                landlordNation: data.landlordNation,
                phone: data.phone,
                // houseData:{
                //     street: data.street,
                //     community: data.community,
                //     neighborhood: data.neighborhood,
                //     houseAddr: data.houseAddr,
                //     buildNo: data.buildNo,
                //     unitNo: data.unitNo,
                //     roomNo: data.roomNo,
                // },
                HukouTxt:getHukou(data.HukouTxtValue),
                HukouTxtValue: data.HukouTxtValue,
                confirmJiuYeTxt: 0 == data.confirmJiuYeTxtValue ? '是' : '否',
                confirmJiuYeTxtValue: Number(data.confirmJiuYeTxtValue),
                showJiuyeItem: 0 == Number(data.confirmJiuYeTxtValue) ? !0 : !1,
                jiuYeCompany: data.jiuYeCompany,
                jiuYeCompanyPhone: data.jiuYeCompanyPhone,
                jiuYeCompanyAddr: data.jiuYeCompanyAddr,
                remark: data.remark,
                fileList: data.fileList,
                fileList2: data.fileList2,
                personAllList: data.personAllList
            })
        }

    },
    showJiYeViable() {
        this.setData({
            jiuYeVisible: !0
        })
    },
    // 删除条目
    deletePerson(e) {
        const {personAllList = []} = this.data
        personAllList.splice(e.currentTarget.dataset.idx, 1)
        this.setData({personAllList})
    },
    // 增加同住人
    addPerson() {
        const {personAllList = []} = this.data
        personAllList.unshift({
            name: '',
            idCard: '',
            gender: '',
            nation: '',
            phone: '',
            household: {
                text: '点击选择',
                value: 0
            },
            isCompany: !0,
            companyName: '',
            companyPhone: '',
            companyAddr: '',
            idPic: [],
            idPicBack: [],
            relationship: {
                text: '点击选择',
                value: 0
            }
        })
        this.setData({personAllList})
    },
    onChangePerson(e){
        const {f, idx} = e.currentTarget.dataset
        const {personAllList = []} = this.data
        if ('1'==f){
            personAllList[idx].phone = e.detail.replace(/\s*/g,"")
        }else if ('2'==f){
            personAllList[idx].companyName = e.detail.replace(/\s*/g,"")
        }else if ('3'==f){
            personAllList[idx].companyPhone = e.detail.replace(/\s*/g,"")
        }else if ('4'==f){
            personAllList[idx].companyAddr = e.detail.replace(/\s*/g,"")
        }
        this.setData({personAllList})
    },
    selectPersonHukou(e){
        this.setData({
            currentIndexPerson: e.currentTarget.dataset.idx,
            personHukouVisible: !0
        })
    },
    personAfterRead(e){
        const {flag, index} = e.currentTarget.dataset
        const {personAllList} = this.data
        const {file} = e.detail;
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        wx.uploadFile({
            url: app.siteInfo.api + 'upload_pic',
            filePath: file.path,
            name: 'pic',
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                token: app.token,
            },
            success: res => {
                // 上传完成需要更新 fileList
                const data = JSON.parse(res.data)
                // console.log(data);
                if ('1' == flag) {
                    personAllList[index].idPic.push({url: data.data[0]})
                } else if ('2' == flag) {
                    personAllList[index].idPicBack.push({url: data.data[0]})
                }
                this.setData({personAllList});
            }
        });
    },
    deletePersonImg(e){
        const {flag, index} = e.currentTarget.dataset
        const {personAllList} = this.data
        if ('1'==flag){
            personAllList[index].idPic.splice(index, 1)
        }else if ('2'==flag){
            personAllList[index].idPicBack.splice(index, 1)
        }
        this.setData({personAllList});
    },
    closeJiuYe() {
        this.setData({
            jiuYeVisible: !1
        })
    },
    // 选择关系
    showSelectShip(e) {
        this.setData({
            relactionShipVisible: !0,
            shipCurrentIndex: e.currentTarget.dataset.idx
        })
    },
    onConfirmShip(e) {
        const {index, value} = e.detail
        const {personAllList = []} = this.data
        personAllList[this.data.shipCurrentIndex].relationship.text = value
        personAllList[this.data.shipCurrentIndex].relationship.value = index + 1
        this.setData({personAllList})
        this.closeShip()
    },
    closeShip() {
        this.setData({
            relactionShipVisible: !1
        })
    },
    // 就业选择
    onConfirmJiyYe(e) {
        const {index, value} = e.detail
        this.setData({confirmJiuYeTxt: value, confirmJiuYeTxtValue: index})
        if (0 == index) {
            this.setData({
                showJiuyeItem: !0
            })
        } else if (1 == index) {
            this.setData({
                showJiuyeItem: !1
            })
        }
        this.closeJiuYe()
    },
    // 确定户口
    onConfirmHukou(e) {
        const {index, value} = e.detail
        this.setData({HukouTxt: value, HukouTxtValue: index})
        this.closeHukou()
    },
    // 开始
    startdd() {
        wx.chooseImage({
            sourceType: ['camera', 'album'],
            success: res3 => {
                console.log(res3);
                wx.showLoading({
                    title: '识别中',
                    mask: !0
                })
                wx.getFileSystemManager().readFile({
                    filePath: res3.tempFilePaths[0],
                    encoding: 'base64',
                    success: res => {
                        wx.request({
                            url: "https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json",
                            data: {
                                "image": res.data,
                                'configure': {
                                    side: 'face'
                                }
                            },
                            header: {
                                Authorization: 'APPCODE ed3c5fd3ff7b4621a9bc18a4960f81aa'
                            },
                            method: 'POST',
                            dataType: 'json',
                            responseType: 'text',
                            success: res2 => {
                                if (200 == res2.statusCode) {
                                    this.setData({
                                        landlordName: res2.data.name,
                                        landlordIdcard: res2.data.num,
                                        landlordGender: res2.data.sex,
                                        landlordGenderValue: '男' == res2.data.sex ? '1' : '2',
                                        landlordNation: res2.data.nationality,
                                        userinfo: {
                                            name: res2.data.name,
                                            idCard: res2.data.num,
                                            gender: res2.data.sex,
                                            nation: res2.data.nationality
                                        }
                                    })
                                } else {
                                    wx.showModal({
                                        title: '提示',
                                        content: '您拍摄的图片无法识别, 请重新拍摄',
                                        showCancel: !1
                                    })
                                }
                            },
                            fail: error => {
                                console.log('请求失败', error);
                            },
                            complete: () => {
                                wx.hideLoading()
                            }
                        })
                    },
                    fail: err1 => {
                        console.log('读取文件失败: ', err1);
                    }
                })
            }
        });

    },
    startdd2(e) {
        const {idx} = e.currentTarget.dataset
        const {personAllList = []} = this.data
        wx.chooseImage({
            sourceType: ['camera', 'album'],
            success: res3 => {
                console.log(res3);
                wx.showLoading({
                    title: '识别中',
                    mask: !0
                })
                wx.getFileSystemManager().readFile({
                    filePath: res3.tempFilePaths[0],
                    encoding: 'base64',
                    success: res => {
                        wx.request({
                            url: "https://dm-51.data.aliyun.com/rest/160601/ocr/ocr_idcard.json",
                            data: {
                                "image": res.data,
                                'configure': {
                                    side: 'face'
                                }
                            },
                            header: {
                                Authorization: 'APPCODE ed3c5fd3ff7b4621a9bc18a4960f81aa'
                            },
                            method: 'POST',
                            dataType: 'json',
                            responseType: 'text',
                            success: res2 => {
                                if (200 == res2.statusCode) {
                                    // this.setData({
                                    //     landlordName: res2.data.name,
                                    //     landlordIdcard: res2.data.num,
                                    //     landlordGender: res2.data.sex,
                                    //     landlordGenderValue: '男'==res2.data.sex? '1':'2',
                                    //     landlordNation: res2.data.nationality,
                                    //     userinfo: {
                                    //         name: res2.data.name,
                                    //         idCard: res2.data.num,
                                    //         gender: res2.data.sex,
                                    //         nation: res2.data.nationality
                                    //     }
                                    // })
                                    personAllList[idx].name = res2.data.name
                                    personAllList[idx].idCard = res2.data.num
                                    personAllList[idx].gender = res2.data.sex
                                    personAllList[idx].nation = res2.data.nationality
                                    this.setData({personAllList})
                                } else {
                                    wx.showModal({
                                        title: '提示',
                                        content: '您拍摄的图片无法识别, 请重新拍摄',
                                        showCancel: !1
                                    })
                                }
                            },
                            fail: error => {
                                console.log('请求失败', error);
                            },
                            complete: () => {
                                wx.hideLoading()
                            }
                        })
                    },
                    fail: err1 => {
                        console.log('读取文件失败: ', err1);
                    }
                })
            }
        });

    },

    // 户口选择
    showHukouchoose() {
        this.setData({
            hukouVisible: !0
        })
    },

    closeHukou() {
        this.setData({
            hukouVisible: !1
        })
    },

    // 实例化API核心类
    loadQQMap() {
        qqmapsdk = new QQMapWX({
            key: 'OMCBZ-KSQCP-SEAD3-LJFZ5-MXCOH-X4BYI'
        });
    },

    onCloseModal4() {
        this.setData({modal4Visible: !1})
    },
    showModal4() {
        this.setData({modal4Visible: !0})
    },
    onConfirmHouseJieGou(e) {
        const {index, value} = e.detail
        this.setData({houseJiegou: value, houseJiegouValue: index})
        this.onCloseModal4()
    },
    // 获取我的经纬度
    loadMyLoaction() {
        wx.getLocation({
            success: res => {
                this.setData({
                    location: res.latitude + ',' + res.longitude
                })
            }, fail: error => {
                console.log('获取经纬度失败', error);
            }
        })
    },
    afterRead(event) {
        const {file} = event.detail;
        const {flag} = event.currentTarget.dataset
        // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
        console.log(file);
        wx.uploadFile({
            url: app.siteInfo.api + 'upload_pic',
            filePath: file.path,
            name: 'pic',
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                token: app.token,
            },
            success: res => {
                // 上传完成需要更新 fileList
                const data = JSON.parse(res.data)
                // console.log(data);
                const {fileList = [], fileList2 = []} = this.data;
                if ('1' == flag) {
                    fileList.push({...file, url: data.data[0]});
                    this.setData({fileList});
                } else if ('2' == flag) {
                    fileList2.push({...file, url: data.data[0]});
                    this.setData({fileList2});
                }
            }
        });
    },
    // 输入信息
    onChangeInfo(e) {
        const {flag} = e.currentTarget.dataset
        if ('1' == flag) this.setData({streetName: e.detail.replace(/\s*/g, "")})
        if ('2' == flag) this.setData({communityName: e.detail.replace(/\s*/g, "")})
    },
    onCloseModal() {
        this.setData({modalVisible: !1})
    },
    onCloseModal2() {
        this.setData({modal2Visible: !1})
    },
    onCloseModal3() {
        this.setData({modal3Visible: !1})
    },
    // 选择房屋性质
    onConfirmHouseType(e) {
        const {index, value} = e.detail
        this.setData({houseType: value, houseTypeValue: index})
        this.onCloseModal()
    },
    // 产权类型
    onConfirmcanquanType(e) {
        const {index, value} = e.detail
        this.setData({canquanType: value, canquanTypeValue: index})
        this.onCloseModal3()
    },
    showModal2() {
        this.setData({modal2Visible: !0})
    },
    showModal3() {
        this.setData({modal3Visible: !0})
    },
    // 性别
    onConfirmlandlordGender(e) {
        const {index, value} = e.detail
        this.setData({landlordGender: value, landlordGenderValue: index})
        this.onCloseModal2()
    },
    // 显示模态框
    showModal() {
        this.setData({modalVisible: !0})
    },
    // 提交
    formSubmit(ee) {
        const verifyTxt = this.verifyData(ee.detail.value)
        if ('' != verifyTxt) {
            wx.showModal({
                title: '提示',
                content: verifyTxt,
                showCancel: !1,
            })
            return
        }
        const e = ee.detail.value
        const {fileList, fileList2} = this.data
        const url = fileList[0].url
        const url2 = fileList2[0].url
        let startIdx = url.lastIndexOf('/')
        let startIdx2 = url2.lastIndexOf('/')
        let idPic = url.substring(startIdx + 1, url.length)
        let idPic2 = url2.substring(startIdx2 + 1, url2.length)
        // let idPic2=
        // 处理同住人信息
        const acccompanyList = []
        const {personAllList = []} = this.data
        for (let item of personAllList) {
            const url = item.idPic[0].url
            const url2 = item.idPicBack[0].url
            let startIdx = url.lastIndexOf('/')
            let startIdx2 = url2.lastIndexOf('/')
            let idPic = url.substring(startIdx + 1, url.length)
            let idPic2 = url2.substring(startIdx2 + 1, url2.length)
            acccompanyList.push({
                accompanyName: item.name,
                accompanyIdNo: item.idCard,
                accompanyGender: '男' == item.gender ? 1 : 2,
                accompanyNation: item.nation,
                relation: Number(item.relationship.value),

                accompanyTel: item.phone,
                accompanyRegType: item.household.value,
                employment: !0==item.isCompany?1: 2,
                companyName: item.companyName,
                companyTel: item.companyPhone,
                companyAddr: item.companyAddr,
                accompanyIdPic: idPic,
                accompanyIdPicBack: idPic2,

            })
        }
        if (!this.data.reloadFlag){
            // 重新提交
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.util.req({
                url: 'upd_tenant_declare',
                method: 'POST',
                data: {
                    createId: wx.getStorageSync('user_id') || '',
                    token: app.token,
                    lRecordNo: this.data.idNum, // 租赁许可证号
                    declareDate: app.forMatCurrentTime(),
                    organNo: this.data.houseData.organNo || '',
                    street: this.data.houseData.street,
                    community: this.data.houseData.community,
                    neighborhood: this.data.houseData.neighborhood,
                    tenantId: this.data.tenantId,
                    tenantName: this.data.landlordName,
                    tenantIdNo: this.data.landlordIdcard,
                    tenantGender: this.data.landlordGenderValue,
                    tenantNation: this.data.landlordNation,
                    tenantTel: e.phone,
                    tenantRegType: Number(this.data.HukouTxtValue) + 1,
                    employment: Number(this.data.confirmJiuYeTxtValue) + 1,
                    companyName: e.jiuYeCompany,
                    companyTel: e.jiuYeCompanyPhone,
                    companyAddr: e.jiuYeCompanyAddr,
                    remark: e.remark,
                    idPic: idPic,
                    idPicBack: idPic2,
                    accompany: acccompanyList,
                    tenantState: 2
                }
            }).then(res => {
                wx.hideLoading()
                const data = res.data
                console.log(data);
                if ('0' == data.err_code) {
                    this.setData({
                        removeFlag: !1
                    })
                    wx.removeStorageSync('tenantInfo')
                    wx.showModal({
                        title: '提示',
                        content: data.err_msg,
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
                        content: data.err_msg,
                        showCancel: !1
                    })
                }
            })
        }else{
            // 新增
            wx.showLoading({
                title: '加载中',
                mask: !0
            }), app.util.req({
                url: 'upd_tenant_declare',
                method: 'POST',
                data: {
                    createId: wx.getStorageSync('user_id') || '',
                    token: app.token,
                    lRecordNo: this.data.idNum, // 租赁许可证号
                    declareDate: app.forMatCurrentTime(),
                    organNo: this.data.houseData.organNo || '',
                    street: this.data.houseData.street,
                    community: this.data.houseData.community,
                    neighborhood: this.data.houseData.neighborhood,

                    tenantName: this.data.landlordName,
                    tenantIdNo: this.data.landlordIdcard,
                    tenantGender: this.data.landlordGenderValue,
                    tenantNation: this.data.landlordNation,
                    tenantTel: e.phone,
                    tenantRegType: Number(this.data.HukouTxtValue) + 1,
                    employment: Number(this.data.confirmJiuYeTxtValue) + 1,
                    companyName: e.jiuYeCompany,
                    companyTel: e.jiuYeCompanyPhone,
                    companyAddr: e.jiuYeCompanyAddr,
                    remark: e.remark,
                    idPic: idPic,
                    idPicBack: idPic2,
                    accompany: acccompanyList,
                    tenantState: 2
                }
            }).then(res => {
                wx.hideLoading()
                const data = res.data
                console.log(data);
                if ('0' == data.err_code) {
                    this.setData({
                        removeFlag: !1
                    })
                    wx.removeStorageSync('tenantInfo')
                    wx.showModal({
                        title: '提示',
                        content: data.err_msg,
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
                        content: data.err_msg,
                        showCancel: !1
                    })
                }
            })
        }
    },

    // 验证信息
    verifyData(e) {
        if ('' == e.streetName) return '街道名称不能为空'
        if ('' == e.communityName) return '社区名称不能为空'
        if ('' == e.houseName) return '小区名称不能为空'
        // if (-1 == this.data.houseTypeValue) return '请选择房屋性质'
        if ('' == e.landlordName) return '房主姓名不能为空'
        if ('' == e.landlordIdcard) return '房主身份证号不能为空'
        if (-1 == this.data.landlordGenderValue) return '请选择性别'
        if ('' == e.landlordNation) return '请输入民族'
        if (!regexPhone.test(e.phone)) return '请填写正确手机号码'
        // if ('' == e.houseNumber) return '请输入房屋产权证号'
        if (-1 == this.data.HukouTxtValue) return '请选择户口类别'
        if ('' == e.houseAddress) return '请输入房屋详细地址'
        if ('' == e.houseFloorNum) return '请输入楼号'
        if ('' == e.houseSelectionNum) return '请输入单元号'
        if ('' == e.houseNum2) return '请输入房号'
        if (-1 == this.data.confirmJiuYeTxtValue) return '请选择是否就业'
        if (0 == this.data.confirmJiuYeTxtValue) {
            if ('' == e.jiuYeCompany) return '请输入就业单位'
            if ('' == e.jiuYeCompanyPhone) return '请输入就业单位电话'
            if ('' == e.jiuYeCompanyAddr) return '请输入就业单位地址'
        }
        if (this.data.fileList.length==0) return '请上传身份证正面照片'
        if (this.data.fileList2.length==0) return '请上传身份证反面照片'
        if (this.data.personAllList.length > 0) {
            const personArr = this.data.personAllList
            for (let item of personArr) {
                if ('' == item.name ||
                    '' == item.idCard ||
                    '' == item.gender ||
                    '' == item.nation ||
                    0 == item.relationship.value ||
                    ''==item.phone ||
                    0==item.household.value  ||
                    0==item.idPic.length ||
                    0==item.idPicBack.length) {
                    return '同住人信息不完整, 请检查'
                    break
                }

                if (item.isCompany){
                    if (''==item.companyName || ''==item.companyPhone || ''==item.companyAddr){
                        return '同住人信息不完整, 请检查'
                        break
                    }
                }
            }
        }
        return ''
    },

    changeone(e) {
        //调用关键词提示接口
        if ('' == e.detail) this.setData({addressVisible: !1})
        qqmapsdk.getSuggestion({
            //获取输入框值并设置keyword参数
            keyword: e.detail, //用户输入的关键词，可设置固定值,如keyword:'KFC'
            //region:'阆中', //设置城市名，限制关键词所示的地域范围，非必填参数
            location: this.data.location,
            success: res => {//搜索成功后的回调
                const sug = []
                for (let i = 0; i < res.data.length; i++) {
                    sug.push({ // 获取返回结果，放到sug数组中
                        title: res.data[i].title,
                        addr: res.data[i].address,
                    });
                }
                this.setData({
                    sugArr: sug,
                    addressVisible: !0
                })
            },
            fail: error => {
                console.error(error);
            }
        });
    },

    deleteImg(e) {
        const {fileList, fileList2} = this.data
        if ('1' == e.currentTarget.dataset.flag) {
            fileList.splice(e.detail.index, 1)
            this.setData({fileList})
        } else if ('2' == e.currentTarget.dataset.flag) {
            fileList2.splice(e.detail.index, 1)
            this.setData({fileList2})
        }

    },

    changeTwo(e) {
        //调用关键词提示接口
        if ('' == e.detail) this.setData({communityVisible: !1})
        qqmapsdk.getSuggestion({
            //获取输入框值并设置keyword参数
            keyword: e.detail, //用户输入的关键词，可设置固定值,如keyword:'KFC'
            //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
            location: this.data.location,
            success: res => {//搜索成功后的回调
                const sug = []
                for (let i = 0; i < res.data.length; i++) {
                    sug.push({ // 获取返回结果，放到sug数组中
                        title: res.data[i].title,
                        addr: res.data[i].address,
                    });
                }
                this.setData({
                    sugArr: sug,
                    communityVisible: !0
                })
            },
            fail: error => {
                console.error(error);
            }
        });
    },
    // 选择地址
    checkAddrResult(e) {
        const {item} = e.currentTarget.dataset
        this.setData({
            streetName: item.title,
            addressVisible: !1
        })
    },
    // 选择地址
    checkAddrResult2(e) {
        const {item} = e.currentTarget.dataset
        this.setData({
            communityName: item.title,
            communityVisible: !1
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
        // 调用接口
        // qqmapsdk.search({
        //     keyword: '街道',
        //     success: function (res) {
        //         console.log(res);
        //     },
        //     fail: function (res) {
        //         console.log(res);
        //     },
        //     complete: function (res) {
        //         console.log(res);
        //     }
        // });

    },

    // 处理数据
    checkData() {
        if (this.data.removeFlag) {
            const obj = {}
            const d = this.data
            obj.street = d.houseData.street
            obj.organNo = d.houseData.organNo
            obj.idNum = d.idNum
            obj.community = d.houseData.community
            obj.neighborhood = d.houseData.neighborhood
            obj.landlordName = d.landlordName
            obj.landlordIdcard = d.landlordIdcard
            obj.landlordGenderValue = d.landlordGenderValue
            obj.landlordNation = d.landlordNation
            obj.phone = d.phone
            obj.HukouTxtValue = d.HukouTxtValue
            obj.houseAddr = d.houseData.houseAddr
            obj.buildNo = d.houseData.buildNo
            obj.unitNo = d.houseData.unitNo
            obj.roomNo = d.houseData.roomNo
            obj.confirmJiuYeTxtValue = d.houseData.confirmJiuYeTxtValue || d.confirmJiuYeTxtValue
            obj.jiuYeCompanyAddr = d.jiuYeCompanyAddr
            obj.showJiuyeItem = d.showJiuyeItem
            obj.jiuYeCompany = d.jiuYeCompany
            obj.jiuYeCompanyPhone = d.jiuYeCompanyPhone
            obj.remark = d.remark
            obj.fileList = d.fileList
            obj.fileList2 = d.fileList2
            obj.personAllList = d.personAllList
            wx.setStorageSync('tenantInfo', obj);
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.checkData()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.checkData()
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