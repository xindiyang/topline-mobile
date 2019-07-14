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
        <van-grid-item v-for="(item, index) in userChannels" :key="item.id" text="文字">
          <span class="text" :class="{ active: index === activeIndex }">{{ item.name }}</span>
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
import { getAllChannels } from '@/api/channels'
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
        this.allChannels = data.channels
      } catch (error) {
        console.log(error)
      }
    },
    handleAddChannel (item) {
      this.userChannels.push(item)
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
