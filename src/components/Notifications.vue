<template>
  <div>
    <Notifylists></Notifylists>
  </div>
</template>

<script>
import Notifylists from "@/components/Notifylists.vue";

export default {
  name: "Notifications",
  data: {
    notifications: []
  },
  components: {
    Notifylists
  },
  methods: {
    getNotifications() {
      this.axios.get("/api/push/retrieve/").then(response => {
        this.notifications = response.data.data;
      });
    },
  }
};
</script>

