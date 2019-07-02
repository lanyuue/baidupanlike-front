<template>
  <div style="height:100vh">
    <md-card style="width:600px;margin:0 auto">
      <md-card-header>
        <md-avatar>
          <img src="/assets/examples/avatar.png" alt="Avatar" />
        </md-avatar>

        <div class="md-title" style="text-align:left">好友申请</div>
        <div class="md-subhead" style="text-align:left">夜凉请求加你为好友</div>
      </md-card-header>

      <md-card-actions>
        <md-button>忽略</md-button>
        <md-button class="md-primary">同意</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
export default {
  name: "Notifylists",
  data: {}
};
</script>