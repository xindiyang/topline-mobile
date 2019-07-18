<template>
  <div class="auth-info">
    <div class="base-info">
      <img class="avatar" :src="article.aut_photo" alt="">
      <div>
        <p>{{ article.aut_name }}</p>
        <p>{{ article.pubdate | relativeTime }}</p>
      </div>
    </div>
    <div>
      <van-button
        :type="article.is_followed ? 'default' : 'danger'"
        :loading="isFollowLoading"
        @click="handleFollow"
      >{{ article.is_followed ? '已关注' : '关注' }}</van-button>
    </div>
  </div>
</template>

<script>
import { followUser, unFollowUser } from '@/api/user'
export default {
  name: 'AuthInfo',
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isFollowLoading: false
    }
  },
  created () {
    console.log(this.article)
    console.log(this.$route)
  },
  methods: {
    async handleFollow () {
      if (!this.$checkLogin()) {
        return
      }
      this.isFollowLoading = true
      try {
        const authId = this.article.aut_id
        if (this.article.is_followed) {
          // 取消关注
          await unFollowUser(authId)
          // 将客户端的关注状态设置为 false
          this.article.is_followed = false
        } else {
          // 关注
          await followUser(authId)
          // 将客户端的关注状态设置为 true
          this.article.is_followed = true
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.isFollowLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.auth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  .base-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    margin-right: 10px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
}
</style>
