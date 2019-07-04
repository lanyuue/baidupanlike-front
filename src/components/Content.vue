<template>
  <div class="page-container">
    <md-app>
      <md-app-drawer md-permanent="full" style="height:100vh;overflow:hidden;">
        <md-toolbar class="md-transparent" md-elevation="0">欢迎！{{ nickname }}</md-toolbar>

        <md-list>
          <md-list-item id="file_all" class="leftOnClick leftOffClick">
            <md-button
              class="md-icon-button"
              style="margin-left:0px;top:-4px"
              @click="show_file_all"
            >
              <md-icon>move_to_inbox</md-icon>
            </md-button>
            <span
              id="file_all_text"
              class="md-list-item-text left_text_after"
              @click="show_file_all"
            >全部文件</span>
          </md-list-item>

          <md-list-item id="pic_all" class="leftOffClick">
            <md-button
              class="md-icon-button"
              style="margin-left:0px;top:-4px"
              @click="show_pic_all"
            >
              <md-icon>photo</md-icon>
            </md-button>
            <span id="pic_all_text" class="md-list-item-text left_text_before">图片</span>
          </md-list-item>

          <md-list-item id="doc_all" class="leftOffClick">
            <md-button
              class="md-icon-button"
              style="margin-left:0px;top:-4px"
              @click="show_doc_all"
            >
              <md-icon>description</md-icon>
            </md-button>
            <span id="doc_all_text" class="md-list-item-text left_text_before">文档</span>
          </md-list-item>

          <md-list-item id="vcr_all" class="leftOffClick">
            <md-button
              class="md-icon-button"
              style="margin-left:0px;top:-4px"
              @click="show_vcr_all"
            >
              <md-icon>movie</md-icon>
            </md-button>
            <span id="vcr_all_text" class="md-list-item-text left_text_before">视频</span>
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
          :email="this.email"
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
    <md-snackbar
      :md-position="position"
      :md-duration="isInfinity ? Infinity : duration"
      :md-active.sync="showSnackbar"
      md-persistent
      style="text-align:center;"
    >
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
      position: "center",
      duration: 4000,
      isInfinity: false
    };
  },
  props: ["nickname", "email"],
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
    show_file_all() {
      document.getElementById("file_all").setAttribute("class", "leftOnClick");
      document.getElementById("pic_all").setAttribute("class", "leftOffClick");
      document.getElementById("doc_all").setAttribute("class", "leftOffClick");
      document.getElementById("vcr_all").setAttribute("class", "leftOffClick");
      document
        .getElementById("file_all_text")
        .setAttribute("class", "md-list-item-text left_text_after");
      document
        .getElementById("pic_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("doc_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("vcr_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");

      Bus.$emit("changeFiles", [""]);
    },
    show_pic_all() {
      document.getElementById("file_all").setAttribute("class", "leftOffClick");
      document.getElementById("pic_all").setAttribute("class", "leftOnClick");
      document.getElementById("doc_all").setAttribute("class", "leftOffClick");
      document.getElementById("vcr_all").setAttribute("class", "leftOffClick");
      document
        .getElementById("file_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("pic_all_text")
        .setAttribute("class", "md-list-item-text left_text_after");
      document
        .getElementById("doc_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("vcr_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      Bus.$emit("changeFiles", ["png", "jpg", "jpeg", "gif", "bmp"]);
    },
    show_doc_all() {
      document.getElementById("file_all").setAttribute("class", "leftOffClick");
      document.getElementById("pic_all").setAttribute("class", "leftOffClick");
      document.getElementById("doc_all").setAttribute("class", "leftOnClick");
      document.getElementById("vcr_all").setAttribute("class", "leftOffClick");
      document
        .getElementById("file_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("pic_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("doc_all_text")
        .setAttribute("class", "md-list-item-text left_text_after");
      document
        .getElementById("vcr_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");

      Bus.$emit("changeFiles", [
        "doc",
        "docx",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
        "pdf",
        "txt",
        "tif",
        "tiff"
      ]);
    },
    show_vcr_all() {
      document.getElementById("file_all").setAttribute("class", "leftOffClick");
      document.getElementById("pic_all").setAttribute("class", "leftOffClick");
      document.getElementById("doc_all").setAttribute("class", "leftOffClick");
      document.getElementById("vcr_all").setAttribute("class", "leftOnClick");
      document
        .getElementById("file_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("pic_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("doc_all_text")
        .setAttribute("class", "md-list-item-text left_text_before");
      document
        .getElementById("vcr_all_text")
        .setAttribute("class", "md-list-item-text left_text_after");
      Bus.$emit("changeFiles", ["mp4", "rmvb", "mkv", "wmv", "flv"]);
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
.leftOnClick {
  background-color: #e8f0fe;
  width: 220px;
  height: 40px;
  border-radius: 0 66px 66px 0;
  margin-top: 5px;
  margin-bottom: 5px;
}
.leftOffClick {
  width: 220px;
  height: 40px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.leftOnClick {
  background-color: #e8f0fe;
  width: 220px;
  height: 40px;
  border-radius: 0 66px 66px 0;
  margin-top: 5px;
  margin-bottom: 5px;
}
.left_text_before {
  margin-left: 9px;
  margin-top: -7px;
}
.left_text_after {
  margin-left: 9px;
  margin-top: -7px;
  font-weight: 600;
  color: #1967d2;
}
</style>