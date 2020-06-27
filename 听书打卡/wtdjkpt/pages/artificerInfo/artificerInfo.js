Page({
  data:{
    isModal:true
  },
  subscribeEvent(){
    this.setData({
      isModal: false
    })     
  },
  confirmEvent() {
    console.log('确认');
    this.setData({
      isModal: true
    })
  },
  cancelEvent() {
    this.setData({
      isModal: true
    })
  },
})