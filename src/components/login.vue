<template>
  <div>
    <md-card id="md-card" md-with-hover class="loginhover">
      <md-progress-bar md-mode="indeterminate" style="margin:0" v-show="showProgressbar"></md-progress-bar>
      <md-card-content class="login2">
        <md-card class="md-accent" v-show="cardsign">
          <md-card-header>
            <md-card-header-text>
              <div class="Primary color">{{ alert }}</div>
            </md-card-header-text>
          </md-card-header>
        </md-card>
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

        <md-button
          v-show="!signmode"
          class="md-raised md-primary"
          style="width:90%"
          @click="login_submit"
        >登录</md-button>
        <md-button
          v-show="signmode"
          class="md-raised md-primary"
          style="width:90%"
          @click="register_submit"
        >注册</md-button>

        <p v-show="!signmode">
          新来的？转而
          <a href="#" @click="reg">
            <b>注册</b>
          </a>
        </p>
        <p v-show="signmode">
          已注册？
          <a href="#" @click="login">
            <b>登录</b>
          </a>
        </p>
      </md-card-content>
      
    </md-card>
    
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
      signmode: false,
      alert: null,
      cardsign: false,
      showProgressbar: false
    };
  },

  watch: {
    alert: function() {
      if (alert) {
        this.cardsign = true;
      }
    }
  },

  methods: {
    openA() {
      this.closeLogin(true);
    },
    closeA() {
      this.closeLogin(false);
    },
    login_submit() {
      this.openA();
      this.axios
        .post("/api/login", {
          email: this.email,
          password: this.password
        })
        .then(successResponse => {
          this.responseResult = JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.$router.push({ path: "/home" });
            this.alert = successResponse.data.message;
          } else {
            this.alert = successResponse.data.message;
          }
        })
        .then(() => {
          this.closeA();
        })
        .catch(failResponse => {});
    },
    register_submit() {
      this.openA();
      this.axios
        .post("/api/register", {
          email: this.email,
          password: this.password,
          nickname: this.nickname
        })
        .then(successResponse => {
          this.responseResult = JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            location.reload();
          } else {
            this.alert = successResponse.data.message;
          }
        })
        .then(() => {
          this.closeA();
        })
        .catch(failResponse => {});
    },

    reg() {
      this.signmode = true;
      this.cardsign = false;
      document.getElementById("md-card").setAttribute("class","md-card reghover md-theme-default md-with-hover")
    },

    login() {
      this.signmode = false;
      this.cardsign = false;
      document.getElementById("md-card").setAttribute("class","md-card loginhover md-theme-default md-with-hover")
    },
    closeLogin(payload) {
      this.showProgressbar = payload;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-progress-bar {
  margin: 24px;
}
.login2 {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -47%, 0);
  width: 300px;
}
.loginhover {
  width:350px;height:350px;
}
.reghover {
  width:350px;height:410px;
}
</style>