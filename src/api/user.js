/**
 * 用户模块接口封装，建议把所有的请求都封装成一个小的函数
 * 在需要的时候直接调用
 */
import request from '@/utils/request'

export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
