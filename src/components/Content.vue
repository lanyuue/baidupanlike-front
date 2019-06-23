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
        <globalUploader style="position:absolute;z-index:0;bottom:63px;right:0px" @changeButton="changeButton"></globalUploader>
        <md-button id="md-button" class="md-fab md-primary upload-button-simple" @click="upload">
          <md-icon>add</md-icon>
        </md-button>

        <!-- <button @click="upload">上传</button> -->
        <!-- <Uploader style="top:-500px;float:right;width:30vw;height:1vh;"></Uploader> -->
      </md-app-content>
    </md-app>
  </div>
</template>

<script>
import FileTable from "@/components/FileTable.vue";
import Bus from "./js/bus.js";
import globalUploader from "@/components/globalUploader.vue";

// import globalUploader from "@/components/globalUploader.vue";
export default {
  name: "Content",
  data() {
    return {
      buttonPosition: false
    };
  },
  components: {
    FileTable,
    globalUploader
    // Uploader
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
          .getElementById("md-button")
          .setAttribute(
            "class",
            "md-button md-fab md-primary upload-button md-theme-default"
          );
      } else {
        document
          .getElementById("md-button")
          .setAttribute(
            "class",
            "md-button md-fab md-primary upload-button-simple md-theme-default"
          );
      }
    }
  },
  computed: {},
  methods: {
    upload() {
      // 打开文件选择框
      Bus.$emit("openUploader", {
        id: "1111" // 传入的参数
      });
    },

    changeButton(payload) {
      this.buttonPosition = payload;
    }
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
  bottom: 400px;
  right: 50px;
}
</style>