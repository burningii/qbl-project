Page({
  pickerEvent(e){
    this.setData({
      index:Number(e.detail.value)
    })
  }
})