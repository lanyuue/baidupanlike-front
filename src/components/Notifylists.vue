<template>
  <div>
    <md-card style="width:600px;margin:0 auto">
      <md-card-header>
        <md-avatar>
          <img :src="avatar" alt="Avatar" />
        </md-avatar>

        <div class="md-title" style="text-align:left">好友申请</div>
        <div class="md-subhead" style="text-align:left">{{ nickname }}({{ email }})请求加你为好友</div>
      </md-card-header>

      <md-card-actions>
        <md-button @click="ignoreRequest">忽略</md-button>
        <md-button class="md-primary" @click="acceptRequest">同意</md-button>
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
  props: ["nickname", "email", "avatar", "id"],
  methods: {
    ignoreRequest() {
      this.axios.get("/api/push/checked/" + this.id).then(() => {
        this.$emit("getNotifications");
      });
    },
    acceptRequest() {}
  }
};
</script>