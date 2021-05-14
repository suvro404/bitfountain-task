<template>
  <v-dialog
      v-model="newDeviceModelDialogOpened"
      scrollable
      min-width="300" max-width="700"
  >
    <v-card class="device-model-card">
      <v-card-title class="headline grey lighten-2 d-flex justify-center">
        Create Device Model
      </v-card-title>

      <v-card-text class="mt-4">
        <div class="mt-4">
          <v-text-field
              v-model="deviceModelData.Name"
              label="Name"
              :rules="[rules.required]"
              color="black"
              outlined
          ></v-text-field>
          <v-text-field
              v-model="deviceModelData.BrandId"
              label="Brand"
              :rules="[rules.required]"
              outlined
          ></v-text-field>
          <v-text-field
              v-model="deviceModelData.TypeId"
              label="Type ID"
              :rules="[rules.required]"
              type="number"
              outlined
          ></v-text-field>
          <v-text-field
              v-model="deviceModelData.Comment"
              label="Comment"
              :rules="[rules.required]"
              outlined
          ></v-text-field>
        </div>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="grey lighten-2 d-flex justify-center">
        <v-btn
            color="primary"
            @click="createDeviceModel"
        >
          CREATE
        </v-btn>
        <v-btn
            color="primary"
            @click="closeDialog"
            outlined
        >
          CLOSE
        </v-btn>
      </v-card-actions>
      <v-snackbar
          v-model="showSuccessSnackbar"
          timeout="2000"
          color="green"
      >
        <v-alert type="success">
          New Device Model Created.
        </v-alert>
      </v-snackbar>
      <v-snackbar
          v-model="showFailSnackbar"
          timeout="1000"
          color="red"
      >
        <v-alert type="error">
          Device Model Creation Failed!
        </v-alert>
      </v-snackbar>
      <v-snackbar
          v-model="showWarningSnackbar"
          timeout="2000"
          color="orange"
      >
        <v-alert type="warning">
          Please fill all required field.
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
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import axios from "axios";

@Component
export default class NewDeviceModelDialog extends Vue {

  private host: string = "http://163.47.115.230:30000/api/devicemodel";
  private showLoadingProgress:boolean = false;
  private showSuccessSnackbar:boolean = false;
  private showFailSnackbar:boolean = false;
  private showWarningSnackbar:boolean = false;
  private deviceModelData:any = {
    BrandId: "",
    Name: "",
    TypeId: "",
    Comment: ""
  };
  private rules:any = {
    required: (value: any) => !!value || 'Required.'
  };

  get loginSuccessData():any {
    return this.$store.state.loginSuccessData;
  }

  get newDeviceModelDialogOpened():boolean {
    return this.$store.state.newDeviceModelDialogOpened;
  }

  set newDeviceModelDialogOpened(value:boolean) {
    this.$store.commit("openNewDeviceModelDialog", value);
  }


  closeDialog():void {
    this.$store.commit("openNewDeviceModelDialog", false);
  }

  mounted() {
    this.resetAll();
  }
  resetAll():void {
    this.showLoadingProgress = false;
    this.showSuccessSnackbar = false;
    this.showFailSnackbar = false;
    this.showWarningSnackbar = false;
  }

  createDeviceModel():void {
    if(!this.isInValid(this.deviceModelData) && this.loginSuccessData) {
      this.showLoadingProgress = true;
      this.showSuccessSnackbar = false;
      this.showFailSnackbar = false;
      this.showWarningSnackbar = false;
      let lData:string = JSON.stringify(this.loginSuccessData);
      let accessToken:string = JSON.parse(lData).access_token;
      this.deviceModelData.TypeId = parseInt(this.deviceModelData.TypeId);
      let config:any = {
        method: 'post',
        url: this.host,
        headers: {
          'authorization': accessToken
        },
        data : this.deviceModelData
      };

      let that = this;
      axios(config)
          .then(function (response:any) {
            that.showLoadingProgress = false;
            that.showSuccessSnackbar = true;
            setTimeout(function(){
              that.$store.commit("openNewDeviceModelDialog", false);
              }, 1000);
          })
          .catch(function (error:any) {
            that.showLoadingProgress = false;
            that.showFailSnackbar = true;
            console.log(error);
          });
    } else {
      this.showWarningSnackbar = true;
    }
  }

  isInValid(obj:any):boolean {
    for (var key in obj) {
      if (obj[key] == null || obj[key] == "")
        return true;
    }
    return false;
  }

}
</script>

<style scoped>

</style>