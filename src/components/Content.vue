<template>
  <div class="page-container">
    <md-app>
      <md-app-drawer md-permanent="full" style="height:100vh;overflow:hidden;">
        <md-toolbar class="md-transparent" md-elevation="0">欢迎！</md-toolbar>

        <md-list>
          <md-list-item>
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">全部文件</span>
          </md-list-item>

          <md-list-item>
            <md-icon>photo</md-icon>
            <span class="md-list-item-text">图片</span>
          </md-list-item>

          <md-list-item>
            <md-icon>description</md-icon>
            <span class="md-list-item-text">文档</span>
          </md-list-item>

          <md-list-item>
            <md-icon>movie</md-icon>
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

        <FileTable
          @changeDownloadStatus="changeDownloadStatus"
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
        ></FileTable>

        <globalUploader
          style="position:fixed;z-index:0;bottom:73px;right:0px;"
          @changeButton="changeButton"
          @start-progressbar="startProgressbar"
          @stop-progressbar="stopProgressbar"
        ></globalUploader>

        <md-button
          id="md-button-download"
          class="md-fab md-accent download-button-simple"
          @click="download"
          @click.stop.prevent="showSnackbar = true"
          v-show="downloadReady"
        >
          <md-icon>vertical_align_bottom</md-icon>
        </md-button>

        <md-button
          id="md-button-upload"
          class="md-fab md-primary upload-button-simple"
          @click="upload"
        >
          <md-icon>add</md-icon>
        </md-button>
      </md-app-content>
    </md-app>
    <md-snackbar :md-position="position" :md-duration="isInfinity ? Infinity : duration" :md-active.sync="showSnackbar" md-persistent  style="text-align:center;">
      <span style="text-align:center;">正在准备下载 ...</span>
      <md-button class="md-primary" @click="showSnackbar = false">好的</md-button>
    </md-snackbar>
  </div>
</template>

<script>
import FileTable from "@/components/FileTable.vue";
import globalUploader from "@/components/globalUploader.vue";

import Bus from "./js/bus.js";

export default {
  name: "Content",
  data() {
    return {
      buttonPosition: false,
      downloadReady: false,
      showSnackbar: false,
    position: 'center',
    duration: 4000,
    isInfinity: false,
    };
  },
  components: {
    FileTable,
    globalUploader
  },

  mounted() {
    // 文件选择后的回调
    Bus.$on("fileAdded", () => {
      console.log("文件已选择");
    });

    // 文件上传成功的回调
    Bus.$on("fileSuccess", () => {
      console.log("文件上传成功");
    });
  },

  watch: {
    buttonPosition: function() {
      if (this.buttonPosition) {
        document
          .getElementById("md-button-upload")
          .setAttribute(
            "class",
            "md-button md-fab md-primary upload-button md-theme-default"
          );
        document
          .getElementById("md-button-download")
          .setAttribute(
            "class",
            "md-button md-fab md-accent download-button md-theme-default"
          );
      } else {
        document
          .getElementById("md-button-upload")
          .setAttribute(
            "class",
            "md-button md-fab md-primary upload-button-simple md-theme-default"
          );
        document
          .getElementById("md-button-download")
          .setAttribute(
            "class",
            "md-button md-fab md-accent download-button-simple md-theme-default"
          );
      }
    }
  },

  methods: {
    upload() {
      // 打开文件选择框
      Bus.$emit("openUploader", {
        id: "1111" // 传入的参数
      });
    },

    download() {
      Bus.$emit("startDownload");
      // this.startProgressbar();
    },

    changeDownloadStatus(payload) {
      this.downloadReady = payload;
    },

    changeButton(payload) {
      this.buttonPosition = payload;
    },

    startProgressbar() {
      this.$emit("start-progressbar");
    },
    stopProgressbar() {
      this.$emit("stop-progressbar");
    },
  },

  destroyed() {
    Bus.$off("fileAdded");
    Bus.$off("fileSuccess");
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
.upload-button-simple {
  position: absolute;
  z-index: 1;
  bottom: 130px;
  right: 50px;
}
.upload-button {
  position: absolute;
  z-index: 1;
  bottom: 380px;
  right: 50px;
}
.download-button-simple {
  position: absolute;
  z-index: 1;
  bottom: 130px;
  right: 120px;
}
.download-button {
  position: absolute;
  z-index: 1;
  bottom: 380px;
  right: 120px;
}
</style>