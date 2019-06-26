export default class Fetch {
  constructor() {

  }

  checkLogin() {
    this.axios
      .post("/api/check")
      .then(successResponse => {
        this.responseResult = JSON.stringify(successResponse.data)
        if (successResponse.data.code === 200 && successResponse.data.message === '认证成功') {
          
        } else {
          this.$router.push({
            path: '/'
          })
        }
      })
      .catch(failResponse => {});
  }
}
