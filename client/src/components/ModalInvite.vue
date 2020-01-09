<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
              Invite New Household Member
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
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
              <el-button @click="$emit('close')">Close</el-button>
            </slot>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { validateEmail } from '@/helpers/helpers'
import { InviteMember } from '../constants/query.gql'

export default {
  data() {
    return {
      inviteEmail: '',
      error: false,
      submitted: false
    }
  },
  props: [ 'familyId' ],
  methods: {
    sendInvite() {
      const email = this.inviteEmail;
      const familyId = this.familyId;
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

<style lang="scss" scoped>
.modal {
  &-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
  }

  &-wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &-container {
    width: 30%;
    margin: 0px auto;
    padding: 20px 30px;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    color: #000;
  }

  &-header {
    margin-top: 0;
  }

  &-body {
    margin: 20px 0;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>