<template>
  <v-dialog
      v-model="deviceModelDialogOpened"
      scrollable
  >
    <v-card v-if="deviceModel && deviceModelData" class="device-model-card">
      <v-card-title class="headline grey lighten-2 d-flex justify-center">
        {{deviceModel.Name}}
      </v-card-title>

      <v-card-text class="mt-2">
        <div v-if="deviceModelData.length">
          <v-row>
            <v-col class="d-flex my-2" v-for="model in deviceModelData" :key="model.Id">
              <v-card
                  class="mx-auto d-flex flex-column device-card"
                  width="250"
                  height="100%"
              >
                <v-card-text class="flex-grow-1">
                  <h2 v-if="model.DisplayName">{{model.DisplayName}}</h2>
                  <h4 v-if="model.Brand">{{model.Brand}}</h4>
                  <p v-if="model.Description">{{model.Description}}</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else>
          <div v-if="!showLoadingProgress">
            No Device Models to Show
          </div>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="grey lighten-2 d-flex justify-center">
        <v-btn
            color="primary"
            @click="closeDialog"
        >
          CLOSE
        </v-btn>
      </v-card-actions>
      <v-overlay :value="showLoadingProgress">
        <v-progress-circular
            :size="70"
            :width="3"
            color="white"
            indeterminate
        >Loading</v-progress-circular>
      </v-overlay>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Prop, Watch, Vue} from "vue-property-decorator";
import axios from "axios";

@Component
export default class DeviceModelDialog extends Vue {
  @Prop() readonly deviceModel!: any

  private host: string = "http://163.47.115.230:30000/api/overview/modeldata";
  private deviceModelData: any = null;
  private showLoadingProgress:boolean = false;

  get loginSuccessData():any {
    return this.$store.state.loginSuccessData;
  }

  get deviceModelDialogOpened():boolean {
    return this.$store.state.deviceModelDialogOpened;
  }

  set deviceModelDialogOpened(value:boolean) {
    this.$store.commit("openDeviceModelDialog", value);
  }

  @Watch('deviceModelDialogOpened')
  onPropertyChanged(value: boolean, oldValue: boolean) {
    if(value) {
      this.fetchDeviceModel();
    }
  }

  closeDialog():void {
    this.$store.commit("openDeviceModelDialog", false);
  }

  mounted() {
    this.resetAll();
    this.deviceModelData = null;
  }
  resetAll():void {
    this.showLoadingProgress = false;
  }
  fetchDeviceModel():void {
    if(this.loginSuccessData && this.deviceModel) {
      this.showLoadingProgress = true;
      let query:string = this.host + "/" + this.deviceModel.BrandId + "/" + this.deviceModel.Name;
      let lData:string = JSON.stringify(this.loginSuccessData);
      let accessToken:string = JSON.parse(lData).access_token;
      let config:any = {
        method: 'get',
        url: query,
        headers: {
          'authorization': accessToken,
          'Content-Type': 'application/json'
        },
        data : lData
      };

      let that = this;
      axios(config)
          .then(function (response:any) {
            that.showLoadingProgress = false;
            that.deviceModelData = response.data;
            // console.log(response.data);
          })
          .catch(function (error:any) {
            that.showLoadingProgress = false;
            console.log(error);
          });
    }
  }

}
</script>

<style scoped>
.device-model-card {
  background: #f45b69 !important;
}
</style>