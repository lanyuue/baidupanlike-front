<template>
  <div>
    <md-table
      v-model="searched"
      @md-selected="onSelect"
      style="max-height:88vh;height:88vh;width:101%;margin:0 auto;overflow:hidden;"
      md-sort="filename"
      md-sort-order="asc"
    >
      <md-table-toolbar style="width:300px;">
        <md-field style="margin-top:-10px;" md-clearable class="md-toolbar-section-end">
          <md-input placeholder="搜索您的文件..." v-model="search" @input="searchOnTable" />
        </md-field>
      </md-table-toolbar>

      <md-table-empty-state>
        <md-empty-state
          md-rounded
          md-icon="access_time"
          md-label="这里什么都没有.."
          md-description="现在就开始上传吧！"
        ></md-empty-state>
      </md-table-empty-state>

      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">{{ getAlternateLabel(count) }}</div>

        <div class="md-toolbar-section-end">
          <md-button class="md-icon-button" @click="deleteFiles">
            <md-icon>delete</md-icon>
          </md-button>
        </div>
      </md-table-toolbar>

      <md-table-row
        slot="md-table-row"
        slot-scope="{ item }"
        md-selectable="multiple"
        md-auto-select
        style="max-width:10px"
      >
        <md-table-cell
          style="text-align:left;width:55%;"
          md-label="文件名"
          md-sort-by="filename"
        >{{ item.filename }}</md-table-cell>

        <md-table-cell
          style="text-align:left"
          md-label="大小"
          md-sort-by="totalSize"
        >{{ item.totalSize | calcSize }}</md-table-cell>
        <md-table-cell style="text-align:left" md-label="修改时间" md-sort-by="time">{{ item.time }}</md-table-cell>
      </md-table-row>
    </md-table>
  </div>
</template>

<script>
import Bus from "./js/bus.js";

const toLower = text => {
  return text.toString().toLowerCase();
};

const searchByName = (items, term) => {
  if (term) {
    return items.filter(item => toLower(item.filename).includes(toLower(term)));
  }
  return items;
};

export default {
  name: "FileTable",
  data: () => ({
    search: null,
    websocket: null,
    progress: 0,
    searched: [],
    selected: [],
    selectedIDs: [],
    files: []
  }),

  filters: {
    calcSize: bytes => {
      let size = [" B", " KB", " MB", "GB"];
      let i = 0;
      for (; bytes >= 1024; i++) {
        bytes = (bytes / 1024).toFixed(1);
      }
      return bytes + size[i];
    }
  },

  methods: {
    initWebSocket: function() {
      this.websocket = new WebSocket("ws://127.0.0.1:8090/websocket");
      // 连接错误
      this.websocket.onerror = this.setErrorMessage;
      // 连接成功
      this.websocket.onopen = this.setOnopenMessage;
      // 收到消息的回调
      this.websocket.onmessage = this.setOnmessageMessage;
      // 连接关闭的回调
      this.websocket.onclose = this.setOncloseMessage;
      // 监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
      window.onbeforeunload = this.onbeforeunload;
    },
    setErrorMessage() {
      console.log(
        "WebSocket连接发生错误   状态码：" + this.websocket.readyState
      );
    },
    setOnopenMessage() {
      console.log("WebSocket连接成功    状态码：" + this.websocket.readyState);
    },
    setOnmessageMessage(event) {
      // 根据服务器推送的消息做自己的业务处理
      //console.log("服务端返回：" + event.data);
      this.progress = parseInt(event.data);
    },
    setOncloseMessage() {
      console.log("WebSocket连接关闭    状态码：" + this.websocket.readyState);
    },
    onbeforeunload() {
      this.closeWebSocket();
    },
    closeWebSocket() {
      this.progress = 0;
      this.websocket.close();
    },

    onSelect(items) {
      // console.log(items);
      let map = items.map(item => item.identifier);
      this.selected = items;
      this.selectedIDs = map;
    },

    getAlternateLabel(count) {
      let plural = "";
      if (count > 1) {
        plural = "s";
      }
      return `${count} user${plural} selected`;
    },

    searchOnTable() {
      this.searched = searchByName(this.files, this.search);
    },

    syncFiles() {
      this.$fetch.checkLogin.call(this);
      this.axios
        .get("/api/files/pull")
        .then(successResponse => {
          let response = this.ClearNullArr(successResponse.data.data);
          this.files = response;
          this.searched = response;
        })
        .then(() => {
          this.closeA();
        })
        .catch(failResponse => {});
    },

    deleteFiles() {
      this.startProgressbar();
      this.$fetch.checkLogin.call(this);
      this.axios
        .post("/api/files/delete", {
          identifiers: this.selectedIDs
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.syncFiles();
            this.stopProgressbar();
          } else {
          }
        });
    },

    async down_clear() {
      await this.axios({
        method: "post",
        url: "/api/files/download",
        data: {
          identifiers: this.selectedIDs
        },
        responseType: "blob"
      }).then(response => {
        let fname = "undefined";
        let type = response.headers["content-type"];
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            type: type == "application/json" ? "application/octet-stream" : type
          })
        );
        const link = document.createElement("a");
        let head = response.headers["content-disposition"];
        if (head) {
          try {
            fname = decodeURI(head.split("=")[1]);
          } catch (err) {
            console.log("can not get file name");
          }
        }
        link.href = url;
        link.setAttribute("download", fname);
        document.body.appendChild(link);
        link.click();
      });
      this.onbeforeunload();
    },
    startProgressbar() {
      this.$emit("start-progressbar");
    },
    stopProgressbar() {
      this.$emit("stop-progressbar");
    },
    ClearNullArr(arr) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == null || arr[i] == "" || arr[i] === undefined) {
          arr.splice(i, 1);
          // len--;
          // i--;
        }
      }
      return arr;
    }
  },

  mounted: function() {
    this.searched = this.files;
    this.syncFiles();

    Bus.$on("syncFiles", () => {
      this.syncFiles();
    });

    Bus.$on("startDownload", () => {
      console.log(this);
      this.$emit("start-progressbar");
      this.initWebSocket();
      this.$fetch.checkLogin.call(this);
      this.down_clear();
    });
  },
  destroyed() {
    try {
      this.websocket.close();
    } catch (error) {}
  },

  watch: {
    selected: function() {
      this.$emit("changeDownloadStatus", this.selected.length != 0);
    },
    progress: function() {
      Bus.$emit(
        "changeAmount",
        this.progress // 传入的参数
      );
      //console.log(this.progress);
      if (this.progress > 0) {
        this.$emit("stop-progressbar");
      }
    }
  },

  beforeDestroy() {
    Bus.$off("startDownload");
  }
};
</script>

<style lang="scss">
.md-table + .md-table {
  margin-top: 16px;
}
</style>