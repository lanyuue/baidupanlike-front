<template>
  <div style="height:100vh">
    <md-tabs class="md-tabs" style>
      <md-tab id="tab-home" md-label="联系人" @click="contactmode"></md-tab>
      <md-tab id="tab-pages" md-label="搜索" @click="searchmode"></md-tab>
      <!-- <md-tab id="tab-posts" md-label="共享文件"></md-tab> -->
    </md-tabs>

    <md-list class="md-double-line" v-show="1==switcher">
      <Friendlist
        v-for="friend in friends"
        :key="friend.id"
        :nickname="friend.nickname"
        :email="friend.email"
        :description="friend.description"
        :avatar="friend.avatar"
        @showChatWindow="showChatWindow"
      ></Friendlist>
    </md-list>

    <md-list class="md-double-line" v-show="2==switcher">
      <Userlist
        v-for="user in users"
        :key="user.id"
        :nickname="user.nickname"
        :email="user.email"
        :avatar="user.avatar"
        @showUserInfo="showUserInfo"
      ></Userlist>
      <md-field md-clearable class="md-toolbar-section-end" style="margin-left:20px;width:230px">
        <md-input placeholder="搜索用户 ..." v-model="search" @input="searchUsers" />
      </md-field>
    </md-list>

    <div
      style="left:400px;top:200px;text-align:left;position:absolute"
      v-show="!showinfo && chatusers.length<=1"
    >
      <span
        class="md-display-2"
        style="margin-bottom:20px;display:inline-block"
      >{{ usernickname }} 你好！</span>
      <br />
      <span class="md-display-1" style="font-size:24px">发送文件给好友，开始共享你的云盘吧！</span>
    </div>

    <md-card id="user_info" v-show="showinfo">
      <md-card-media-actions style="height:260px">
        <md-card-media>
          <img :src="img" alt="Cover" />
        </md-card-media>

        <md-card-actions>
          <md-button class="md-icon-button">
            <md-icon>star</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>bookmark</md-icon>
          </md-button>

          <md-button class="md-icon-button">
            <md-icon>share</md-icon>
          </md-button>
        </md-card-actions>
      </md-card-media-actions>
      <br />
      <md-card-header-text>
        <div class="md-title">{{ nickname }}</div>
        <div class="md-subhead">{{ email }}</div>
      </md-card-header-text>
      <md-card-content>{{ description }}</md-card-content>

      <md-dialog-alert :md-active.sync="add_contact" md-title="好友申请已发送！" md-content="静候TA同意吧" />

      <md-button
        class="md-fab md-primary"
        style="right:20px;bottom:20px;position:absolute"
        @click="addContact"
      >
        <md-icon>person_add</md-icon>
      </md-button>
    </md-card>
    <ChatWindow
      v-for="chatuser in chatusers"
      :key="chatuser.id"
      :nickname="chatuser.nickname"
      :email="chatuser.email"
      :avatar="chatuser.avatar"
      @getFriends="getFriends"
      @deletechat="deletechat"
      style="width:300px;margin-right:40px;margin-top:15vh;height:70vh;float:right;"
    ></ChatWindow>
    <!-- <ChatWindow style="width:18vw;margin-right:50px;height:100vh;float:right"></ChatWindow>
    <ChatWindow style="width:18vw;margin-right:50px;height:100vh;float:right"></ChatWindow>-->

    <!-- <ChatWindow style="width:20vw;margin-right:50px;height:80vh;max-height:80vh;float:right"></ChatWindow> -->
  </div>
</template>

<script>
import Userlist from "@/components/Userlists.vue";
import Friendlist from "@/components/Friendlists.vue";
import ChatWindow from "@/components/ChatWindow.vue";

export default {
  name: "Friends",
  data: () => ({
    search: null,
    nickname: null,
    users: [],
    friends: [],
    chat_user: [],
    chatusers: [],
    chatexist: [],
    showinfo: false,
    img: null,
    nickname: null,
    email: null,
    description: null,
    switcher: 1,
    add_contact: false
  }),
  props: ["usernickname"],
  components: {
    Userlist,
    Friendlist,
    ChatWindow
  },
  methods: {
    null() {},
    searchUsers() {
      this.showinfo = false;
      this.axios
        .post("/api/searchuser", {
          nickname: this.search
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            console.log(successResponse.data.data);
            this.users = successResponse.data.data;
          } else {
          }
        });
    },
    showUserInfo(email) {
      this.axios
        .post("/api/searchone", {
          email: email
        })
        .then(successResponse => {
          if (successResponse.data.code === 200) {
            console.log(successResponse.data.data);
            this.nickname = successResponse.data.data.nickname;
            this.email = successResponse.data.data.email;
            this.description = successResponse.data.data.description;
            this.img = successResponse.data.data.avatar;
            this.showinfo = true;
          } else {
          }
        });
    },
    showChatWindow(email) {
      console.log(email);
      if (this.chatexist.indexOf(email) === -1) {
        this.axios
          .post("/api/searchone", {
            email: email
          })
          .then(successResponse => {
            if (successResponse.data.code === 200) {
              console.log(successResponse.data.data);
              this.chat_user = successResponse.data.data;
              this.chatusers.push(this.chat_user);
            } else {
            }
          });
        this.chatexist.push(email);
      }
    },
    deletechat(email) {
      this.chatexist.splice(email, 1);

      for (var i = 0; i < this.chatusers.length; i++) {
        if (this.chatusers[i].email == email) {
          this.chatusers.splice(i, 1);
        }
      }
    },
    sendNofitication() {
      this.axios.post("/api/push/sendFI", {
        userB: this.email,
        category: "friendinvite"
      });
    },
    contactmode() {
      this.switcher = 1;
      this.showinfo = false;
      console.log(this.chatexist);
    },
    searchmode() {
      this.switcher = 2;
      this.showinfo = false;
      console.log(this.chatexist);
    },
    addContact() {
      this.sendNofitication();
      this.add_contact = true;
    },
    getFriends() {
      this.axios.get("/api/relation/friends").then(response => {
        this.friends = response.data.data;
      });
    }
  },
  mounted() {
    this.getFriends();
  }
};
</script>

<style lang="scss" scoped>
#user_info {
  width: 320px;
  height: 500px;
  margin-left: 300px;
  margin-top: 0px;
  //   display: inline-block;
  vertical-align: top;
  position: absolute;
}

.md-list {
  margin-left: 0px;
  float: left;
  width: 263px;
  height: 100vh;
  display: inline-block;
  vertical-align: top;
  border-right: 1px solid rgba(#000, 0.12);
}

.md-tabs {
  margin-left: 17px;
  margin-top: -10px;
  width: 246px;
  border-right: 1px solid rgba(#000, 0.12);
}

#window {
  // float: right;
  // width: 400px;
  // top: 90px;
  width: 80%;
  // height: 70vw;
  // vertical-align: top;
  // right:100px;
  // background-color: #888;
  left: 300px;
  max-height: 1000px;
  position: absolute;
}
</style>
