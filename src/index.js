'use strict'
class Router {
  constructor(options) {
    this._beforeEachList = []
    this._afterEachList = []
    this._routerList = options.routes
  }
  beforeEach(fn) {
    if (typeof fn !== 'function') {
      this.errorLog({ message: '路由前置守卫参数必须是函数' })
      return
    }
    this._beforeEachList.push(fn)
  }
  afterEach(fn) {
    if (typeof fn !== 'function') {
      this.errorLog({ message: '路由后置守卫参数必须是函数' })
      return
    }
    this._afterEachList.push(fn)
  }
  push(route, type = 'navigateTo') {
    this.go(route, type)
  }
  back(delta = 1) {
    this._navigateBack(delta)
  }
  go(route, type = 'navigateTo') {
    let that = this
    let routeUrl
    let toRouteMap
    let fromRouteMap
    let index
    let events = {}
    let next
    const formatRoute = this._formatRouteParams(route)
    if (formatRoute) {
      routeUrl = '/' + this.getPath(formatRoute.routePath, formatRoute.routeQuery)
      if (formatRoute.routeEvents) {
        events = formatRoute.routeEvents
      }
    } else {
      return
    }
    index = 0
    next = (options) => {
      if (options == false) {
        return
      } else if (options) {
        this.go(options)
      } else if (this._beforeEachList.length > 0 && this._beforeEachList.length > index + 1) {
        index++
        this._beforeEachList[index](this.toMap, fromRouteMap, next)
        return
      } else {
        switch (type) {
          case 'switchTab':
            that._switchTab(routeUrl)
            break
          case 'redirectTo':
            that._redirectTo(routeUrl)
            break
          case 'reLaunch':
            that._reLaunch(routeUrl)
            break
          default:
            that._navigateTo(routeUrl, events)
            break
        }
      }
    }
    if (this._beforeEachList.length === 0) {
      next()
    } else {
      this._beforeEachList[index](this.toMap, fromRouteMap, next)
    }
  }
  _formatRouteParams(route) {
    let routePath = ''
    let routeName = ''
    let routeQuery
    let routeEvents
    let toRouteMap
    let fromRouteMap
    if (typeof route == 'string') {
      routePath = route
    } else if (typeof route === 'object') {
      routePath = (typeof route.path == 'object' ? route.path.path : route.path) || ''
      routeName = (typeof route.name == 'object' ? route.name.path : route.name) || ''
      routeQuery = route.query
      routeEvents = route.events
    }
    toRouteMap = this._routerList.find((item) => item.path === routePath || item.name === routeName)
    if (!toRouteMap) {
      this.errorLog({
        message: `当前路由没有定义~~ path:${routePath};name: ${routeName}`,
      })
      return
    }
    fromRouteMap = this._routerList.find(
      (item) => item.path === getCurrentPages().slice(-1)[0].route
    )
    this.toMap = toRouteMap
    this.fromMap = fromRouteMap
    return {
      routePath: toRouteMap.path,
      routeQuery,
      routeEvents,
    }
  }
  _navigateTo(url, events) {
    let that = this
    wx.navigateTo({
      url: url,
      events,
      fail(err) {
        that.errorLog(err)
      },
    })
  }
  _switchTab(url) {
    let that = this
    wx.switchTab({
      url: url,
      fail(err) {
        that.errorLog(err)
      },
    })
  }
  _reLaunch(url) {
    let that = this
    wx.reLaunch({
      url,
      fail(err) {
        that.errorLog(err)
      },
    })
  }
  _redirectTo(url) {
    let that = this
    wx.redirectTo({
      url,
      fail(err) {
        that.errorLog(err)
      },
    })
  }
  _navigateBack(delta) {
    let that = this
    wx.navigateBack({
      delta: delta,
      fail(err) {
        that.errorLog(err)
      },
    })
  }
  getPath(path, params = {}) {
    return path + '?' + formatQuery(params)
  }
  errorLog(errObj) {
    throw errObj
  }
}
function formatQuery(query) {
  return Object.keys(query)
    .map((item) => item + '=' + query[item])
    .join('&')
}
function formatRouterList(routes) {
  let _routerList = []
  try {
    __wxConfig &&
      __wxConfig.pages &&
      __wxConfig.tabBar.list &&
      __wxConfig.pages.forEach((item) => {
        let res = routes.find((route) => route.path === item)
        if (res) {
          _routerList.push(
            Object.assign({}, res, {
              isTab: __wxConfig.tabBar.list.some(({ pagePath }) => pagePath.includes(item)),
            })
          )
        } else {
        }
      })
    return _routerList
  } catch (err) {
    console.error(err)
  }
}

export default Router
