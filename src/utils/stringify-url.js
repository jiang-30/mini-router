/**
 * 构建url
 */

var encodedParam = function (param) {
  return param === null ? '' : encodeURIComponent(String(param).trim());
};

/**
 * origin protocol hostname port
 * protocol
 * auth username password - user:pass@
 * host hostname port
 * path pathname search query(queryParams)
 * hash
 * 
 * queryParams Array disableCSV
 * lowerCase
 * null => ''
 */
function stringifyUrl(options){
  let builtUrl = ''

  /**
   * origin protocol hostname port
   */
  if(options.origin){
    builtUrl += String(options.origin).trim();
  }

  /**
   * path pathname
   */
  if(options.path){
    if(builtUrl && builtUrl[builtUrl.length - 1] === '/') {
      builtUrl = builtUrl.slice(0, -1);
    } 
    const localVar = String(options.path).trim(); 
    if (localVar.indexOf('/') === 0) {
      builtUrl += localVar;
    } else {
      builtUrl += '/' + localVar;
    }
  }

  /**
   * search query
   */
  if(options.query){

  }

  /**
   * search queryParams
   */
  if(options.params){
    let queryArr = []
    for (key in options.params) {
      if (options.params.hasOwnProperty(key) && options.params[key] !== void 0) {
        let param;
        if (Array.isArray(options.params[key]) && options.params[key].length) {
          for(let i = 0; i < options.params[key].length; i++) {
            param = options.params[key][i];
            queryArr.push(key + '=' + encodedParam(param));
          }
        } else {
          param = options.params[key];
          queryArr.push(key + '=' + encodedParam(param));
        }
      }
    }
    builtUrl += '?' + queryArr.join('&');
  }

  /**
   * hash
   */
  if(options.hash){
    builtUrl += '#' + String(options.hash).trim();
  }


  return builtUrl
}

export default stringifyUrl