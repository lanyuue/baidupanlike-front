<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>

<script>
// import globalUploader from "@/components/globalUploader.vue";

export default {
<<<<<<< HEAD
  name: "App",
  data() {
    return {};
  },
  components: {
    // globalUploader
  },
  computed: {},
  created() {},
  watch: {}
};
=======
  name: 'App'
}
document.body.addEventListener('touchmove', function(e){
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });
>>>>>>> parent of f48e00f... 上传模块草稿
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
