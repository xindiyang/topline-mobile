<template>
  <div>
    <!-- 头部 -->
      <!-- <van-nav-bar
       title="首页"
       fixed
       :border = false
       style="width = 92px"
       :z-index= 'index'>
      </van-nav-bar> -->
      <van-search
        fixed
        class="search"
        placeholder = "请输入搜索关键词"
        shape="round"/>
    <!-- 头部 -->
    <!-- 频道标签 -->
      <van-tabs
        class="channel-tabs"
        v-model="activeIndex"
        border
        color=skyblue
        line-width='20px'>
        <!-- 频道显示控制按钮 -->
        <div slot="nav-right"
          class="wap-nav"
          @click="isChannelShow = true">
          <van-icon name= 'wap-nav'/>
        </div>
        <!-- 频道显示控制按钮 -->
        <van-tab
          v-for="item in channels"
          :key="item.id"
          :title="item.name">
          <!-- 下拉刷新组件 -->
            <van-pull-refresh
              v-model="item.upLoading"
              :success-text='item.downPullSuccessText'
              :success-duration= '1000'
              @refresh="onRefresh">
                <van-list
                  v-model="item.pullRefreshLoading"
                  :finished='item.finished'
                  finished-text='没有更多了'
                  @load='onLoade'>
                    <van-cell
                      v-for="items in item.articles"
                      :key="items.art_id"
                      :title="items.title">
                      <div slot="label">
                          <template v-if="items.cover.type">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="(img, index) in items.cover.images" :key="index">
                      <van-image :src="img" lazy-load />
                    </van-grid-item>
                  </van-grid>
                </template>
                <p>
                  <span>{{ items.aut_name }}</span>
                  &nbsp;
                  <span>{{ items.comm_count }}评论</span>
                  &nbsp;
                  <!-- <span>{{ relativeTime(item.pubdate) }}</span> -->
                  <!--
                    | relativeTime 就是在调用过滤器函数
                    过滤器函数接收的参数就是 | 前面的 item.pubdate
                    过滤器函数返回值会输出到这里
                  -->

                  <!--
                    过滤器说白了就是函数，在模板中调用函数的另一种方式
                    一般用于格式化输出内容，其中不会有太多业务逻辑，一般都是对字符串的格式化处理
                    过滤器可以定义到：
                      全局：Vue.filter('过滤器名称')，可以在任何组件中使用
                      局部：filters 选项，只能在组件内部使用
                  -->
                  <span>{{ items.pubdate | relativeTime }}</span>
                  <!-- 这里更多操作的点击按钮 -->
                  <van-icon class="close" name="close" @click="handleShowMoreAction(item)" />
                </p>
                      </div>
                      </van-cell>
                </van-list>
             </van-pull-refresh>
             <!-- 下拉刷新组件 -->
        </van-tab>
      </van-tabs>
    <!-- 频道标签 -->
   <home-channel
     v-model="isChannelShow"
     :user-channels.sync='channels'
     :active-index.sync='activeIndex'/>
  </div>
</template>

<script>
import { channels } from '@/api/channels'
import { getArticles } from '@/api/article'
import HomeChannel from './component/channel'
export default {
  name: 'Home',
  components: {
    HomeChannel
  },
  data () {
    return {
      activeIndex: 0,
      list: [],
      index: 999,
      isLoading: false,
      loading: false,
      finished: false,
      // 控制频道面板的显示状态
      isChannelShow: false,
      pullRefreshLoading: false,
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
      // 凡是能this. 点出来的东西都可以被监视
      await this.loadeChannels()
      // 频道数据改变，重新加载当前激活频道的数据
      // 只需将上拉加载设置为true，它就会自动加载用户频道列表
      this.activeChannel.upLoading = true
      this.onLoade()
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
        element.finished = false // 控制该频道上拉加载是否已加载完毕
        element.upLoading = false // 控制该频道的下拉刷新 loading
        element.pullRefreshLoading = false // 控制频道列表的上拉刷新状态
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
      let data = []
      // 重新加载，并将值赋给data
      data = await this.loadArticles()
      // 当上一个时间戳不存在并且数据为空时
      if (!data.pre_timestamp && !data.results.length) {
        // 设置该频道数据已经加载完毕，组件会自动给出提示，并不在onLoade
        this.activeChannel.finished = true
        // 取消加载
        this.activeChannel.pullRefreshLoading = false
        return
      }
      // 当上一个时间戳存在是，且数据为空，就加载列表文章
      if (data.pre_timestamp && !data.results.length) {
        this.activeChannel.timestamp = data.pre_timestamp
        // 加载下一页数据
        data = await this.loadArticles()
      }
      // 数据加载好以后，将上次的时间戳更新到当前的时间戳，用于加载上一次推荐数据
      this.activeChannel.timestamp = data.pre_timestamp
      // 将文章数据更新到新的频道中，追加不是覆盖
      this.activeChannel.articles.push(...data.results)
      // 数据加载完毕取消上拉
      this.activeChannel.pullRefreshLoading = false
    },

    // 下拉刷新
    async onRefresh () {
      // 获取最新数据
      const data = await getArticles({
        channelId: this.activeChannel.id,
        timestamp: Date.now(),
        withTop: 1
      })
      // 如果有最新数据
      if (data.results.length) {
        // 将最新数据重置到当前频道
        console.log(data.results)
        this.activeChannel.articles = data.results
        this.activeChannel.timestamp = data.pre_timestamp
        this.activeChannel.pullSuccessText = '更新完成'
        // 因为最新数据无法撑满一页，所以使用加载更多再请求一次
        this.onLoad()
      }
      this.activeChannel.pullSuccessText = '暂无数据更新'
      // 无论如何，最后都关闭加载状态
      this.activeChannel.pullRefreshLoading = false
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
      return data
    }
  }
}
</script>

<style scoped>
.channel-tabs {
  margin-bottom: 128px;
}

.channel-tabs /deep/ .van-tabs_warp {
  position: fixed;
  top: 128px;
}

.channel-tabs .wap-nav {
  position: sticky;
  right: 0;
  display: flex;
  align-items: center;
  background: #fff;
}
</style>
