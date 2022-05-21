
/**
 * 根据key获取token
 * @param {string} name 
 * @returns token
 */
export const get_token = (name:string) => {
  const token = localStorage.getItem(name)
  if(token) {
    return token
  }else {
    return new Error('Nonexistent token')
  }
}

/**
 * 根据key删除token
 * @param {string} name 
 * @returns token
 */
export const remove_token = (name: string) => {
  return localStorage.removeItem(name)
}

/**
 * 获取所有的token
 * @returns tokenArray
 */
export const get_all_token = () => {
  const length = localStorage.length
  let tokenArray = []
  if(length === 0) {
    return 'none of token'
  }
  for(let index = 0; index < length; index++) {
    tokenArray.push(localStorage[index])
  }
  return tokenArray
}

/**
 * 删除所有的token
 */
export const clear_all_token = () => {
  localStorage.clear()
}


// cookie相关

/**
 * 设置cookie
 * @param name 
 * @param value 
 * @param exDays 
 */
export const setCookie = (name: string, value:any, exDays = 720) => {
  const date = new Date()
  date.setTime(date.getTime()+ (exDays *24 *60 *60 * 1000))
  const expires = "expires=" + date.toUTCString();
  // cname + "=" + cvalue + "; " + expires
  document.cookie = `${name}=${value};${expires}`
}

/**
 * 获取cookie
 * @param name 
 * @returns 
 */
export const getCookie = (name:string) => {
  const cookieName = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(cookieName) != -1) {
        return c.substring(name.length, c.length);
    }
  }
  return "";
}

/**
 * 清除cookie
 * @param name 
 */
export const clearCookie =(name:string) => {
  const date = new Date();
  date.setTime(-1)
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=''; " + expires;
}