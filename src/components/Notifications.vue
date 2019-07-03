<template>
  <div  style="height:100vh">
    <Notifylists
      v-for="notification in notifications"
      :key="notification.id"
      :id="notification.id"
      :nickname="notification.nickname"
      :email="notification.email"
      :avatar="notification.avatar"
      @getNotifications="getNotifications"
    ></Notifylists>

    <md-empty-state
      class="md-primary"
      md-icon="done"
      md-label="没有新通知"
      md-description="太棒了！您已经处理完了所有消息。"
      v-show="notifications.length == 0">
    </md-empty-state>
  </div>
</template>

<script>
import Notifylists from "@/components/Notifylists.vue";

export default {
  name: "Notifications",
  data: function() {
    return {
      notifications: []
    };
  },
  components: {
    Notifylists
  },
  methods: {
    getNotifications() {
      this.axios.get("/api/push/retrieve/").then(response => {
        this.notifications = response.data.data;
        console.log(this.notifications);
      });
    }
  },
  mounted() {
    this.getNotifications();
  }
};
</script>

