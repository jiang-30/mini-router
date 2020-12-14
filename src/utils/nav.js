  /**
   * wx.naigateTo跳转到某个页面；最多十层，不能是tabbar
   * @param { String } url 
   * @param { Object } events 
   */
  function navigateTo(url, events = {}, callback) {
    wx.navigateTo({
      url: url,
      events: events,
      fail(err) {
        callback(err)
      },
      success(){
        callback(null)
      }
    })
  }
  /**
   * wx.switchTab
   * @param { String } url 
   */
  function switchTab(url, callback) {
    wx.switchTab({
      url: url,
      fail(err) {
        callback(err)
      },
      success(){
        callback(null)
      }
    })
  }
  /**
   * wx.reLaunch
   * @param { String } url 
   */
  function reLaunch(url, callback) {
    wx.reLaunch({
      url,
      fail(err) {
        callback(err)
      },
      success(){
        callback(null)
      }
    })
  }
  /**
   * wx.redirectTo
   * @param { String } url 
   */
  function redirectTo(url, callback) {
    wx.redirectTo({
      url,
      fail(err) {
        callback(err)
      },
      success(){
        callback(null)
      }
    })
  }
  /**
   * wx.navigateBack
   * @param { number } delta 
   */
  function navigateBack(delta, callback) {
    wx.navigateBack({
      delta: delta,
      fail(err) {
        callback(err)
      },
      success(){
        callback(null)
      }
    })
  }

/**
 * 
 * @param {*} type - 路由类型
 * @param {*} urlOrDelta  - url
 * @param {*} events - navigateTo events
 * @param {*} callback 
 */
export default function(type, urlOrDelta, events, callback){
  switch (type) {
    case 'switchTab':
      switchTab(urlOrDelta, callback)
      break
    case 'redirectTo':
      redirectTo(urlOrDelta, callback)
      break
    case 'reLaunch':
      reLaunch(urlOrDelta, callback)
      break
    case 'navigateTo':
      navigateTo(urlOrDelta, events, callback)
      break
    case 'navigateBack':
      navigateBack(urlOrDelta, callback)
      break
    default:
      callback(new Error(`无效的跳转方式[${type}]`))
  }
}