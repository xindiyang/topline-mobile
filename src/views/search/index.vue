<template>
  <div>
    <form action="/">
      <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        show-action
        @search="handleSearch(searchText)"
      />
    </form>

    <!-- 联想建议列表 -->
    <van-cell-group v-if="suggestions.length && searchText.length">
      <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="handleSearch(item)"
      >
        <!-- {{}} 无法输出 html 字符内容 -->
        <!-- v-html 指令才会解析字符串中的 html -->
        <!-- 过滤只能用在 {{}} 和 v-bind 中 -->
        <div slot="title" v-html="hightlight(item, searchText)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议列表 -->

    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <van-icon
          v-show="!isDeleteShow"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="isDeleteShow = true"
        />
        <div v-show="isDeleteShow">
          <span style="margin-right: 10px;" @click="serachHistories = []">全部删除</span>
          <span @click="isDeleteShow = false">完成</span>
        </div>
      </van-cell>
      <van-cell
        v-for="(item, index) in serachHistories"
        :key="item"
        :title="item"
      >
        <van-icon
          v-show="isDeleteShow"
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          @click="serachHistories.splice(index, 1)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '', // 搜索输入的文本
      suggestions: [], // 联想建议
      serachHistories: JSON.parse(window.localStorage.getItem('serach-histories')), // 搜索历史记录
      isDeleteShow: false
    }
  },
  watch: {
    // debounce 接收两个参数
    // 第1参数：执行你的业务逻辑的参数函数
    // 第2参数：防抖时间
    // 当你同一时间调用频率过快的时候，只有停下来经过指定的时间才会来调用
    searchText: debounce(async function (newVal) {
      newVal = newVal.trim() // 去除首尾空格
      // 如果数据为空，则什么都不做
      if (!newVal) {
        return
      }
      // 如果数据不为空，则请求联想建议自动补全
      const data = await getSuggestion(newVal)
      this.suggestions = data.options
    }, 500),
    serachHistories: {
      handler () {
        // 保存搜索历史记录
        window.localStorage.setItem(
          'serach-histories',
          JSON.stringify([...new Set(this.serachHistories)])
        )
      },
      deep: true // 建议引用类型数据都配置为深度监视
    }
  },
  deactivated () {
    this.$destroy()
  },
  methods: {
    // 搜索关键字高亮
    hightlight (text, keyword) {
      return text.toLowerCase().split(keyword)
        .join(`<span style="color: red;">${keyword}</span>`)
    },
    // 搜索功能
    handleSearch (q) {
      if (!q.length) {
        return
      }
      // console.log(q)
      this.serachHistories.unshift(q)
      // 跳转到搜索页面
      this.$router.push({
        name: 'search-result',
        params: {
          q
        }
      })
      // this.$router.push('/search/' + q)
      // this.$router.push(`/search/${q}`)
    }
  }
}
</script>

<style lang="less" scoped></style>
