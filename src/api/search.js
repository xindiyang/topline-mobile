/**
 * 搜索相关数据接口
 */
import request from '@/utils/request'

/**
 * 获取联想建议（自动补全）
 */
export const getSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索结果
 */
export const getSearch = ({
  page = 1, // 页数，不传默认为1
  perPage = 10, // 每页数量，不传每页数量由后端决定
  q // 搜索关键词
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
