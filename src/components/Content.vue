<template>
  <div class="page-container">
    <md-app>
      <md-app-drawer md-permanent="full" style="height:100vh;overflow:hidden;">
        <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Inbox</span>
          </md-list-item>

          <md-list-item>
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Sent Mail</span>
          </md-list-item>

          <md-list-item>
            <md-icon>delete</md-icon>
            <span class="md-list-item-text">Trash</span>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <md-empty-state
          md-rounded
          md-icon="access_time"
          md-label="这里什么都没有.."
          md-description="Anything you snooze will go here until it's time for it to return to the inbox."
          v-show=false
        ></md-empty-state>
        <FileTable></FileTable>
        <md-button class="md-fab md-primary" style="position:fixed;bottom:130px;right:50px">
          <md-icon>add</md-icon>
        </md-button>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import FileTable from "@/components/FileTable.vue";
export default {
  name: "Content",
  components: {
    FileTable
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