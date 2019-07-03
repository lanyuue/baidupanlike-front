<template>
  <div>
    <md-toolbar style="text-align:left;background-color:#404040;" md-elevation="0">
      <h3 class="md-title" style="flex: 1;color:#fff">{{ nickname }}</h3>
      <md-button class="md-icon-button">
        <md-icon style="color:#fff">more_vert</md-icon>
      </md-button>
      <md-button class="md-icon-button">
        <md-icon style="color:#fff">clear</md-icon>
      </md-button>
    </md-toolbar>
    <md-card
      style="margin:0;height:70vh;border-left:1px solid #e7e7e7;border-right:1px solid #e7e7e7;margin-top:-1px"
      class="md-elevation-0"
    >
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Media card</div>
          <div class="md-subhead">Normal size</div>
        </md-card-header-text>
      </md-card-header>
    </md-card>
    <md-toolbar
      class="md-dense"
      style="text-align:left;border:1px solid #e7e7e7;margin-top:-1px"
      md-elevation="0"
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

          <p>Selected:</p>
          {{ selected }}
          <md-dialog-actions>
            <md-button class="md-accent" @click="showDialog = false">取消</md-button>
            <md-button class="md-primary" @click="showDialog = false">分享</md-button>
          </md-dialog-actions>
        </md-dialog>

        <md-button class="md-icon-button" @click="showDialog = true">
          <md-icon>folder_shared</md-icon>
        </md-button>

        <md-button class="md-icon-button">
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
    files: [
      {
        name: "Shawna Dubbin",
        email: "sdubbin0@geocities.com",
        gender: "Male",
        title: "Assistant Media Planner"
      },
      {
        name: "Shawna Dubbin",
        email: "sdubbin0@geocities.com",
        gender: "Male",
        title: "Assistant Media Planner"
      },
      {
        name: "Shawna Dubbin",
        email: "sdubbin0@geocities.com",
        gender: "Male",
        title: "Assistant Media Planner"
      },
      {
        name: "Shawna Dubbin",
        email: "sdubbin0@geocities.com",
        gender: "Male",
        title: "Assistant Media Planner"
      },
      {
        name: "Odette Demageard",
        email: "odemageard1@spotify.com",
        gender: "Female",
        title: "Account Coordinator"
      },
      {
        name: "Lonnie Izkovitz",
        email: "lizkovitz3@youtu.be",
        gender: "Female",
        title: "Operator"
      },
      {
        name: "Thatcher Stave",
        email: "tstave4@reference.com",
        gender: "Male",
        title: "Software Test Engineer III"
      },
      {
        name: "Clarinda Marieton",
        email: "cmarietonh@theatlantic.com",
        gender: "Female",
        title: "Paralegal"
      },
      {
        name: "Clarinda Marieton",
        email: "cmarietonh@theatlantic.com",
        gender: "Female",
        title: "Paralegal"
      },
      {
        name: "Clarinda Marieton",
        email: "cmarietonh@theatlantic.com",
        gender: "Female",
        title: "Paralegal"
      },
      {
        name: "Clarinda Marieton",
        email: "cmarietonh@theatlantic.com",
        gender: "Female",
        title: "Paralegal"
      }
    ]
  }),
  props: ["nickname"],

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
