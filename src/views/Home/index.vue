<template>
  <div>
    <div class="home">
      <van-nav-bar
       title="首页"
       :fixed = fix
       :border = false
       style="wideth = 92px"
       :z-index= 'index'>
      </van-nav-bar>
    </div>
    <div class="tab">
      <van-tabs
        v-model="activeIndex"
        border color=skyblue
        line-width='20px'>
        <van-tab
          v-for="item in channels"
          :key="item.id"
          :title="item.name">
            <van-pull-refresh
              v-model="item.downPullLoading"
              :success-text='item.downPullSuccessText'
              :success-duration= '1000'
              @refresh="onRefresh">
                <van-list
                  v-model="item.upPullLoading"
                  :finished='item.upPullFinished'
                  finished-text='没有更多了'
                  @load='onLoade'>
                    <van-cell
                      v-for="items in item.articles"
                      :key="items.art_id"
                      :title="items.title"/>
                </van-list>
            </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import { channels } from '@/api/channels'
import { getArticles } from '@/api/article'
export default {
  name: 'Home',
  data () {
    return {
      activeIndex: 0,
      list: [],
      reload: '',
      fix: true,
      index: 999,
      isLoading: false,
      loading: false,
      finished: false,
      // 存储频道
      channels: []
    }
  },
  computed: {
    // 返回当前频道的id和name
    activeChannel () {
      return this.channels[this.activeIndex]
    }
  },
  watch: {
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadeChannels()
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载设置为true，它就会自动加载用户频道列表
      this.activeChannel.upPullLoading = true
    }
  },
  created () {
    // 加载频道列表
    this.loadeChannels()
  },
  methods: {
    // 加载频道列表
    async loadeChannels () {
      // 将用户信息解构出来
      const { user } = this.$store.state
      // 定义一个数组用来存放频道列表
      let channel = []
      // 存在用户时登录时
      if (user) {
        const data = await channels()
        channel = data.channels
      } else {
        // 未登录
        // 如果有本地存储就用本地的频道列表
        const localChannels = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannels) {
          channel = localChannels
        } else {
          // 没有本地缓存的话，就用默认的频道列表
          const data = await channels()
          channel = data.channels
        }
      }
      // 循环频道列表并为其中的属性从新赋值
      channel.forEach(element => {
        element.articles = []
        element.timestamp = Date.now()
        element.upPullFinished = false
        element.downPullLoading = false
        element.downPullLoading = false
      })
      this.channels = channel
    },
    /**
     * 上拉加载更多，应该往频道的 articles 中最后push数据
     * onLoad 进入页面就会调用，当数据不够一个页面时，它会多次调用
     * onLoad会自动开启加载loading效果
     */
    async onLoade () {
      await this.$sleep(1000)
      // 异步更新数据，加载文章列表并赋给常量articles
      // 定义一个新的数组，用来存放新的数据
      let data = []
      // 重新加载，并将值赋给data
      data = await this.loadArticles()
      console.log(data)
      // 当上一个时间戳不存在并且数据为空时
      if (!data.pre_timestamp && !data.results.length) {
        this.activeChannel.upPullFinished = true
        this.activeChannel.upPullLoading = false
        return
      }
      // 当上一个时间戳存在是，且数据为空，就加载列表文章
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        data = await this.loadArticles()
        console.log(data)
      }
      this.activeChannel.timestamp = data.pre_timestamp
      this.activeChannel.articles.push(...data.results)
      this.activeChannel.upPullLoading = false
    },
    async onRefresh () {
      const { activeChannel } = this
      // 备份加载下一页数据的时间戳
      const timestamp = activeChannel.timestamp
      // 使用最新时间戳去请求最新的推荐数据
      activeChannel.timestamp = Date.now()
      const data = await this.loadArticles()
      // 如果有最新数据，将数据更新到频道的文章列表中
      if (data.results.length) {
        // 将当前最新的推荐内容重置到频道文章中
        activeChannel.articles = data.results
        // 由于你重置了文章列表，那么当前数据中的 pre_timestamp 就是上拉加载更多的下一页数据的时间戳
        activeChannel.timestamp = data.pre_timestamp
        activeChannel.downPullSuccessText = '更新成功'
        // 当下拉刷新有数据并重置以后数据无法满足一屏，所以我们使用 onLoad 再多加载一页数据
        this.onLoad()
      } else {
        // 如果没有最新数据，提示已是最新内容
        activeChannel.downPullSuccessText = '已是最新数据'
      }
      // 下拉刷新结束，取消 loading 状态
      activeChannel.downPullLoading = false
      // 没有最新数据，将原来的用于请求下一页的时间戳恢复过来
      activeChannel.timestamp = timestamp
    },
    // 加载文章列表
    async loadArticles () {
      // es6对象结构，把频道的信息返回
      const { id: channelId, timestamp } = this.activeChannel
      const data = await getArticles({
        channelId,
        timestamp,
        withTop: 1
      })
      console.log(data)
      return data
    }
  }
}
</script>

<style scoped>
.van-nav-bar {
  height: 128px;
  background-color: #3296fa;
}
.tab{
  margin-top: 128px;
}
</style>
