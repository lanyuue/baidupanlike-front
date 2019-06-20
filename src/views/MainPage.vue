<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary" md-elevation="0">
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-avatar class="md-avatar-icon md-accent" style="background-color:#41B883">V</md-avatar>
          </md-button>
        </div>
        <span class="md-title">My Title</span>
      </md-app-toolbar>

      <md-app-drawer
        class="md-right"
        :md-active.sync="menuVisible"
        md-right="true"
        md-persistent="mini"
      >
        <md-toolbar class="md-transparent" md-elevation="0">
          <span>Navigation</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button md-dense" @click="toggleMenu">
              <md-icon>keyboard_arrow_right</md-icon>
            </md-button>
          </div>
        </md-toolbar>

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
            <md-button class="md-icon-button" style="margin-left:-7px" @click="logout">
              <md-icon>logout</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">注销</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea.</md-app-content>
    </md-app>
  </div>
</template>

<script>
export default {
  name: "MainPage",
  data: () => ({
    menuVisible: false
  }),
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    logout() {
      this.axios.post("/api/logout").then(this.$router.push({ path: "/" }));
    }
  }
};
</script>

<style lang="scss" scoped>
.md-app {
  height: 100vh;
  //border: 1px solid rgba(#000, 0.12);
}

// Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}

.page-container {
  min-height: 300px;
  overflow: hidden;
  position: relative;
  //border: 1px solid rgba(#000, 0.12);
}

.md-content {
  padding: 16px;
}
</style>

