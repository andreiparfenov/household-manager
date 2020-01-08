<template>
  <div class="container">
    <div class="family-info">
      <div class="name">{{ getFamily.familyName }} Household</div>
      <div class="members">
        <div class="item" v-for="member in registeredMembers" :key="member.id":style="{ background: '#' + member.avatarColor }">
          <span class="item-initials">{{ initials(member.firstname) }}{{ initials(member.lastname) }}</span>
        </div>
        <div class="item add">+</div>
      </div>
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
  computed: {
    registeredMembers: function() {
      if (this.getFamily && Object.entries(this.getFamily).length !== 0) {
        return this.getFamily.members.filter(m => m.firstname)
      }
    }
  },
  methods: {
    initials(name) {
      if (name && name.length > 0) {
        return name.charAt(0);
      }
    },
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

<style lang="scss" scoped>
.container {
  width: 100%;
  height: calc(100% - 52px);

  .family-info {
    .name {
      font-size: 24px;
    }
    .members {
      display: flex;

      .item {
        border-radius: 50%;
        width: 36px;
        height: 36px;
        padding: 8px;
        margin: 3px;
        color: #fff;
        text-align: center;
        font-size: 26px;

        &-initials {
          text-transform: uppercase;
        }

        &.add {
          width: 34px;
          height: 34px;
          border: 2px solid #fff;
          font-size: 22px;
        }
      }
    }
  }
}
</style>