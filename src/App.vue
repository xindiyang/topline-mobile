<template>
  <div id="app">
    <!-- 路由组件是动态的。默认情况下切换都会销毁重建使用keep-alive进行组件缓存 -->
    <keep-alive>
       <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less" scoped>

</style>
