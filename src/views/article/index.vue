<template>
  <div class="article-wrap">
    <AuthInfo />
    <CommentList />
    <MoreAction />
    <RecommentActicle />
    <RecommentSearch />
    <ReplyList />
    <WriteComment />
  </div>
</template>

<script>
import AuthInfo from './components/auth-info'
import CommentList from './components/comment-list'
import MoreAction from './components/more-action'
import RecommentActicle from './components/recommend-article'
import RecommentSearch from './components/recommend-search'
import ReplyList from './components/reply-list'
import WriteComment from './components/write-comment'
export default {
  name: 'ArticleIndex',
  components: {
    AuthInfo,
    CommentList,
    MoreAction,
    RecommentActicle,
    RecommentSearch,
    ReplyList,
    WriteComment
  }
}
</script>

<style>

</style>
