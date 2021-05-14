<template>
  <v-container fill-height>
    <v-toolbar elevation="0" depressed dense class="fixed-bar my-2">
      <h1 class="blue-grey--text darken-4 page-title">All Devices</h1>
      <v-spacer></v-spacer>
      <v-btn
          depressed
          color="primary"
          @click="openNewDeviceModelDialog"
          class="mr-2"
      >
        <v-icon left>
          mdi-plus
        </v-icon>
        Device
      </v-btn>
      <v-btn
          outlined
          color="primary"
          @click="logout"
      >
        Logout
      </v-btn>
    </v-toolbar>
    <div class="devices">
      <div v-if="deviceList.length">
        <v-row>
          <v-col class="d-flex my-2" v-for="device in deviceList" :key="device.Id">
            <v-card
                class="mx-auto d-flex flex-column device-card"
                width="250"
                height="100%"
            >
              <v-card-text class="flex-grow-1">
                <h2 v-if="device.Name">{{device.Name}}</h2>
                <h4 v-if="device.BrandId">{{device.BrandId}}</h4>
                <p v-if="device.Description">{{device.Description}}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn depressed small color="primary" @click="openDeviceModelDialog(device)">
                  VIEW DETAILS
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <div v-else>
        <div v-if="!showLoadingProgress">
          No Devices to Show
        </div>
      </div>
    </div>
    <DeviceModelDialog :deviceModel="currentDeviceModel"></DeviceModelDialog>
    <NewDeviceModelDialog></NewDeviceModelDialog>
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
import {Component, Vue} from "vue-property-decorator";
import axios from "axios";
import DeviceModelDialog from "@/components/DeviceModelDialog.vue";
import NewDeviceModelDialog from "@/components/NewDeviceModelDialog.vue";

@Component({
  components: {
    DeviceModelDialog,
    NewDeviceModelDialog
  }
})
export default class Login extends Vue {
  private host: string = "http://163.47.115.230:30000/api/overview/modeltype";
  private currentDeviceModel = null;
  private showLoadingProgress:boolean = false;

  get loginSuccessData():any {
    return this.$store.state.loginSuccessData;
  }
  get deviceList():any {
    return this.$store.state.deviceList;
  }

  mounted() {
    this.resetAll();
    this.getAllDevices();
  }
  resetAll():void {
    this.currentDeviceModel = null;
    this.showLoadingProgress = false;
  }
  logout():void {
    this.$store.commit("storeLoginSuccessData", null);
    this.goToPage("/");
  }
  goToPage(routePath:string):void {
    if(this.$route.path != routePath) {
      this.$router.push({'path': routePath}).catch(err => {
        console.log("Error occurred while changing route");
      });
    }
  }
  getAllDevices():void {
    if(this.loginSuccessData) {
      this.showLoadingProgress = true;
      let lData:string = JSON.stringify(this.loginSuccessData);
      let accessToken:string = JSON.parse(lData).access_token;
      let config:any = {
        method: 'get',
        url: this.host,
        headers: {
          'authorization': accessToken,
          'Content-Type': 'application/json'
        },
        data : lData
      };

      let that = this;
      axios(config)
          .then(function (response) {
            that.showLoadingProgress = false;
            that.$store.commit("storeIntoDeviceList", response.data);
            // console.log(response.data);
          })
          .catch(function (error) {
            that.showLoadingProgress = false;
            console.log(error);
          });
    } else {
      this.goToPage("/");
    }
  }
  openDeviceModelDialog(deviceModel:any):void {
    this.currentDeviceModel = deviceModel;
    this.$store.commit("openDeviceModelDialog", true);
  }
  openNewDeviceModelDialog():void {
    this.$store.commit("openNewDeviceModelDialog", true);
  }
}
</script>

<style scoped>
  .fixed-bar {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 2;

  }
  .device-card {
    background: #f45b69 !important;
  }
  @media only screen and (max-width: 600px) {
    .page-title {
      font-size: 1rem;
    }
  }
</style>
