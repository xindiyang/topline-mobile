/**
 * 获取频道列表
 */
import request from '@/utils/request'
// 获取用户频道
export const channels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 获取所有频道列表
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
