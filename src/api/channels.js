/**
 * 获取频道列表
 */
import request from '@/utils/request'

export const channels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}
