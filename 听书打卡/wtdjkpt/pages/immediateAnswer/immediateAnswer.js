Page({
  pickerAnswer(e){
    this.setData({
      index:e.detail.value
    })
  },
  asEvent() {
    this.setData({
      status: true
    })
  },
})