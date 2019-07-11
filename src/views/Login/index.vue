<template>
  <div class="loginWrap">
    <van-nav-bar
      title="登录"
    />
    <van-cell-group>
      <van-field
        clearable
        v-model="user.mobile"
        label="手机号"
        left-icon="contact"
        placeholder="请输入手机号"
        :error-message="errors.mobile"
      />
      <van-field
        clearable
        v-model="user.code"
        type="password"
        label="密码"
        :error-message="errors.code"
        left-icon="closed-eye"
        placeholder="请输入验证码"
      >
         <van-button slot="button" round size="small" type="primary">获取验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn">
      <van-button
        :loading = 'loading'
        loading-text="加载中..."
        type="info"
        round size="large"
        @click.prevent = 'handleLogin'
        >登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '18782995670',
        code: '123456'
      },
      errors: {
        mobile: '',
        code: ''
      },
      loading: false
    }
  },
  methods: {
    async handleLogin () {
      try {
        const { mobile, code } = this.user
        const errors = this.errors
        if (mobile.trim().length) {
          errors.mobile = ''
        } else {
          errors.mobile = '手机号不能为空'
          return
        }
        if (code.trim().length) {
          errors.code = ''
        } else {
          errors.code = '验证码不能为空'
          return
        }
        this.loading = true
        const data = await login(this.user)
        this.$store.commit('setUser', data)
        this.$router.push({
          name: 'home'
        })
      } catch (error) {
        console.log(error)
        console.log('登录失败')
      }
      this.loading = false
    },
    // 校验电话码格式
    isTelCode (str) {
      var reg = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
      return reg.test(str)
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
