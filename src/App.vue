<template>
  <div id="app">
    <!-- <global-uploader></global-uploader> -->
    <router-view/>
  </div>
</template>

<script>
// import globalUploader from "@/components/globalUploader.vue";

export default {
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
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
