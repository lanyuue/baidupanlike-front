<template>
  <div class="page-container" style="height:100vh;overflow:hidden;">
    <md-app class="md-apps">
      <md-app-toolbar
        class="md-primary"
        md-elevation="0"
        style="background-color:#fff;border-bottom:solid 1px #e7e7e7"
      >
        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-avatar>
              <img alt :src="imgStr" />
            </md-avatar>
          </md-button>
        </div>
        <img src="..\assets\drive_48dp.png" />
        <span
          class="md-title"
          style="color:#5f6368;font-size:22px;font-weight:400;margin-top:1px;font-style:normal;vertical-align:middle;line-height:48px"
        >云端硬盘</span>
      </md-app-toolbar>

      <md-app-drawer
        class="md-right"
        :md-active.sync="menuVisible"
        md-right
        md-persistent="mini"
        style="height:100vh;overflow:hidden;"
      >
        <md-toolbar class="md-transparent" md-elevation="0" style="padding:0;margin:5px 0 0 0;">
          <md-avatar style="margin-left:10px">
            <img alt :src="imgStr" />
          </md-avatar>
          <div style="font-family:'Roboto';margin-left:12px;text-align:left;">
            <b>{{ nickname }}</b>
            <br />
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
            <md-button class="md-icon-button" style="margin-left:-7px" @click="show_friends_info">
              <md-icon>people</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">人脉</span>
          </md-list-item>

          <md-list-item>
            <md-button
              class="md-icon-button"
              style="margin-left:-7px"
              @click="show_notifications_info"
            >
              <md-icon>notifications</md-icon>
            </md-button>
            <span class="md-list-item-text" style="margin-left:17px">通知</span>
            <md-badge md-content="1" md-dense md-position="bottom"></md-badge>
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

        <md-progress-bar
          style="margin:-16px 0 0 -18px;width:100vw;"
          class="md-accent"
          md-mode="buffer"
          :md-value="amount"
          :md-buffer="buffer"
          v-show="amount"
        ></md-progress-bar>

        <UserInfo
          @sync-properties="syncProperties"
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
          v-show="1==components_switch"
        ></UserInfo>

        <Content
          style="margin-left:-20px"
          v-show="!components_switch"
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
          :nickname="this.nickname"
          :email="this.email"
        ></Content>

        <Friends
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
          v-show="2==components_switch"
          :usernickname="this.nickname"
        ></Friends>

        <Notifications
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
          v-show="3==components_switch"
        ></Notifications>
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import Content from "@/components/Content.vue";
import UserInfo from "@/components/UserInfo.vue";
import Friends from "@/components/Friends.vue";
import Notifications from "@/components/Notifications.vue";
import Bus from "@/components/js/bus.js";

export default {
  name: "MainPage",
  data: () => ({
    menuVisible: false,
    components_switch: 0,
    nickname: "昵称",
    email: "邮箱地址",
    imgStr: null,
    progressbar: false,
    amount: 0,
    buffer: 0
  }),
  components: {
    Content,
    UserInfo,
    Friends,
    Notifications
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
    show_friends_info() {
      this.components_switch = 2;
    },
    show_notifications_info() {
      this.components_switch = 3;
    },
    syncProperties(email, nickname, imgStr) {
      this.email = email;
      this.nickname = nickname;
      this.imgStr = imgStr;
    },
    startProgressbar() {
      this.progressbar = true;
    },
    stopProgressbar() {
      this.progressbar = false;
    }
  },
  mounted() {
    Bus.$on("changeAmount", amount => {
      this.amount = amount;
    });
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
}

.md-content {
  padding: 16px;
}
</style>