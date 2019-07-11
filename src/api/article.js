/**
 * 频道新闻推荐接口
 */
import request from '@/utils/request'

export const getArticles = ({ channelId, timestamp, withTop }) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}
