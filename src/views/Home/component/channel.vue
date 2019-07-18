<template>
  <van-popup
    :value="value"
    @input="$emit('input', $event)"
    get-container="body"
    position="bottom"
    :style="{ height: '90%' }"
  >
    <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <span class="title">我的频道</span>
        <span class="desc">点击进入频道</span>
        <div>
          <van-button
            type="danger"
            plain size="mini"
            @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
          @click="handleUserChannelClick(item,index)"
        >
          <span class="text" :class="{ active: index === activeIndex && !isEdit }">{{ item.name }}</span>
          <van-icon v-show="isEdit" class="close-icon" name="close"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 我的频道 -->

    <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter='10' clickable>
        <van-grid-item
          v-for="item in recomendChannels"
          :key="item.id"
          text= '文字'
          @click="handleAddChannel(item)"
          >
          <div class="info">
            <span class="text">{{ item.name }}</span>
          </div>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 推荐频道 -->
  </van-popup>
</template>

<script>
import { getAllChannels, deleteUserChannel, updateUserChannel } from '@/api/channels'
export default {
  name: 'HomeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => []
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    /**
     *该计算属性用于处理获取用户推荐
     */
    recomendChannels () {
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    }
  },
  created () {
    this.loadAllChannels()
  },
  data () {
    return {
      allChannels: [],
      isEdit: false
    }
  },
  methods: {
    async loadAllChannels () {
      try {
        const data = await getAllChannels()
        data.channels.forEach(item => {
          item.timestamp = Date.now() // 用于下一页频道数据的时间戳
          item.finished = false // 控制该频道上拉加载是否已加载完毕
          item.upLoading = false // 控制该频道的下拉刷新 loading
          item.pullRefreshLoading = false // 控制频道列表的下拉刷新状态
          item.pullSuccessText = '' // 控制频道列表的下拉刷新成功提示文字
          item.articles = [] // 频道的文章
        })
        this.allChannels = data.channels
      } catch (error) {
        console.log(error)
      }
    },
    async handleAddChannel (item) {
      /**
       * userChannels是props数据
       * props数组有个原则：单向数据流
       * 数组只受父组件影响，但是反之不会
       * 但是引用数据类型除外
       */
      // this.userChannels.push(item)
      // 截取一个新的数组，操作这个新的数组，操作结束再将结果传递给父组件，让父组件去修改
      const channels = this.userChannels.slice(0)
      channels.push(item)
      this.$emit('update:user-channels', channels)
      const { user } = this.$store.state
      // 判断是否登录，如果已经登录。则添加本地缓存
      if (user) {
        await updateUserChannel([{
          id: item.id,
          sep: channels.length - 1
        }])
      } else {
        window.localStorage.setItem('channels', JSON.stringify(channels))
      }
    },
    async handleUserChannelClick (item, index) {
      // 如果是非编辑状态，则是切换tab操作
      if (!this.isEdit) {
        // 子传父
        this.$emit('update:active-index', index)
        this.$emit('input', false)
        return
      }
      // 如果是编辑状态，则是删除操作
      const channels = this.userChannels.slice(0)
      channels.splice(index, 1)
      this.$emit('update:user-channels', channels)
      const { user } = this.$store.state
      // 如果用户处于登录状态，则请求删除
      if (user) {
        await deleteUserChannel(item.id)
        return
      }
      // 如果用户满意登录，则将数据保存到本地缓存
      window.localStorage.setItem('channels', JSON.stringify(channels))
    }
  }
}
</script>

<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
      font-size: 24px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 40px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
