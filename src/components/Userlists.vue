<template>
  <!-- <md-list class="md-double-line"> -->
  <md-list-item>
    <md-avatar>
      <img :src="description" alt="People" />
    </md-avatar>

    <div class="md-list-item-text">
      <span>{{ nickname }}</span>
      <span>{{ email }}</span>
    </div>

    <md-button class="md-icon-button md-list-action">
      <md-icon class="md-primary">star_border</md-icon>
    </md-button>
  </md-list-item>
  <!-- </md-list> -->
</template>

<script>
export default {
  name: "Userlists",
   data: () => ({
    users: [],
  }),
  props: ["nickname", "email", "description"]
};
</script>
