<template>
  <div
    style="height:100vh;weight:100vw;background:url('/static/img/intro-768.jpg') 50% 50% / cover;overflow:hidden;"
  >
    <h1
      style="position:fixed;text-align:left;color:#fff;font-size:30px;font-weight:400;margin:25px;font-style: normal;"
    >
      <b>IBM</b> Drive
    </h1>
    <Login class="login"></Login>
  </div>
</template>

<script>
import Login from "@/components/Login.vue";

export default {
  name: "MainPage",
  components: {
    Login
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
}
</style>
