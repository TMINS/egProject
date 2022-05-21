
export const StatusMessage = (status: number|string): string => {
  let message = ''
  switch(status) {
    case 400: 
      message = '请求错误-400'
      break;
    case 500: 
      message = '请求错误-500'
      break;
  }
  return message
}