export default class{constructor(t){this._beforeEachList=[],this._afterEachList=[],this._routerList=t.routes}beforeEach(t){"function"==typeof t?this._beforeEachList.push(t):this.errorLog({message:"路由前置守卫参数必须是函数"})}afterEach(t){"function"==typeof t?this._afterEachList.push(t):this.errorLog({message:"路由后置守卫参数必须是函数"})}push(t,e="navigateTo"){this.go(t,e)}back(t=1){this._navigateBack(t)}go(t,e="navigateTo"){let r,a,i,o=this,s={};const h=this._formatRouteParams(t);h&&(r="/"+this.getPath(h.routePath,h.routeQuery),h.routeEvents&&(s=h.routeEvents),a=0,i=t=>{if(0!=t)if(t)this.go(t);else{if(this._beforeEachList.length>0&&this._beforeEachList.length>a+1)return a++,void this._beforeEachList[a](this.toMap,void 0,i);switch(e){case"switchTab":o._switchTab(r);break;case"redirectTo":o._redirectTo(r);break;case"reLaunch":o._reLaunch(r);break;default:o._navigateTo(r,s)}}},0===this._beforeEachList.length?i():this._beforeEachList[a](this.toMap,void 0,i))}_formatRouteParams(t){let e,r,a,i,o="",s="";if("string"==typeof t?o=t:"object"==typeof t&&(o=("object"==typeof t.path?t.path.path:t.path)||"",s=("object"==typeof t.name?t.name.path:t.name)||"",e=t.query,r=t.events),a=this._routerList.find(t=>t.path===o||t.name===s),a)return i=this._routerList.find(t=>t.path===getCurrentPages().slice(-1)[0].route),this.toMap=a,this.fromMap=i,{routePath:a.path,routeQuery:e,routeEvents:r};this.errorLog({message:`当前路由没有定义~~ path:${o};name: ${s}`})}_navigateTo(t,e){let r=this;wx.navigateTo({url:t,events:e,fail(t){r.errorLog(t)}})}_switchTab(t){let e=this;wx.switchTab({url:t,fail(t){e.errorLog(t)}})}_reLaunch(t){let e=this;wx.reLaunch({url:t,fail(t){e.errorLog(t)}})}_redirectTo(t){let e=this;wx.redirectTo({url:t,fail(t){e.errorLog(t)}})}_navigateBack(t){let e=this;wx.navigateBack({delta:t,fail(t){e.errorLog(t)}})}getPath(t,e={}){return t+"?"+(r=e,Object.keys(r).map(t=>t+"="+r[t]).join("&"));var r}errorLog(t){throw t}}
