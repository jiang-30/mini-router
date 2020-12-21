import qs from 'qs'

/**
 * 解析url
 * @param { string } url 
 */
function parseUrl(url){
  if (typeof url !== "string" || !url.trim()) {
    throw new Error("The url must be a string.");
  }

  url = (url || "").trim()

  let output = {
    protocol: null,
    username: null,
    password: null,
    // origin: '', // protocol + hostname + port
    // resource: '',
    // host: '', // hostname + port
    hostname: null,
    port: null,
    // path: '', // pathname + search
    pathname: '',
    // search: '', // ? + query
    query: '',
    params: '',
    hash: '',
    href: url
  }
  let resource
  let splits
  let parts

  /**
   * Protocol
   */
  splits = url.split("://");
  if (splits.length === 2) {
    output.protocol = splits[0]
    url = splits[1];
  }

  /**
   * 没有 :// 有host会有问题
   */
  parts = url.split("/");
  if (output.protocol) {
    resource = parts.shift();
  } else {
    resource = "";
  }

  // Auth username:password
  splits = resource.split("@");
  if (splits.length === 2) {
      resource = splits[1]
      if(splits[0]){
        splits = splits[0].split(":")
        output.username = splits[0]
        output.password = splits[1] || null
      }
  }

  // Host hostname:port
  splits = resource.split(":")
  output.hostname = splits[0]
  if (splits[1]) {
    output.port = Number(splits[1]);
    if (isNaN(output.port)) {
      output.port = null;
      parts.unshift(splits[1]);
    }
  } else {
    output.port = null
  }

  /**
   * Pathname
   */
  parts = parts.filter(Boolean) // Remove empty elements
  // Stringify the pathname
  if (!output.protocol) {
    output.pathname = output.href
  } else {
    output.pathname = ( output.href[0] === "/" ? "/" : "") + parts.join("/")
  }

  /**
   * Hash
   */
  splits = output.pathname.split("#");
  if (splits.length === 2) {
      output.pathname = splits[0];
      output.hash = splits[1];
  }

  /**
   * Query
   */
  splits = output.pathname.split("?");
  if (splits.length === 2) {
      output.pathname = splits[0];
      output.query = splits[1];
  }

  output.params = qs.parse(output.query);
  output.href = output.href.replace(/\/$/, "")
  output.pathname = output.pathname.replace(/\/$/, "")

  return output
}

export default parseUrl