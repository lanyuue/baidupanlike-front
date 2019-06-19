<template>
  <div>
    <md-field>
      <label>邮箱地址</label>
      <md-input v-model="email" type="email" placeholder="请输入邮件地址"></md-input>
    </md-field>

    <md-field>
      <label>密码</label>
      <md-input v-model="password" type="password" placeholder="请输入密码"></md-input>
    </md-field>

    <md-field v-show="signmode">
      <label>昵称</label>
      <md-input v-model="nickname" type="text" placeholder="请输入一个昵称"></md-input>
    </md-field>

    <md-button v-show="!signmode" class="md-raised md-primary" style="width:90%" @click='login_submit'>登录</md-button>
    <md-button v-show="signmode" class="md-raised md-primary" style="width:90%" @click='register_submit'>注册</md-button>
    
    
    <p v-show="!signmode">新来的？转而<a href="#" @click='reg'><b>注册</b></a></p>
    <p v-show="signmode">已注册？<a href="#" @click='login'><b>登录</b></a></p>

  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: null,
      password: null,
      nickname: null,
      signmode: false
    };
  },
  methods: {
    login_submit() {
      this.axios
        .post("/api/login", {
          email: this.email, 
          password: this.password 
        })
        .then(function(response) {
          console.log(response.email);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    register_submit() {
      this.axios
        .post("/api/register", {
          email: this.email, 
          password: this.password,
          nickname: this.nickname 
        })
        .then(function(response) {
          console.log(response.email);
        })
        .catch(function(error) {
          console.log(error);
        });
    },

    reg(){
      this.signmode = true
    },

    login(){
      this.signmode = false
    }
  }
};
</script>
