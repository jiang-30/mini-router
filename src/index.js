'use strict'

import { formatRoute } from './utils/util'
import navigate from './utils/nav'

class Router {
  constructor(options) {
    this._beforeEachList = []
    this._afterEachList = []
  }
  /**
   * 添加请求前拦截
   * @param { Function } fn - to, from, next return false 取消, 
   */
  beforeEach(fn) {
    if (typeof fn !== 'function') {
      this.errorLog({ message: '路由前置守卫参数必须是函数' })
      return
    }
    this._beforeEachList.push(fn)
  }
  /**
   * 添加请求后拦截
   * @param { Function } fn 
   */
  afterEach(fn) {
    if (typeof fn !== 'function') {
      this.errorLog({ message: '路由后置守卫参数必须是函数' })
      return
    }
    this._afterEachList.push(fn)
  }
  /**
   * 路由跳转方式 默认 NavigateTo
   * @param { String | Object } route - 页面路径 {path: '', params: {}, events: {}, channelData}
   * @param { String } [type] - 页面跳转方式
   */
  push(route) {
    this._go(route, 'navigateTo')
  }
  launch(route){
    this._go(route, 'reLaunch')
  }
  replace(route){
    this._go(route, 'redirectTo')
  }
  switch(route){
    this._go(route, 'switchTab')
  }
  back(delta = 1) {
    this._go(delta, 'navigateBack')
  }
  _go(route, type) {
    const pages = getCurrentPages()
    let that = this
    let urlOrDelta
    let events
    let to
    let from = pages[pages.length - 1].route

    if(type === 'navigateBack'){
      urlOrDelta = route
      to = pages[pages.length - (1 + delta)].route
    } else {
      if( typeof route === 'string'){
        urlOrDelta = route
      } else {
        let routeObj = formatRoute(route)
        urlOrDelta = routeObj.url
        events = routeObj.events
      }
      to = urlOrDelta.match(/^(.+?)\?/)[1] // 需要去掉query
    }

    this._handlerBeforeEach(to, from, () => {
      navigate(type, urlOrDelta, events, (err) => {
        if(err){
          this.errorLog(err)
        }
      })
    })
  }
  /**
   * 调用路由拦截器
   * @param { string } to 
   * @param { string } from 
   * @param { Function } cb 
   */
  _handlerBeforeEach(to, from, cb){
    let beforeEachList = this._beforeEachList
    let index = 0
    let next = (options, type='navigateTo') => {
      if (options === false) { // 取消
        return
      } else if (options) { // 重定向
        this._go(options, type)
      } else if (beforeEachList.length > 0 && beforeEachList.length > index + 1) {
        index++
        beforeEachList[index](to, from, next)
        return
      } else {
        cb()
      }
    }
    if(beforeEachList.length === 0){
      cb()
    } else {
      beforeEachList[index](to, from, next)
    }
  }
  errorLog(errObj) {
    throw errObj
  }
}


export default Router
