<template>
  <div>
    <Login class="login"></Login>
  </div>
</template>

<script>
import Login from "@/components/Login.vue"

export default {
  name: "MainPage",
  components: {
    Login
  }
};
</script>

<style>
.login {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, 0);
  width: 300px;
}
</style>
