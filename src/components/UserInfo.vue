<template>
  <div style="height:100vh">
    <md-card style="position:relative;z-index：1;">
      <md-card-area>
        <md-card-media>
          <div
            style="background:url('https://hsinyu00.files.wordpress.com/2011/04/cropped-cropped-glacier9401.jpg') 50% 50% / cover;height:250px;"
          ></div>
        </md-card-media>

        <md-avatar
          class="md-avatar-icon md-large"
          style="top:-75px;width:150px;height:150px; border-radius:75px"
        >
          <img src="https://vuematerial.io/assets/examples/avatar-2.jpg" alt="Avatar">
        </md-avatar>
        <div v-show="showinfo">
          <md-card-header style="margin-top:-80px">
            <div class="md-title">{{ nickname }}</div>
            <div class="md-subhead">{{ email }}</div>
          </md-card-header>

          <md-card-content style="height:128px">{{ description }}</md-card-content>

          <div style="margin-left:500px;">
            <md-button class="md-primary" @click="switchtoEdit">修改</md-button>
          </div>
        </div>

        <div v-show="editinfo">
          <div style="width:60%;margin:-70px auto 0 auto;">
            <md-field>
              <label>邮箱地址</label>
              <md-input v-model="email" type="email" placeholder="请输入邮件地址"></md-input>
            </md-field>

            <md-field>
              <label>昵称</label>
              <md-input v-model="nickname" type="text" placeholder="请输入一个昵称"></md-input>
            </md-field>

            <md-field>
              <label>签名档</label>
              <md-input v-model="description" type="text" placeholder="世事如书，我偏爱你这一句 ..."></md-input>
            </md-field>
          </div>

          <div style="margin-top:-10px;margin-left:400px;">
            <md-button class="md-accent" @click="switchtoShow">取消</md-button>
            <md-button class="md-primary" @click="updateUserinfo">更新</md-button>
          </div>
        </div>
      </md-card-area>
    </md-card>

    <md-toolbar
      class="md-accent md-dense"
      style="top:-550px;margin:0 auto;width:280px"
      v-show="showalert"
    >
      <h3 class="md-title" style="margin:0 auto;font-size:14px;">{{ alert }}</h3>
    </md-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: null,
      password: null,
      nickname: null,
      description: null,
      showinfo: true,
      editinfo: false,
      alert: null,
      showalert: false
    };
  },
  mounted: function() {
    this.syncPropertites();
    this.loadUserInfo();
  },
  methods: {
    syncPropertites() {
      this.$emit("sync-properties", this.email, this.nickname);
    },
    loadUserInfo() {
      this.axios
        .post("/api/userinfo")
        .then(successResponse => {
          this.responseResult = JSON.stringify(successResponse.data);
          if (successResponse.data.code === 200) {
            this.email = successResponse.data.data.email;
            // this.password = successResponse.data.data.password;
            this.nickname = successResponse.data.data.nickname;
            this.description = successResponse.data.data.description;
          } else {
            this.alert = successResponse.data.message;
            this.showAlert();
          }
        })
        .then(() => {
          this.syncPropertites();
        })
        .catch(failResponse => {});
    },
    updateUserinfo() {
      this.startProgressbar();
      this.axios
        .post("/api/updateuser", {
          email: this.email,
          nickname: this.nickname,
          password: "this.password",
          description: this.description
        })
        .then(successResponse => {
          this.responseResult = JSON.stringify(successResponse.data);
          if (
            successResponse.data.code === 200 &&
            successResponse.data.data == "修改成功"
          ) {
            this.switchtoShow();
          } else {
            this.alert = successResponse.data.message;
            this.showAlert();
            this.stopProgressbar();
          }
        })
        .then(() => {
          this.loadUserInfo();
        })
        .catch(failResponse => {});
    },
    switchtoShow() {
      this.showinfo = true;
      this.editinfo = false;
      this.stopProgressbar();
      this.hideAlert();
    },
    switchtoEdit() {
      this.showinfo = false;
      this.editinfo = true;
      this.hideAlert();
    },
    startProgressbar() {
      this.$emit("start-progressbar");
    },
    stopProgressbar() {
      this.$emit("stop-progressbar");
    },
    showAlert() {
      this.showalert = true;
    },
    hideAlert() {
      this.showalert = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  width: 620px;
  height: 600px;
  margin: 20px;
  display: inline-block;
  vertical-align: top;
}

.md-card-example {
  .md-subhead {
    .md-icon {
      $size: 16px;
      width: $size;
      min-width: $size;
      height: $size;
      font-size: $size !important;
    }

    span {
      vertical-align: middle;
    }
  }

  .card-reservation {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .md-icon {
      margin: 8px;
    }
  }

  .md-button-group {
    display: flex;

    .md-button {
      min-width: 60px;
      border-radius: 2px;
    }
  }
}
</style>
