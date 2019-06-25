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
          <md-input placeholder="搜索您的文件..." v-model="search" @input="searchOnTable"/>
        </md-field>
      </md-table-toolbar>
      <md-table-empty-state>
        <md-empty-state
          md-rounded
          md-icon="access_time"
          md-label="这里什么都没有.."
          md-description="现在就开始上传吧！"
        ></md-empty-state>

        <!-- <md-button class="md-primary md-raised" @click="newUser">上传</md-button> -->
      </md-table-empty-state>

      <md-table-toolbar slot="md-table-alternate-header" slot-scope="{ count }">
        <div class="md-toolbar-section-start">
          {{ getAlternateLabel(count) }}
          <!-- <md-button class="md-icon-button">
            <md-icon>delete</md-icon>
          </md-button>-->
        </div>

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
        <!-- <md-table-cell style="text-align:left" md-label="描述" md-sort-by="email">{{ item.totalSize / 1024 }}</md-table-cell> -->
        <md-table-cell
          style="text-align:left"
          md-label="大小"
          md-sort-by="totalSize"
        >{{ item.totalSize | calcSize }}</md-table-cell>
        <md-table-cell style="text-align:left" md-label="修改时间" md-sort-by="time">{{ item.time }}</md-table-cell>
      </md-table-row>
    </md-table>
    <!-- 
    <p>selectedIDs:</p>
    {{ selectedIDs }}-->
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
    searched: [],
    selected: [],
    selectedIDs: [],
    files: [
      //   {
      //     id: 1,
      //     name: "Shawna Dubbin",
      //     id: "sdubbin0@geocities.com",
      //     gender: "Male",
      //     title: "Assistant Media Planner"
      //   },
    ]
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
    onSelect(items) {
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
      this.axios
        .get("/api/files/pull")
        .then(successResponse => {
          let response = successResponse.data.data;
          console.log(this.files);
          this.files = response;
          this.searched = response;
          console.log(this.files);
        })
        .then(() => {
          this.closeA();
        })
        .catch(failResponse => {});
    },

    deleteFiles() {
      this.axios
        .post("/api/files/delete", {
          identifiers: this.selectedIDs
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            this.syncFiles();
          } else {
          }
        });
    }
  },

  mounted: function() {
    this.searched = this.files;
    this.syncFiles();

    Bus.$on("syncFiles", () => {
      this.syncFiles();
    });
  }
};
</script>

<style lang="scss">
.md-table + .md-table {
  margin-top: 16px;
}
</style>