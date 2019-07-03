<template>
  <!-- <md-list class="md-double-line"> -->
  <md-list-item @click="showinfo">
    <md-avatar>
      <img :src="avatar" alt="People" />
    </md-avatar>

    <div class="md-list-item-text">
      <span>{{ nickname }}</span>
      <span>{{ email }}</span>
    </div>

    <md-button class="md-icon-button md-list-action">
      <md-icon>person_add</md-icon>
    </md-button>
  </md-list-item>
  <!-- </md-list> -->
</template>

<script>
export default {
  name: "Userlists",
  data: () => ({
    users: []
  }),
  props: ["nickname", "email", "avatar"],
  methods: {
    showinfo() {
      console.log(this.email);
      this.$emit("showUserInfo", this.email);
    }
  }
};
</script>
