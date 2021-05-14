<template>
  <v-container fluid fill-height>
    <div class="login">
      <v-text-field
          v-model="email"
          label="Email"
          :rules="[rules.required]"
          outlined
      ></v-text-field>
      <v-text-field
          v-model="password"
          label="Password"
          :type="showPass ? 'text' : 'password'"
          :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
          :rules="[rules.required]"
          @click:append="showPass = !showPass"
          outlined
      ></v-text-field>
      <v-btn
          depressed
          color="primary"
          @click="login"
      >
        Login
      </v-btn>
    </div>
    <v-snackbar
        v-model="showFailSnackbar"
        timeout="2000"
        color="red"
    >
      <v-alert type="error">
        Login Failed !!!
      </v-alert>
    </v-snackbar>
    <v-overlay :value="showLoadingProgress">
      <v-progress-circular
          :size="70"
          :width="3"
          color="white"
          indeterminate
      >Loading</v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';

@Component
export default class Login extends Vue {
  private host:string = "http://163.47.115.230:30000/api/login";
  private email:string = "";
  private password:string = "";
  private showPass:boolean = false;
  private showFailSnackbar:boolean = false;
  private showLoadingProgress:boolean = false;
  private rules:any = {
    required: (value: any) => !!value || 'Required.'
  };
  get loginSuccessData():any {
    return this.$store.state.loginSuccessData;
  }
  mounted() {
    this.resetAll();
    this.redirectLoggedInRoute(this.loginSuccessData);
  }

  resetAll() {
    this.showFailSnackbar = false;
    this.showLoadingProgress = false;
  }

  redirectLoggedInRoute(loginSuccessData:any):void {
    loginSuccessData ? this.goToPage('devices') : this.goToPage('/');
  }
  goToPage(routePath:string):void {
    if(this.$route.path != routePath) {
      this.$router.push({'path': routePath}).catch(err => {
        console.error("Error occurred while changing route");
      });
    }
  }
  login():void {
    this.showLoadingProgress = true;
    let data:any = {
      email: this.email,
      password: this.password
    }

    let config:any = {
      method: 'post',
      url: this.host,
      data : data
    };

    let that = this;
    axios(config)
        .then(function (response:any) {
          if(response.statusText == "OK") {
            that.showLoadingProgress = false;
            that.$store.commit("storeLoginSuccessData", response.data);
            that.goToPage('devices');
          }
        })
        .catch(function (error:any) {
          that.showLoadingProgress = false;
          that.showFailSnackbar = true;
          console.log(error);
        });

  }
}
</script>

<style scoped>
.container {
  background: #f45b69 !important;
}

.login {
  overflow: hidden;
  background-color: white;
  padding: 40px 30px 30px 30px;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  -o-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-transition: -webkit-transform 300ms, box-shadow 300ms;
  -moz-transition: -moz-transform 300ms, box-shadow 300ms;
  transition: transform 300ms, box-shadow 300ms;
  box-shadow: 5px 10px 10px rgba(2, 128, 144, 0.2);
}
.login::before, .login::after {
  content: "";
  position: absolute;
  width: 600px;
  height: 600px;
  border-top-left-radius: 40%;
  border-top-right-radius: 45%;
  border-bottom-left-radius: 35%;
  border-bottom-right-radius: 40%;
  z-index: -1;
}
.login::before {
  left: 40%;
  bottom: -130%;
  background-color: rgba(69, 105, 144, 0.15);
  -webkit-animation: wawes 6s infinite linear;
  -moz-animation: wawes 6s infinite linear;
  animation: wawes 6s infinite linear;
}
.login::after {
  left: 35%;
  bottom: -125%;
  background-color: rgba(2, 128, 144, 0.2);
  -webkit-animation: wawes 7s infinite;
  -moz-animation: wawes 7s infinite;
  animation: wawes 7s infinite;
}
.login > input {
  font-family: "Asap", sans-serif;
  display: block;
  border-radius: 5px;
  font-size: 16px;
  background: white;
  width: 100%;
  border: 0;
  padding: 10px 10px;
  margin: 15px -10px;
}
.login > button {
  font-family: "Asap", sans-serif;
  cursor: pointer;
  color: #fff;
  font-size: 16px;
  text-transform: uppercase;
  width: 80px;
  border: 0;
  padding: 10px 0;
  margin-top: 10px;
  margin-left: -5px;
  border-radius: 5px;
  background-color: #f45b69;
  -webkit-transition: background-color 300ms;
  -moz-transition: background-color 300ms;
  transition: background-color 300ms;
}
.login > button:hover {
  background-color: #f24353;
}

@-webkit-keyframes wawes {
  from {
    -webkit-transform: rotate(0);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes wawes {
  from {
    -moz-transform: rotate(0);
  }
  to {
    -moz-transform: rotate(360deg);
  }
}
@keyframes wawes {
  from {
    -webkit-transform: rotate(0);
    -moz-transform: rotate(0);
    -ms-transform: rotate(0);
    -o-transform: rotate(0);
    transform: rotate(0);
  }
  to {
    -webkit-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.6);
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 12px;
}
</style>
