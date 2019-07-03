<template>
  <!-- <md-list class="md-double-line"> -->
  <div id="body" style="border:1px solid rgba(#000, 0.12)">
    <md-list-item @click="showChatWindow">
      <md-avatar>
        <img :src="avatar" alt="People" />
      </md-avatar>

      <div class="md-list-item-text">
        <span>{{ nickname }}</span>
        <span>{{ description }}</span>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>sms</md-icon>
      </md-button>
    </md-list-item>
  </div>
  <!-- </md-list> -->
</template>

<script>
export default {
  name: "Friendlists",
  data: () => ({
    friends: []
  }),
  props: ["nickname", "avatar", "description", "email"],
  methods: {
    showChatWindow() {
        // console.log(this.email);
        this.$emit("showChatWindow", this.email);
    }
  }
};
</script>

<style scoped>
#body {
    border:1px solid rgba(#000, 0.12);
}
</style>

