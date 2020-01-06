<template>
  <div class="container">
    <div class="family-name">{{ getFamily.familyName }}</div>
    <div class="family-members">{{ getFamily.members }}</div>
    <el-form ref="form" @submit.native.prevent="sendInvite">
      <el-form-item>
        <label>Invite a household member</label>
        <el-input v-model="inviteEmail" placeholder="Email"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="sendInvite">Send Invitation</el-button>
      </el-form-item>
    </el-form>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <div v-if="submitted">
      <div>Invitation was just sent!</div>
    </div> 
  </div>
</template>

<script>
import { GetFamily, InviteMember } from '../constants/query.gql'
import { validateEmail } from '@/helpers/helpers'

export default {
  data() {
    return {
      getFamily: {},
      inviteEmail: '',
      error: false,
      submitted: false
    }
  },
  apollo: {
    getFamily: {
      query: GetFamily,
    },
  },
  methods: {
    sendInvite() {
      const email = this.inviteEmail;
      const familyId = this.getFamily.id;
      if (!email || !validateEmail(email)) {
        this.error = "Please enter a valid email";
        return
      }
      this.$apollo.mutate({
        mutation: InviteMember,
        variables: {email, familyId}
      }).then(({data}) => {
        this.submitted = true;
        this.error = false;
        console.log(data.captureEmail.id)
      }).catch((error) => {
        if (error.graphQLErrors.length >= 1) {
          this.error = error.graphQLErrors[0].message;
        } else {
          this.error = 'Something went wrong';
        }
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100% - 52px);
}
</style>