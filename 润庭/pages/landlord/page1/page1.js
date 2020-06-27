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
        houseTypeValue: -1,
        modalVisible: !1,
        houseTypeArr: ['公房', '私房'],
        landlordGender: '点击拍照或者上传身份证图片',
        landlordGenderValue: -1,
        modal2Visible: !1,
        genderArr: ['男', '女'],
        landlordNation: '',
        landlordIdcard: '',
        landlordName: '',
        phone: '',
        houseNumber: '',
        houseAddress: '',
        houseNum2: '',
        houseContract: "",// 购房合同编号
        houseSelectionNum: '',
        houseFloorNum: '',
        canquanType: '点击选择',
        canquanTypeValue: -1,
        modal3Visible: !1,
        canquanArr: ['商品房', '经济适用房', '集资建房', '房改房', '农权房', '自建房', '廉租房', '其他'],
        addressVisible: !1,
        communityVisible: !1,
        houseJieGou: ['框架', '砖混', '砖木', '土木', '其他'],
        modal4Visible: !1,
        houseArea: '',
        houseJiegou: '点击选择',
        houseJiegouValue: -1,
        fileList: [],
        fileList2: [],
        fileList3: [],
        remark: '',
        houseStatus: '点击选择',
        houseStatusValue: -1,
        houseStatusArr: ['已备案', '未审批', '申报通过', '申报失败'],
        modal5Visible: !1,
        communityArr: [],
        streetArr: [],
        fileList4: [],
        removeFlag: !0,// 是否保存数据
        reloadFlag: !0,

        areaName: '点击选择区域',
        areaNameValue: -1,
        areaModalVisbile: !1,
        multiArray: [
            [],
            [],
            []
        ],
        multiIndex: [0, 0, 0],

        // 房屋编号
        houseNumberNo: ''
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // wx.removeStorageSync('navtiveInfo')
        options.info && this.setData({navtiveInfo: JSON.parse(options.info)})
        this.loadOrganNo()
        if (this.data.navtiveInfo) {
            this.setData({
                pageFlag: !1
            })

            this.loadReloadData()
        } else if (!app._isNull(wx.getStorageSync('navtiveInfo'))) {
            this.setData({
                pageFlag: !0
            })
            this.loadNavData()
        }
    },

    /**
     * 存入数据到本地缓存
     */
    checkData() {
        if (this.data.removeFlag) {
            const navtiveInfo = {}
            const d = this.data
            navtiveInfo.buildNo = d.houseFloorNum
            navtiveInfo.community = d.communityName
            navtiveInfo.contractNo = d.houseContract
            navtiveInfo.hostGender = d.landlordGenderValue
            navtiveInfo.hostIdNo = d.landlordIdcard
            navtiveInfo.hostName = d.landlordName
            navtiveInfo.hostNation = d.landlordNation
            navtiveInfo.hostTel = d.phone
            navtiveInfo.houseAddr = d.houseAddress
            navtiveInfo.housePic = d.fileList3
            navtiveInfo.houseType = d.houseTypeValue
            navtiveInfo.idPic = d.fileList
            navtiveInfo.idPicBack = d.fileList4
            navtiveInfo.neighborhood = d.houseName
            navtiveInfo.propertyNo = d.houseNumber
            navtiveInfo.propertyPic = d.fileList2
            navtiveInfo.propertyType = d.canquanTypeValue
            navtiveInfo.remark = d.remark
            navtiveInfo.roomNo = d.houseNum2
            navtiveInfo.strctType = d.houseJiegouValue
            navtiveInfo.street = d.streetName
            navtiveInfo.totalArea = d.houseArea
            navtiveInfo.unitNo = d.houseSelectionNum
            navtiveInfo.organNo = d.organNo
            wx.setStorageSync('navtiveInfo', navtiveInfo);
        }
    },

    /**
     * 读取本地缓存的数据
     */
    loadNavData() {
        const _this = this
        _this.setData({
            reloadFlag: !0
        })
        const data = wx.getStorageSync('navtiveInfo')

        /**
         * 格式化 房屋性质
         * @param s
         * @returns {string|string}
         */
        function forMatHouseType(s) {
            if (-1 != s) {
                return _this.data.houseTypeArr[s]
            } else {
                return '点击选择'
            }
        }

        function forMatHostGender(s) {
            s = Number(s) - 1
            if (-1 != s) {
                return _this.data.genderArr[s]
            } else {
                return '点击拍照或者上传照片'
            }
        }

        function forMatCanquanType(s) {
            if (-1 != s) {
                return _this.data.canquanArr[s]
            } else {
                return '点击选择'
            }
        }

        function forMatHouseJiegou(s) {
            if (-1 != s) {
                return _this.data.houseJieGou[s]
            } else {
                return '点击选择'
            }
        }

        this.setData({
            streetName: data.street || '',
            communityName: data.community || '',
            houseName: data.neighborhood || '',
            houseType: forMatHouseType(data.houseType),
            houseTypeValue: data.houseType,
            landlordName: data.hostName || '',
            landlordIdcard: data.hostIdNo || '',
            landlordGender: forMatHostGender(data.hostGender),
            landlordGenderValue: data.hostGender,
            landlordNation: data.hostNation || '',
            phone: data.hostTel || '',
            houseNumber: data.propertyNo || '',
            houseContract: data.contractNo || '',
            houseAddress: data.houseAddr || '',
            houseFloorNum: data.buildNo || '',
            houseSelectionNum: data.unitNo || '',
            houseNum2: data.roomNo || '',
            canquanType: forMatCanquanType(data.propertyType),
            canquanTypeValue: data.propertyType,
            houseArea: data.totalArea || '',
            houseJiegou: forMatHouseJiegou(data.strctType),
            houseJiegouValue: data.strctType,
            remark: data.remark || '',
            fileList: data.idPic,
            fileList4: data.idPicBack,
            fileList2: data.propertyPic,
            fileList3: data.housePic,
            organNo: data.organNo
        })
    },

    /**
     * 立即搜索房屋编号
     */
    searchHouseNo() {
        const a = this.data
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        // organNo  houseAddr  neighborhood buildNo  unitNo  roomNo clerk
        app.util.req({
            url: 'get_house_no',
            method: 'POST',
            data: {
                token: app.token,
                organNo: a.organNo,
                houseAddr: a.houseAddress,
                neighborhood: a.houseName,
                buildNo: a.houseFloorNum,
                unitNo: a.houseSelectionNum,
                roomNo: a.houseNum2,
            }
        }).then(res => {
            wx.hideLoading()
            console.log(res, '---get_house_no---');
            const data = res.data
            if ('0' == data.err_code) {
                if (null == data.data) {
                    wx.showModal({
                        title: '失败',
                        content: '未查询到编号, 请重新输入',
                        showCancel: !1,
                    })
                }else{
                    if (data.data.length>0){
                        wx.showModal({
                            title: '失败',
                            content: '未查询到编号, 请重新输入',
                            showCancel: !1,
                        })
                    }else if (data.data.length==0){
                        this.setData({
                            houseNumberNo: data.data[0].houseNo
                        })
                    }
                }
            } else {
                wx.showModal({
                    title: '失败',
                    content: data.err_msg,
                    showCancel: !1,
                })
            }
        })
    },

    /**
     *  加载要重新提交的数据
     */
    loadReloadData() {
        this.setData({
            reloadFlag: !1
        })
        const data = this.data.navtiveInfo
        const _this = this
        let file1 = []
        let file2 = []
        let file3 = []
        let file4 = []
        file1.push({
            url: data.idPic
        })
        file2.push({
            url: data.propertyPic
        })
        file3.push({
            url: data.housePic
        })
        file4.push({
            url: data.idPicBack
        })

        function forMatHouseType(s) {
            if ('1' == s) {
                return '公房'
            } else if ('2' == s) {
                return '私房'
            }
        }

        function forMatHostGender(s) {
            if ('1' == s) {
                return '男'
            } else if ('2' == s) {
                return '女'
            }
        }

        function forMatCanquanType(s) {
            if (1 == s) {
                return '商品房'
            } else if (2 == s) {
                return '经济适用住房'
            } else if (3 == s) {
                return '集资建房'
            } else if (4 == s) {
                return '房改房'
            } else if (5 == s) {
                return '农权房'
            } else if (6 == s) {
                return '自建房'
            } else if (7 == s) {
                return '廉租房'
            } else if (8 == s) {
                return '其他'
            }
        }

        function forMatHouseJiegou(s) {
            if ('1' == s) {
                return '框架'
            } else if ('2' == s) {
                return '砖混'
            } else if ('3' == s) {
                return '砖木'
            } else if ('4' == s) {
                return '土木'
            } else if ('5' == s) {
                return '其他'
            }
        }

        this.setData({
            streetName: data.street || '',
            communityName: data.community || '',
            houseName: data.neighborhood || '',
            houseType: forMatHouseType(data.houseType),
            houseTypeValue: Number(data.houseType) - 1,
            landlordName: data.hostName || '',
            landlordIdcard: data.hostIdNo || '',
            landlordGender: forMatHostGender(data.hostGender),
            landlordGenderValue: data.hostGender,
            landlordNation: data.hostNation || '',
            phone: data.hostTel || '',
            houseNumber: data.propertyNo || '',
            houseContract: data.contractNo || '',
            houseAddress: data.houseAddr || '',
            houseFloorNum: data.buildNo || '',
            houseSelectionNum: data.unitNo || '',
            houseNum2: data.roomNo || '',
            canquanType: forMatCanquanType(data.propertyType),
            canquanTypeValue: Number(data.propertyType) - 1,
            houseArea: data.totalArea || '',
            houseJiegou: forMatHouseJiegou(data.strctType),
            houseJiegouValue: Number(data.strctType) - 1,
            remark: data.remark || '',
            fileList: file1,
            fileList4: file4,
            fileList2: file2,
            fileList3: file3,
            organNo: data.organNo
        })

    },
    // 获取机构号
    loadOrganNo() {
        wx.showLoading({
            title: '加载中',
            mask: !0
        })
        app.util.req({
            url: 'get_organ',
            method: 'POST',
            data: {
                token: app.token
            }
        }).then(res => {
            wx.hideLoading()
            console.log(res, '---请求时---');
            const data = res.data
            if ('0' == data.err_code) {
                const arrayData = data.data
                this.data.allAreaList = arrayData
                this.setData({
                    allMyListArea: arrayData
                })
                this.reloadArea()
                // const arr1 = []
                // const arr2 = []
                // for (let i = 0; i < arrayData.length; i++) {
                //     if ('5' == arrayData[i].organClass) { // 社区
                //         arr1.push(arrayData[i])
                //     } else if ('4' == arrayData[i].organClass) { // 街道
                //         arr2.push(arrayData[i])
                //     }
                // }
                if (0 == arrayData.length) {
                    wx.showModal({
                        title: '提示',
                        content: '未获取到街道和社区数据',
                        showCancel: !1,
                    })
                }
            }
        })
    },
    // 初始化地区数据
    reloadArea() {
        const {allAreaList} = this.data
        const areaList = []
        // 省
        const provinceArr = allAreaList.filter(item => {
            return 1 == item.organClass
        })
        // 市
        const cityArr = allAreaList.filter(item => {
            return 2 == item.organClass
        })
        // 区
        const areaArr = allAreaList.filter(item => {
            return 3 == item.organClass
        })
        for (let i = 0; i < provinceArr.length; i++) {
            // provinceArr[i].citysArr = []
            areaList[i] = {}
            areaList[i].newArr = []
            areaList[i].province = provinceArr[i]
            for (let j = 0; j < cityArr.length; j++) {
                if (cityArr[j].parentOrganNo == provinceArr[i].organNo) {
                    areaList[i].newArr.push({
                        citys: cityArr[j]
                    })

                    // provinceArr[i].citysArr.push(cityArr[j])
                }
            }
        }
        for (let i = 0; i < areaList.length; i++) {
            for (let j = 0; j < areaList[i].newArr.length; j++) {
                areaList[i].newArr[j].areaArr = []
                for (let k = 0; k < areaArr.length; k++) {
                    if (areaArr[k].parentOrganNo == areaList[i].newArr[j].citys.organNo) {
                        areaList[i].newArr[j].areaArr.push(areaArr[k])
                    }
                }
            }
        }
        console.log(areaList, '---过滤的值为---');
        let data = {
            customArray: areaList,
            multiIndex: this.data.multiIndex,
            multiArray: this.data.multiArray,
        }
        for (var i = 0; i < data.customArray.length; i++) {
            data.multiArray[0].push(data.customArray[i].province);
        }
        for (var j = 0; j < data.customArray[data.multiIndex[0]].newArr.length; j++) {
            data.multiArray[1].push(data.customArray[data.multiIndex[0]].newArr[j].citys);
        }
        for (var k = 0; k < data.customArray[data.multiIndex[0]].newArr[data.multiIndex[1]].areaArr.length; k++) {
            data.multiArray[2].push(data.customArray[data.multiIndex[0]].newArr[data.multiIndex[1]].areaArr[k]);
        }

        const organNo = data.multiArray[2][data.multiIndex[2]].organNo
        const xiaArr = []
        const arrMyList = []
        for (let i = 0; i < allAreaList.length; i++) {
            if (4 == allAreaList[i].organClass) {
                xiaArr.push(allAreaList[i])
            }

        }
        for (let i = 0; i < xiaArr.length; i++) {
            if (organNo == xiaArr[i].parentOrganNo) {
                arrMyList.push(allAreaList[i])
            }
        }
        const arr2 = []
        for (let i = 0; i < allAreaList.length; i++) {
            for (let j = 0; j < arrMyList.length; j++) {
                if (5 == allAreaList[i].organClass && allAreaList[i].parentOrganNo == arrMyList[j].organNo) {
                    arr2.push(allAreaList[i])
                }
            }
        }
        this.setData({
            communityArr: arr2,
            streetArr: arrMyList
        })
        this.setData(data);

        if (!this.data.pageFlag) {
            // 处理修改页面传递的数据
            const {allMyListArea} = this.data
            const pageOrganNo = this.data.organNo
            let streetId = allMyListArea.filter(item => {
                return item.organNo == pageOrganNo
            })[0].parentOrganNo
            let areaId = allMyListArea.filter(item => {
                return item.organNo == streetId
            })[0].parentOrganNo
            let areaInfo = allMyListArea.filter(item => {
                return item.organNo == areaId
            })
            let areaParentId = areaInfo[0].parentOrganNo
            let citys = allMyListArea.filter(item => {
                return item.organNo == areaParentId
            })
            let cityParentInfo = allMyListArea.filter(item => {
                return item.organNo == citys[0].parentOrganNo
            })
            this.setData({
                checkArea: areaInfo[0].fullCname,
                checkCity: citys[0].fullCname,
                checkProvince: cityParentInfo[0].fullCname
            })
            console.log(cityParentInfo, '----我的过滤的---');
            console.log(allMyListArea, '---所有的---');
            console.log(this.data.organNo, '----我的organNO---');
        }
    },
    bindMultiPickerChange(e) {
        this.setData({
            multiIndex: e.detail.value,
            streetName: '',
            communityName: ''
        })
        const {multiArray} = this.data
        const {multiIndex} = this.data
        const {allAreaList} = this.data
        const organNo = multiArray[2][multiIndex[2]].organNo
        const xiaArr = []
        const arrMyList = []
        for (let i = 0; i < allAreaList.length; i++) {
            if (4 == allAreaList[i].organClass) {
                xiaArr.push(allAreaList[i])
            }
        }
        console.log('----所有的街道数据----', xiaArr);
        console.log('----选择的机构号----', organNo);
        for (let i = 0; i < xiaArr.length; i++) {
            if (organNo == xiaArr[i].parentOrganNo) {
                arrMyList.push(xiaArr[i])
            }
        }
        console.log('----匹配的街道数据----', arrMyList);
        const arr2 = []
        for (let i = 0; i < allAreaList.length; i++) {
            for (let j = 0; j < arrMyList.length; j++) {
                if (5 == allAreaList[i].organClass && allAreaList[i].parentOrganNo == arrMyList[j].organNo) {
                    arr2.push(allAreaList[i])
                }
            }
        }
        console.log('----匹配的社区数据----', arr2);
        this.setData({
            communityArr: arr2,
            communityArr2: arr2,
            streetArr: arrMyList,

            streetName: arrMyList[0].fullCname,
            streetOrganNo: arrMyList[0].organNo,
            communityName: arr2[0].fullCname,
            organNo: arr2[0].organNo,
            addressVisible: !1,
            communityVisible: !1
        })
    },
    bindMultiPickerColumnChange(e) {
        var customArray = this.data.customArray,
            multiIndex = this.data.multiIndex,
            multiArray = this.data.multiArray;

        multiIndex[e.detail.column] = e.detail.value;
        console.log('okkkkk');
        // console.log(onlyArray);

        const searchColumn = () => {
            for (var i = 0; i < customArray.length; i++) {
                var arr1 = [];
                var arr2 = [];
                if (i == multiIndex[0]) {
                    for (var j = 0; j < customArray[i].newArr.length; j++) {
                        arr1.push(customArray[i].newArr[j].citys);
                        if (j == multiIndex[1]) {
                            for (var k = 0; k < customArray[i].newArr[j].areaArr.length; k++) {
                                arr2.push(customArray[i].newArr[j].areaArr[k]);
                            }
                            multiArray[2] = arr2;
                        }
                    }
                    multiArray[1] = arr1;
                }
            }
            ;
        }

        switch (e.detail.column) {
            case 0:
                multiIndex[1] = 0;
                multiIndex[2] = 0;
                searchColumn();
                break;
            case 1:
                multiIndex[2] = 0;
                searchColumn();
                break;
        }
        this.setData({
            multiArray: multiArray,
            multiIndex: multiIndex,
            streetName: '',
            communityName: '',
            addressVisible: !1,
            communityVisible: !1,
            pageFlag: !0
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
    onConfirmHouseStatus(e) {
        const {index, value} = e.detail
        this.setData({houseStatus: value, houseStatusValue: index + 1})
        this.onCloseModal5()
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
    // 上传图片
    afterRead(event) {
        const {file} = event.detail;
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
                const {fileList = []} = this.data;
                fileList.push({...file, url: data.data[0]});
                this.setData({fileList});
            }
        });
    },
    afterRead2(event) {
        const {file} = event.detail;
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
                const {fileList2 = []} = this.data;
                fileList2.push({...file, url: data.data[0]});
                this.setData({fileList2});
            }
        });
    },
    afterRead3(event) {
        const {file} = event.detail;
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
                const {fileList3 = []} = this.data;
                fileList3.push({...file, url: data.data[0]});
                this.setData({fileList3});
            }
        });
    },
    afterRead4(event) {
        const {file} = event.detail;
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
                const {fileList4 = []} = this.data;
                fileList4.push({...file, url: data.data[0]});
                this.setData({fileList4});
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
    onCloseModal5() {
        this.setData({modal5Visible: !1})
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
    deleteImg1(e) {
        const {fileList} = this.data
        fileList.splice(e.detail.index, 1)
        this.setData({fileList})
    },
    deleteImg2(e) {
        const {fileList2} = this.data
        fileList2.splice(e.detail.index, 1)
        this.setData({fileList2})
    },
    deleteImg3(e) {
        const {fileList3} = this.data
        fileList3.splice(e.detail.index, 1)
        this.setData({fileList3})
    },
    deleteImg4(e) {
        const {fileList4} = this.data
        fileList4.splice(e.detail.index, 1)
        this.setData({fileList4})
    },
    showModal3() {
        this.setData({modal3Visible: !0})
    },
    showModal5() {
        this.setData({modal5Visible: !0})
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
    // 提交
    formSubmit(ee) {
        // console.log(e.detail.value);
        // const url = 'http://47.104.94.110:9998/HLP_GOV/upload/pic/1583308829541.jpg'
        // let startIdx = url.lastIndexOf('/')
        // let newStr = url.substring(startIdx+1,url.length)
        // console.log(newStr);
        // const dateNum = `H${app.forMatCurrentTime()}`
        // console.log(dateNum);
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
        const url = this.data.fileList[0].url
        const url2 = this.data.fileList2[0].url
        const url3 = this.data.fileList3[0].url
        const url4 = this.data.fileList4[0].url
        let startIdx = url.lastIndexOf('/')
        let startIdx2 = url2.lastIndexOf('/')
        let startIdx3 = url3.lastIndexOf('/')
        let startIdx4 = url4.lastIndexOf('/')
        let idPic = url.substring(startIdx + 1, url.length)
        let propertyPic = url2.substring(startIdx2 + 1, url2.length)
        let housePic = url3.substring(startIdx3 + 1, url3.length)
        let idPicBack = url4.substring(startIdx4 + 1, url4.length)
        if (!this.data.reloadFlag) {
            // 重新提交的数据
            app.util.req({
                url: 'upd_house_declare',
                method: 'POST',
                data: {
                    // createId: wx.getStorageSync('openId') || '',
                    createId: wx.getStorageSync('user_id') || '',
                    houseId: this.data.navtiveInfo.houseId,
                    token: app.token,
                    // declareNo: dateNum,
                    declareDate: app.forMatCurrentTime(),
                    organNo: this.data.organNo || '',
                    street: e.streetName,
                    community: e.communityName,
                    neighborhood: e.houseName,
                    houseType: Number(this.data.houseTypeValue) + 1,
                    hostName: e.landlordName,
                    hostIdNo: e.landlordIdcard,
                    hostGender: Number(this.data.landlordGenderValue),
                    hostNation: e.landlordNation,
                    hostTel: e.phone,
                    contractNo: e.houseContract,
                    propertyNo: e.houseNumber,
                    houseAddr: e.houseAddress,
                    buildNo: e.houseFloorNum,
                    unitNo: e.houseSelectionNum,
                    roomNo: e.houseNum2,
                    propertyType: Number(this.data.canquanTypeValue) + 1,
                    totalArea: e.houseArea,
                    strctType: Number(this.data.houseJiegouValue) + 1,
                    remark: e.remark,
                    // houseState: Number(this.data.houseStatusValue),
                    houseState: 2,
                    idPic: idPic, // 身份证
                    propertyPic: propertyPic, // 产权证
                    housePic: housePic, // 户型图
                }
            }).then(res => {
                const data = res.data
                if ('0' == data.err_code) {
                    this.setData({
                        removeFlag: !1
                    })
                    wx.removeStorageSync('navtiveInfo')
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
        } else {
            // 新增加的数据
            app.util.req({
                url: 'upd_house_declare',
                method: 'POST',
                data: {
                    // createId: wx.getStorageSync('openId') || '',
                    createId: wx.getStorageSync('user_id') || '',
                    token: app.token,
                    // declareNo: dateNum,
                    declareDate: app.forMatCurrentTime(),
                    organNo: this.data.organNo || '',
                    street: e.streetName,
                    community: e.communityName,
                    neighborhood: e.houseName,
                    houseType: Number(this.data.houseTypeValue) + 1,
                    hostName: e.landlordName,
                    hostIdNo: e.landlordIdcard,
                    hostGender: Number(this.data.landlordGenderValue),
                    hostNation: e.landlordNation,
                    hostTel: e.phone,
                    contractNo: e.houseContract,
                    propertyNo: e.houseNumber,
                    houseAddr: e.houseAddress,
                    buildNo: e.houseFloorNum,
                    unitNo: e.houseSelectionNum,
                    roomNo: e.houseNum2,
                    propertyType: Number(this.data.canquanTypeValue) + 1,
                    totalArea: e.houseArea,
                    strctType: Number(this.data.houseJiegouValue) + 1,
                    remark: e.remark,
                    // houseState: Number(this.data.houseStatusValue),
                    houseState: 2,
                    houseNo: this.data.houseNumberNo,
                    idPic: idPic, // 身份证
                    idPicBack: idPicBack,
                    propertyPic: propertyPic, // 产权证
                    housePic: housePic, // 户型图
                }
            }).then(res => {
                const data = res.data
                if ('0' == data.err_code) {
                    this.setData({
                        removeFlag: !1
                    })
                    wx.removeStorageSync('navtiveInfo')
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
        if (-1 == this.data.houseTypeValue) return '请选择房屋性质'
        if ('' == e.landlordName) return '房主姓名不能为空'
        if ('' == e.landlordIdcard) return '房主身份证号不能为空'
        if (-1 == this.data.landlordGenderValue) return '请选择性别'
        if ('' == e.landlordNation) return '请输入民族'
        // if ('' == e.phone) return '请输入手机号'
        if (!regexPhone.test(e.phone)) return '手机号格式不正确'
        // if ('' == e.houseNumber) return '请输入房屋产权证号'
        // if ('' == e.houseContract) return '请输入购房合同编号'
        if ('' == e.houseNumber && '' == e.houseContract) return '请输入房屋产权证号/购房合同编号'
        if ('' == e.houseAddress) return '请输入房屋详细地址'
        if ('' == e.houseFloorNum) return '请输入楼号'
        if ('' == e.houseSelectionNum) return '请输入单元号'
        if ('' == e.houseNum2) return '请输入房号'
        if (-1 == this.data.canquanTypeValue) return '请选择产权类型'
        if ('' == e.houseArea) return '请输入总面积'
        if (-1 == this.data.houseJiegouValue) return '请选择房屋结构'
        // if (-1 == this.data.houseStatusValue) return '请选择房屋状态'
        if (0 == this.data.fileList.length) return '请上传身份证正面图片'
        if (0 == this.data.fileList4.length) return '请上传身份证反面图片'
        if (0 == this.data.fileList2.length) return '请上传产权证图片'
        if (0 == this.data.fileList3.length) return '请上传户型图图片'
        if (''==this.data.houseNumberNo) return '请重新输入房屋信息以便获取正确的房屋编号'
        return ''

    },
    /**
     *  选择区域(城市/区县)
     */
    onChangeArea(e) {

    },
    // 展示区域选择模态框
    showAreaModal() {
        this.setData({areaModalVisbile: !0,})
    },
    onCloseAreaModal() {
        this.setData({areaModalVisbile: !1,})
    },
    // 确定选择区域
    onConfirmAreaCheck(e) {
        const {index, value} = e.detail
        this.setData({areaName: value, areaNameValue: index})
        this.onCloseAreaModal()
    },
    // 点击街道聚焦显示所有街道信息
    showStreetArr() {
        if (void 0 === this.data.pageFlag) {
            return wx.showToast({
                title: '请选择区域',
                icon: 'none'
            }), !1
        }
        const {streetArr} = this.data, sug = []
        streetArr.forEach((item, index) => {
            sug.push({
                title: item.fullCname,
                data: item
            })
        })
        this.setData({
            sugArr: sug,
            communityVisible: !0
        })
    },
    showCommunityArr() {
        if ('' === this.data.streetName) {
            return wx.showToast({
                title: '请选择街道',
                icon: 'none'
            }), !1
        }
        const array = []
        const {communityArr} = this.data, sug = []
        communityArr.forEach((item2, index) => {
            if (item2.parentOrganNo == this.data.streetOrganNo) {
                array.push(item2)
            }
        })
        array.forEach((item, index) => {
            sug.push({
                title: item.fullCname,
                data: item
            })
        })
        this.setData({
            sugArr: sug,
            addressVisible: !0
        })
    },
    onConfirmAreaCheck2(event) {
        const {picker, value, index} = event.detail;
        picker.setColumnValues(1, citys[value[0]]);
    },
    // 输入街道数据
    changeone(e) {
        //调用关键词提示接口
        // if ('' == e.detail) this.setData({addressVisible: !1})
        // const {streetArr} = this.data
        // const sug = []
        // streetArr.forEach((item, index) => {
        //     if (item.fullCname.indexOf(e.detail) !== -1) {
        //         sug.push({
        //             title: item.fullCname,
        //             data: item
        //         })
        //     }
        // })
        // this.setData({
        //     sugArr: sug,
        //     communityVisible: !0
        // })
        this.setData({
            streetName: this.data.streetName
        })
    },
    changeTwo(e) {
        this.setData({
            communityName: this.data.communityName
        })
        // //调用关键词提示接口
        // if ('' == e.detail) this.setData({communityVisible: !1})
        // if (this.data.streetName == '') {
        //     this.setData({
        //         communityName: ''
        //     })
        //     wx.showModal({
        //         title: '提示',
        //         content: '请先选择街道',
        //         showCancel: !1
        //     })
        //     return
        // }
        // const {communityArr} = this.data
        // const sug = []
        // communityArr.forEach((item, index) => {
        //     if (item.fullCname.indexOf(e.detail) !== -1) {
        //         sug.push({
        //             title: item.fullCname,
        //             data: item
        //         })
        //     }
        // })
        // this.setData({
        //     sugArr: sug,
        //     addressVisible: !0
        // })
    },
    // 选择社区
    checkAddrResult(e) {
        const {item} = e.currentTarget.dataset
        this.setData({
            communityName: item.title,
            organNo: item.data.organNo,
            addressVisible: !1
        })
    },
    // 选择街道
    checkAddrResult2(e) {
        const {item} = e.currentTarget.dataset
        // const {communityArr} = this.data
        const communityArr = this.data.communityArr2
        const array = []
        this.setData({
            streetName: item.title,
            communityVisible: !1
        })
        communityArr.forEach((item2, index) => {
            if (item2.parentOrganNo == item.data.organNo) {
                array.push(item2)
            }
        })
        if (array.length > 0) {
            this.setData({
                communityArr: array,
                communityName: array[0].fullCname,
                streetOrganNo: item.data.organNo,
                organNo: array[0].organNo,
                addressVisible: !1
            })
        } else if (0 == array.length) {
            this.setData({
                communityName: '',
                organNo: '',
                addressVisible: !1,
                communityArr: []
            })
            wx.showModal({
                title: '提示',
                content: '该街道未匹配到社区',
                showCancel: !1,
            })
        }
    },

    // 小区名称
    changeHouseName(e) {
        this.setData({
            houseName: e.detail.replace(/\s*/g, "")
        })
    },
    // 联系手机
    changePhone(e) {
        this.setData({
            phone: e.detail.replace(/\s*/g, "")
        })
    },
    // 房屋产权证号
    changeHouseNumber(e) {
        this.setData({
            houseNumber: e.detail.replace(/\s*/g, "")
        })
    },

    // 购房合同编号
    changeHouseContract(e) {
        this.setData({
            houseContract: e.detail.replace(/\s*/g, "")
        })
    },

    // 房屋详细地址
    changeHouseAddress(e) {
        this.setData({
            houseAddress: e.detail.replace(/\s*/g, "")
        })
    },

    // 楼号
    changeHouseFloorNum(e) {
        this.setData({
            houseFloorNum: e.detail.replace(/\s*/g, "")
        })
    },

    // 单元号
    changeHouseSelectionNum(e) {
        this.setData({
            houseSelectionNum: e.detail.replace(/\s*/g, "")
        })
    },

    // 房号
    changeHouseNum2(e) {
        this.setData({
            houseNum2: e.detail.replace(/\s*/g, "")
        })
    },

    // 面积
    changeHouseArea(e) {
        this.setData({
            houseArea: e.detail.replace(/\s*/g, "")
        })
    },

    // 备注
    changeRemark(e) {
        this.setData({
            remark: e.detail.replace(/\s*/g, "")
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

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        // this.checkData()
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