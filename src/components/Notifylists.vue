<template>
  <div>
    <md-card style="width:600px;margin:0 auto">
      <md-card-header>
        <md-avatar>
          <img :src="avatar" alt="Avatar" />
        </md-avatar>

        <div class="md-title" style="text-align:left" v-if=" !this.description ">好友申请</div>
        <div class="md-subhead" style="text-align:left;margin-left:56px" v-if=" !this.description ">{{ nickname }}({{ email }})请求加你为好友</div>

        <div class="md-title" style="text-align:left" v-if=" this.description ">文件分享</div>
        <div class="md-subhead" style="text-align:left;margin-left:56px" v-if=" this.description ">{{ nickname }}({{ email }})给你分享了{{ description }}，快去看看吧！</div>
      </md-card-header>

      <md-card-actions>
        <md-button @click="ignoreRequest">忽略</md-button>
        <md-button class="md-primary" @click="acceptRequest" v-if=" !this.description ">同意</md-button>

        <!-- <md-button @click="ignoreFileShare" v-if=" this.description ">忽略</md-button> -->
      </md-card-actions>
    </md-card>
    <br />
  </div>
</template>

<script>
export default {
  name: "Notifylists",
  data: () => ({
    notifications: []
  }),
  props: ["nickname", "email", "avatar", "id", "description"],
  methods: {
    ignoreRequest() {
      this.axios.get("/api/push/checked/" + this.id).then(() => {
        this.$emit("getNotifications");
      });
    },
    acceptRequest() {
      this.axios.post("/api/relation/create/" + this.id).then(() => {
        this.axios.get("/api/push/checked/" + this.id).then(() => {
          this.$emit("getNotifications");
        });
      });
    }
  }
};
</script>