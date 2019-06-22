<template>
  <div id="app">
    <!-- <global-uploader></global-uploader> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
document.body.addEventListener(
  "touchmove",
  function(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  { passive: false }
);

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
