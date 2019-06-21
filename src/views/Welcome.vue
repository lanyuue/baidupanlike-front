<template>

  <div>
  <md-progress-bar md-mode="indeterminate" v-show="showLogin"  ></md-progress-bar>
    <Login class="login" :flag="showLogin" @close-login="closeLogin"></Login>
  </div>
</template>

<script>
import Login from "@/components/Login.vue"

export default {
  name: "MainPage",
  components: {
    Login
  },
  data () {
    return {
      showLogin: false
    }
  },
  methods: {
    closeLogin (payload) {
      this.showLogin = payload;
    }
  }
};
</script>

<style scoped>
.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 300px;
}
</style>
