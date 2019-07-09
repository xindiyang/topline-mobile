<template>
  <div class="loginWrap">
    <van-nav-bar
      title="登录"
    />
    <van-cell-group>
      <van-field
        v-model="user.mobile"
        label="用户名"
        left-icon="contact"
        placeholder="请输入用户名"
      />
      <van-field
        v-model="user.code"
        type="password"
        label="密码"
        left-icon="closed-eye"
        placeholder="请输入验证码"
      >
         <van-button slot="button" round size="small" type="primary">获取验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn">
      <van-button type="info" round size="large">登录</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>

<style scoped>
.content{
  padding: 10px;
}
.van-cell-group {
  background: #fff
}
.van-nav-bar{
  background: skyblue;
  margin-bottom: 15px;
}
.btn{
  padding: 20px;
  margin-top: 25px;
}
</style>
