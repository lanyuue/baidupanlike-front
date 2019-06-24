<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-success="fileComplete"
      @file-progress="onFileProgress"
      class="uploader-app"
    >
      <uploader-unsupport></uploader-unsupport>

      <uploader-btn id="global-uploader-btn" :attrs="attrs" ref="uploadBtn">选择文件</uploader-btn>

      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
          <div class="file-title" style="margin-top:-5px;height:50px">
            <!-- <h2>上传队列</h2> -->
            <div class="operate" style="margin-top:8px;margin-right:-14px;">
              <md-button
                class="md-icon-button md-dense md-primary"
                @click="fileListShow"
                type="text"
                :title="collapse ? '展开':'折叠' "
              >
                <md-icon
                  class="iconfont icon-close"
                  v-show="collapse"
                  :class="collapse ? 'minimize': 'minimize'"
                >check_box_outline_blank</md-icon>
                <md-icon
                  class="iconfont icon-close"
                  v-show="!collapse"
                  :class="collapse ? 'minimize': 'maxmize'"
                >minimize</md-icon>
              </md-button>
              <md-button
                class="md-icon-button md-dense md-primary md-accent"
                @click="close"
                type="text"
                title="关闭"
              >
                <md-icon class="iconfont icon-close">clear</md-icon>
              </md-button>
            </div>
          </div>

          <ul class="file-list" style="margin-top:-8px;margin-bottom:0px">
            <li
              v-for="file in props.fileList"
              :key="file.id"
              style="text-align:left;list-style-type:none;margin-left:-40px;"
            >
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
 *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
 *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
 */

import { ACCEPT_CONFIG } from "./js/config";
import Bus from "./js/bus";
import SparkMD5 from "spark-md5";
import qs from "qs";
import $ from "jquery";

export default {
  data() {
    return {
      options: {
        target: "/api/uploader/chunk",
        chunkSize: "4096000",
        fileParameterName: "upfile",
        maxChunkRetries: 3,
        testChunks: false, //是否开启服务器分片校验
        checkChunkUploadedByResponse: function(chunk, message) {
          if (message == "文件已存在") {
            return true;
          } else {
            return false;
          }
          // console.log("分片检查")
          // console.log(message)
          // console.log("分片检查")
          // console.log("分片检查")
          // var objMessage = {};
          // try {
          //   objMessage = JSON.parse(message);
          //   console.log(objMessage)
          // } catch (e) {}
          // // fake response
          // // objMessage.uploaded_chunks = [2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 17, 20, 21]
          // // check the chunk is uploaded

          //   console.log((objMessage.uploaded_chunks || []).indexOf(chunk.offset + 1) >= 0)

          // return (true
          //   // (objMessage.uploaded_chunks || []).indexOf(chunk.offset + 1) >= 0
          // );
        }
        // 服务器分片校验函数，秒传及断点续传基础
        // checkChunkUploadedByResponse: function(chunk, message) {
        //   let objMessage = JSON.parse(message);
        //   if (objMessage.skipUpload) {
        //     return true;
        //   }

        //   return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        // },
        // // headers: {
        // //   Authorization: Ticket.get() && "Bearer " + Ticket.get().access_token
        // // },
        // query() {}
      },
      attrs: {
        accept: "*/*"
        //        accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false, //选择文件后，展示上传panel
      collapse: false
    };
  },
  created() {},
  mounted() {
    Bus.$on("openUploader", query => {
      this.params = query || {};

      if (this.$refs.uploadBtn) {
        document.getElementById("global-uploader-btn").click();
      }
    });
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    }
  },
  methods: {
    onFileAdded(file) {
      Bus.$emit("fileAdded");
      this.panelShow = true;

      this.computeMD5(file);
    },
    onFileProgress(rootFile, file, chunk) {
      console.log(
        `上传中 ${file.name}，chunk：${chunk.startByte /
          1024 /
          1024} ~ ${chunk.endByte / 1024 / 1024}`
      );
    },
    // onFileSuccess(rootFile, file, response, chunk) {
    //   console.log("开始合并")
    //   let res = JSON.parse(response);

    //   // 服务器自定义的错误，这种错误是Uploader无法拦截的
    //   if (!res.result) {
    //     this.$message({ message: res.message, type: "error" });
    //     return;
    //   }

    //   // 如果服务端返回需要合并
    //   if (res.needMerge) {
    //     api
    //       .mergeSimpleUpload({
    //         tempName: res.tempName,
    //         fileName: file.name,
    //         ...this.params
    //       })
    //       .then(res => {
    //         // 文件合并成功
    //         Bus.$emit("fileSuccess");
    //       })
    //       .catch(e => {});

    //     // 不需要合并
    //   } else {
    //     Bus.$emit("fileSuccess");
    //     console.log("上传成功");
    //   }
    // },

    fileComplete() {
      console.log("file complete", arguments);
      const file = arguments[0].file;
      this.axios
        .post(
          "/api/uploader/mergeFile",
          qs.stringify({
            filename: file.name,
            identifier: arguments[0].uniqueIdentifier,
            totalSize: file.size,
            type: file.type
          })
        )
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    // onFileError(rootFile, file, response, chunk) {
    //   this.$message({
    //     message: response,
    //     type: "error"
    //   });
    // },

    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let md5 = "";

      file.pause();

      fileReader.readAsArrayBuffer(file.file);

      fileReader.onload = e => {
        if (file.size != e.target.result.byteLength) {
          this.error(
            "Browser reported success but could not read the file until the end."
          );
          return;
        }

        md5 = SparkMD5.ArrayBuffer.hash(e.target.result);

        // 添加额外的参数
        this.uploader.opts.query = {
          ...this.params
        };

        console.log(
          `MD5计算完毕：${file.id} ${
            file.name
          } MD5：${md5} 用时：${new Date().getTime() - time} ms`
        );

        file.uniqueIdentifier = md5;
        file.resume();
      };

      fileReader.onerror = function() {
        this.error(
          "FileReader onerror was triggered, maybe the browser aborted due to high memory usage."
        );
      };
    },

    fileListShow() {
      let $list = $("#global-uploader .file-list");

      if ($list.is(":visible")) {
        $list.slideUp();
        this.collapse = true;
        this.$emit("changeButton", false);
      } else {
        $list.slideDown();
        this.collapse = false;
        this.$emit("changeButton", true);
      }
    },
    close() {
      this.uploader.cancel();

      this.panelShow = false;
    },

    error(msg) {
      this.$notify({
        title: this.$t("c.false"),
        message: msg,
        type: "error",
        duration: 2000
      });
    }
  },
  watch: {
    panelShow: function() {
      if (this.panelShow) {
        this.$emit("changeButton", true);
      } else {
        this.$emit("changeButton", false);
      }
    }
  },
  destroyed() {
    Bus.$off("openUploader");
  },
  components: {}
};
</script>

<style scoped lang="scss">
#global-uploader {
  position: fixed;
  z-index: 20;
  right: 15px;
  bottom: 15px;

  .uploader-app {
    width: 520px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    top: -100px;

    .file-title {
      display: flex;
      height: 40px;
      line-height: 40px;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;

      > li {
        background-color: #fff;
      }
    }

    &.collapse {
      .file-title {
        background-color: #e7ecf2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  /deep/.uploader-file-icon {
    &:before {
      content: "" !important;
    }

    &[icon="image"] {
      background: url(./images/image-icon.png);
    }
    &[icon="video"] {
      background: url(./images/video-icon.png);
    }
    &[icon="document"] {
      background: url(./images/text-icon.png);
    }
  }

  /deep/.uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>