<template>
  <div style="height:100vh">
    <md-card style="position:relative;z-index：1;">
      <md-card-area>
        <md-card-media>
          <div
            style="background:url('/static/img/bg.jpg') 50% 50% / cover;height:250px;position:relative;z-index=-2"
          ></div>
        </md-card-media>

        <div class="hello">
          <div class="user-header">
            <input
              type="file"
              name="image"
              accept="image/*"
              @change="onchangeImgFun"
              class="header-upload-btn user-header-com"
              style="margin-top:-75px;margin-bottom:75px;width:150px;height:150px; border-radius:75px;cursor:pointer;"
            />
            <img
              alt
              :src="imgStr"
              class="user-header-img user-header-com"
              style="margin-top:-75px;margin-bottom:75px;width:150px;height:150px; border-radius:75px;cursor:pointer;"
            />
          </div>
        </div>

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
      showalert: false,
      imgStr: require("../assets/logo.png"),
      errorStr: ""
    };
  },
  mounted: function() {
    this.syncPropertites();
    this.loadUserInfo();
  },
  methods: {
    onchangeImgFun(e) {
      var file = e.target.files[0];
      console.log(file);
      // 获取图片的大小，做大小限制有用
      let imgSize = file.size;
      console.log(imgSize);
      var _this = this; // this指向问题，所以在外面先定义
      // 比如上传头像限制5M大小，这里获取的大小单位是b
      if (imgSize <= 500 * 1024) {
        // 合格
        _this.errorStr = "";
        console.log("大小合适");
        var dataURL = window.URL.createObjectURL(file);
        console.log(dataURL);
        _this.imgStr = dataURL;
        let param = new FormData(); // 创建form对象
        param.append("file", file); // 通过append向form对象添加数据
        console.log(param.get("file")); // FormData私有类对象，访问不到，可以通过get判断值是否传进去
        let config = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        // 添加请求头
        this.axios.post("/api/files/avatar", param, config).then(response => {
          if (response.data.code === 0) {
            self.ImgUrl = response.data.data;
          }
          console.log(response.data);
        }).then(()=>{
          this.updateAvatar()
        });
      } else {
        console.log("大小不合适");
        _this.errorStr = "图片大小超出范围";
      }
    },

    syncPropertites() {
      this.$fetch.checkLogin.call(this);
      this.updateAvatar();
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
      this.$fetch.checkLogin.call(this);
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
    updateAvatar() {
      this.axios
        .post("/api/files/getavatar")
        .then(successResponse => {
          console.log(successResponse);
          this.imgStr = "data:image/jpeg;base64," + successResponse.data.data;
        })
        .then(() => {
          this.$emit("sync-properties", this.email, this.nickname, this.imgStr);
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
.user-header {
  position: relative;
  display: inline-block;
}
.user-header-com {
  width: 144px;
  height: 144px;
  display: inline-block;
}
.header-upload-btn {
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  /* 通过定位把input放在img标签上面，通过不透明度隐藏 */
}
.tip {
  font-size: 14px;
  color: #666;
}
/* error是用于错误提示 */
.error {
  font-size: 12px;
  color: tomato;
  margin-left: 10px;
}
</style>
