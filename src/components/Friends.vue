<template>
  <div style="height:100vh">
    <md-tabs class="md-tabs" style>
      <md-tab id="tab-home" md-label="消息"></md-tab>
      <md-tab id="tab-pages" md-label="联系人"></md-tab>
      <md-tab id="tab-posts" md-label="共享文件"></md-tab>
    </md-tabs>

    

    <md-list class="md-double-line">
        <Userlist
      v-for="user in users"
      :key="user.id"
      :nickname="user.nickname"
      :email="user.email"
      :description="user.description"
    ></Userlist>
      <!-- <md-list-item>
        <md-avatar>
          <img src="https://placeimg.com/40/40/people/1" alt="People" />
        </md-avatar>

        <div class="md-list-item-text">
          <span>Ali Connors</span>
          <span>Brunch this weekend?</span>
          <p>I'll be in your neighborhood doing errands this week. Do you want to meet?</p>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon class="md-primary">star</md-icon>
        </md-button>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-list-item>
        <md-avatar>
          <img src="https://placeimg.com/40/40/people/6" alt="People" />
        </md-avatar>

        <div class="md-list-item-text">
          <span>me, Scott, Jennifer</span>
          <span>Summer BBQ</span>
          <p>Wish I could come, but I'm out of town this week. :(</p>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon>star_border</md-icon>
        </md-button>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-list-item>
        <md-avatar>
          <img src="https://placeimg.com/40/40/people/5" alt="People" />
        </md-avatar>

        <div class="md-list-item-text">
          <span>Sandra Adams</span>
          <span>Oui oui</span>
          <p>Do you have Paris recommendations? Have you visited good places?</p>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon>star_border</md-icon>
        </md-button>
      </md-list-item>

      <md-divider class="md-inset"></md-divider>

      <md-list-item>
        <md-avatar>
          <img src="https://placeimg.com/40/40/people/8" alt="People" />
        </md-avatar>

        <div class="md-list-item-text">
          <span>Trevor Hansen</span>
          <span>Order confirmation</span>
          <p>Thank you for your recent order from Amazon</p>
        </div>

        <md-button class="md-icon-button md-list-action">
          <md-icon>star_border</md-icon>
        </md-button>
      </md-list-item> -->

      <md-field md-clearable class="md-toolbar-section-end" style="width:230px">
        <md-input placeholder="搜索用户 ..." v-model="search" @input="searchUsers" />
      </md-field>
    </md-list>
    <md-card class="md-elevation-0">
      <md-card-header>
        <div class="md-title"></div>
      </md-card-header>

      <md-card-content></md-card-content>
    </md-card>
  </div>
</template>

<script>
import Userlist from "@/components/Userlists.vue";

export default {
  name: "Friends",
  data: () => ({
    search: null,
    nickname: null,
    users: []
  }),
  components: {
    Userlist
  },
  methods: {
    null() {},
    searchUsers() {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.md-card {
  width: 72vw;
  height: 100vh;
  margin-left: 290px;
  margin-top: -49px;
  //   display: inline-block;
  vertical-align: top;
  position: absolute;
}

.md-list {
  margin-left: 22px;
  float: left;
  width: 263px;
  height: 100vh;
  display: inline-block;
  vertical-align: top;
  border-right: 1px solid rgba(#000, 0.12);
}

.md-tabs {
  margin-left: 22px;
  margin-top: -10px;
  width: 263px;
  border-right: 1px solid rgba(#000, 0.12);
}
</style>
