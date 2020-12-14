import qs from 'qs'

/**
 * 查询参数格式化
 * @param { Object } route 
 * @return { {url: string, events: Object } }
 */
export function formatRoute(route){
  let { path, params, events } = route

  return {
    url: path + '?' + qs.stringify(params),
    events: events || {}
  }
}

/**
 * 查询参数格式化
 * @param { Object } route 
 * @return { {url: string, events: Object } }
 */
export function getPath(route){
  let { path, params, events } = route


  return {
    url: path + '?' + qs.stringify(params),
    events: events || {}
  }
}

