<template>
  <div class="page-container" style="height:100vh;overflow:hidden;">
    <md-app class="md-apps">
      <md-app-toolbar class="md-primary" md-elevation="0">
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-avatar class="md-avatar-icon md-accent" style="background-color:#41B883">V</md-avatar>
          </md-button>
        </div>
        <span
          class="md-title"
          style="position:fixed;text-align:left;color:#fff;font-size:30px;font-weight:400;padding:0;font-style: normal;"
        >
          <b>IBM</b> Drive
        </span>
      </md-app-toolbar>

      <md-app-drawer
        class="md-right"
        :md-active.sync="menuVisible"
        md-right
        md-persistent="mini"
        style="height:100vh;overflow:hidden;"
      >
        <md-toolbar class="md-transparent" md-elevation="0" style="padding:0;margin:5px 0 0 0;">
          <md-avatar
            class="md-avatar-icon md-accent"
            style="background-color:#41B883;margin-left:10px"
          >V</md-avatar>
          <div style="font-family:'Roboto';margin-left:12px;text-align:left;">
            <b>{{ nickname }}</b>
            <br>
            <div style="color:#666">{{ email }}</div>
          </div>

          <div class="md-toolbar-section-end">
            <md-button
              class="md-icon-button md-dense"
              style="margin-left:-20px;margin-top:-5px"
              @click="toggleMenu"
            >
              <md-icon>keyboard_arrow_right</md-icon>
            </md-button>
          </div>
        </md-toolbar>

        <md-list>
          <md-list-item>
            <md-button class="md-icon-button" style="margin-left:-7px" @click="show_home">
              <md-icon>home</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">首页</span>
          </md-list-item>

          <md-list-item>
            <md-button class="md-icon-button" style="margin-left:-7px" @click="show_person_info">
              <md-icon>account_circle</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">个人信息</span>
          </md-list-item>

          <md-list-item>
            <md-button class="md-icon-button" style="margin-left:-7px">
              <md-icon>people</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">人脉</span>
          </md-list-item>

          <md-list-item>
            <md-button class="md-icon-button" style="margin-left:-7px">
              <md-icon>notifications</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">通知</span>
          </md-list-item>

          <md-list-item>
            <md-button class="md-icon-button" style="margin-left:-7px" @click="logout">
              <md-icon>logout</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">注销</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content style="overflow:hidden">
        <md-progress-bar
          style="margin:-16px 0 0 -18px;width:100vw;"
          md-mode="indeterminate"
          v-show="progressbar"
        ></md-progress-bar>
        <UserInfo
          @sync-properties="syncProperties"
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
          v-show="1==components_switch"
        ></UserInfo>
        <Content v-show="!components_switch"></Content>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Content from "@/components/Content.vue";
import UserInfo from "@/components/UserInfo.vue";

export default {
  name: "MainPage",
  data: () => ({
    menuVisible: false,
    components_switch: 0,
    nickname: "昵称",
    email: "邮箱地址",
    progressbar: false
  }),
  components: {
    Content,
    UserInfo
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    logout() {
      this.axios.post("/api/logout").then(this.$router.push({ path: "/" }));
    },
    show_home() {
      this.components_switch = 0;
    },
    show_person_info() {
      this.components_switch = 1;
    },
    syncProperties(email, nickname) {
      this.email = email;
      this.nickname = nickname;
    },
    startProgressbar() {
      this.progressbar = true;
    },
    stopProgressbar() {
      this.progressbar = false;
    }
  }
};
</script>

<style lang="scss" scoped>
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

