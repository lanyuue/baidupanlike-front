<template>
  <div>
    <md-toolbar style="text-align:left;background-color:#448aff;margin-top:100px" md-elevation="3">
      <md-avatar>
        <img :src="avatar" alt="People" />
      </md-avatar>
      <h3 class="md-title" style="flex: 1;color:#fff">{{ nickname }}</h3>
      <md-menu md-size="auto" md-direction="bottom-end" md-offset-y="12" md-offset-x="12">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon style="color:#fff">more_vert</md-icon>
        </md-button>

        <md-menu-content>
          <md-menu-item>
            <md-dialog-confirm
            :md-active.sync="active"
            md-title="您真要删除好友吗？"
            md-content="注意，这是不可逆操作"
            md-confirm-text="确定"
            md-cancel-text="取消"
            @md-confirm="deletefriend"
          />
            <md-button class="md-accent" style="margin:0" @click="active = true">删除好友</md-button>
            <!-- <md-icon style="color:#ff5252">delete</md-icon> -->
          </md-menu-item>
        </md-menu-content>
      </md-menu>
      <!-- <md-button class="md-icon-button">
        <md-icon style="color:#fff">more_vert</md-icon>
      </md-button>-->
      <md-button class="md-icon-button" @click="deletechat">
        <md-icon style="color:#fff">clear</md-icon>
      </md-button>
    </md-toolbar>
    <md-card
      style="margin:0;height:50vh;border-left:1px solid #e7e7e7;border-right:1px solid #e7e7e7;margin-top:-1px"
      class="md-elevation-3"
    >
      <md-card-header>
        <md-card-header-text style="width:10px">
          <!-- <div class="md-title">Media card</div> -->
          <pre><div
  class="md-subhead"
  style="word-wrap:break-word;word-break:break-all;white-space: pre-line;"
>{{ text }}</div></pre>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-toolbar
      class="md-dense"
      style="text-align:left;border:1px solid #e7e7e7;margin-top:-1px"
      md-elevation="3"
    >
      <md-field>
        <md-input v-model="message"></md-input>

        <md-dialog :md-active.sync="showDialog">
          <md-dialog-title>请选择你要分享的文件</md-dialog-title>

          <md-table
            v-model="files"
            md-card
            @md-selected="onSelect"
            class="md-elevation-0"
            style="border-top:1px solid #e7e7e7;border-bottom:1px solid #e7e7e7;"
          >
            <md-table-row
              slot="md-table-row"
              slot-scope="{ item }"
              md-selectable="multiple"
              md-auto-select
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
              <md-table-cell
                style="text-align:left"
                md-label="修改时间"
                md-sort-by="time"
              >{{ item.time }}</md-table-cell>
            </md-table-row>
          </md-table>

          <md-dialog-actions>
            <md-button class="md-accent" @click="showDialog = false">取消</md-button>
            <md-button class="md-primary" @click="shareFiles">分享</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-button class="md-icon-button" @click="showDialog = true" style="margin-right:-10px">
          <md-icon>folder_shared</md-icon>
        </md-button>

        <md-button class="md-icon-button" style="margin-right:-10px">
          <md-icon>send</md-icon>
        </md-button>
      </md-field>
    </md-toolbar>
  </div>
</template>

<style lang="scss" scoped>
.md-toolbar + .md-toolbar {
  margin-top: 16px;
}
</style>

<script>
export default {
  name: "ChatWindow",
  data: () => ({
    message: null,
    showDialog: false,
    selected: [],
    text: "什么都没有...",
    files: [],
    active: false
  }),
  props: ["nickname", "avatar", "email"],

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
    onSelect(items) {
      this.selected = items;
    },
    syncFiles() {
      this.$fetch.checkLogin.call(this);
      this.axios
        .get("/api/files/pull")
        .then(successResponse => {
          let response = this.ClearNullArr(successResponse.data.data);
          this.files = response;
          // this.searched = response;
          //   this.backup = response;
        })
        .catch(failResponse => {});
    },
    ClearNullArr(arr) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] == null || arr[i] == "" || arr[i] === undefined) {
          arr.splice(i, 1);
          len--;
          i--;
        }
      }
      return arr;
    },
    deletechat() {
      this.$emit("deletechat", this.email);
    },
    deletefriend() {
      this.axios.post("/api/relation/delete",{
        email: this.email
      }).then(()=>{
        this.deletechat()
        this.$emit("getFriends")
      })
    },
    shareFiles() {
      this.showDialog = false;
      this.axios
        .post("/api/share/files", {
          identifiers: this.selected.map(item => item.identifier),
          transferTo: this.email
        })
        .then(successResponse => {
          if (this.text == "什么都没有...") {
            this.text = "";
          }
          this.text +=
            '文件"' +
            this.selected.map(item => item.filename) +
            '"' +
            successResponse.data.data +
            "\n";
        })
        .catch(failResponse => {});
    }
  },
  mounted: function() {
    this.syncFiles();
  }
};
</script>

<style lang="scss" scoped>
.md-dialog {
  max-width: 768px;
  max-height: 600px;
}
</style>
