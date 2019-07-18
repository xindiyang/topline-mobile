<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in comments"
        :key="item.com_id.toString()"
      >
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt="">
        </div>
        <div slot="title">
          <span>{{ item.aut_name }}</span>
        </div>
        <div slot="default">
          <van-button
            :icon="item.is_liking ? 'like' : 'like-o'"
            size="mini"
            plain
            @click="handleLikeComment(item)"
          >赞 {{ item.like_count }}</van-button>
        </div>
        <div slot="label">
          <p>{{ item.content }}</p>
          <p>
            <span>{{ item.pubdate | relativeTime }}</span>
            ·
            <span @click="$emit('is-replylist-show', item.com_id.toString())">回复 {{ item.reply_count }}</span>
          </p>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import { getComments, likeComment, unLikeComment } from '@/api/comment'
export default {
  name: 'CommentList',
  props: {
    /**
     * 数据id，文章id 或是 评论 id
     */
    source: {
      type: [Number, String],
      required: true
    },
    /**
     * source 是否是文章，默认当作文章
     */
    isArticle: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      comments: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10
    }
  },
  methods: {
    async onLoad () {
      const data = await getComments({
        source: this.source,
        offset: this.offset,
        limit: this.limit,
        isArticle: this.isArticle // 获取文章评论？还是获取评论的回复
      })
      // 如果数组为空，则表示没有数据了
      if (!data.results.length) {
        this.finished = true
        this.loading = false
        return
      }
      // 如果有数据，添加数据
      this.comments.push(...data.results)
      // 将本次的 loading 设置为 false
      this.loading = false
      // 将本次数据拿到的 last_id 保存起来，用于下一次 onLoad 加载下一页数据
      this.offset = data.last_id
    },
    /**
     * 评论取消/点赞
     */
    async handleLikeComment (item) {
      try {
        if (item.is_liking) {
          // 取消点赞
          await unLikeComment(item.com_id)
          item.is_liking = false
        } else {
          // 点赞
          await likeComment(item.com_id)
          item.is_liking = true
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
</style>
