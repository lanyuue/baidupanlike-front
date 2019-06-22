<template>
  <div class="page-container">
    <md-app>
      <md-app-drawer md-permanent="full" style="height:100vh;overflow:hidden;">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>folder</md-icon>
            <span class="md-list-item-text">全部文件</span>
          </md-list-item>

          <md-list-item>
            <md-icon>collections</md-icon>
            <span class="md-list-item-text">图片</span>
          </md-list-item>

          <md-list-item>
            <md-icon>attachment</md-icon>
            <span class="md-list-item-text">文档</span>
          </md-list-item>

          <md-list-item>
            <md-icon>desktop_windows</md-icon>
            <span class="md-list-item-text">视频</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <md-empty-state
          md-rounded
          md-icon="access_time"
          md-label="这里什么都没有.."
          md-description="Anything you snooze will go here until it's time for it to return to the inbox."
          v-show="false"
        ></md-empty-state>
        <FileTable></FileTable>
        <md-button class="md-fab md-primary" style="position:fixed;bottom:130px;right:50px">
          <md-icon>add</md-icon>
        </md-button>
      </md-app-content>
    </md-app>
    <Uploader></Uploader>
  </div>
</template>

<script>
import FileTable from "@/components/FileTable.vue";
import Uploader from "@/components/Uploader.vue";
export default {
  name: "Content",
  components: {
    FileTable,
    Uploader
  }
};
</script>

<style lang="scss" scoped>
.md-app {
  height: 100vh;
}
// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
</style>