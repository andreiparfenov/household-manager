<template>
  <div class="dashboard">
    <div class="family-info">
      <div class="name">{{ getFamily.familyName }} Household</div>
      <div class="members">
        <div class="item" v-for="member in registeredMembers" :key="member.id":style="{ background: '#' + member.avatarColor }">
          <span class="item-initials">{{ initials(member.firstname) }}{{ initials(member.lastname) }}</span>
        </div>
        <div class="item add" @click="inviteModal = true">+</div>
      </div>
    </div>
    <ModalInvite v-if="inviteModal" @close="inviteModal = false" :familyId="getFamily.id" />
  </div>
</template>

<script>
import { GetFamily, InviteMember } from '../constants/query.gql'
import ModalInvite from '../components/ModalInvite'

export default {
  components: {
    ModalInvite
  },
  data() {
    return {
      getFamily: {},
      inviteModal: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  margin-left: 20px;
  margin-top: 20px;
  width: 30%;
  height: calc(100% - 52px);

  .family-info {
    .name {
      font-size: 24px;
      margin-bottom: 20px;
    }
    .members {
      display: flex;

      .item {
        border-radius: 50%;
        width: 36px;
        height: 36px;
        padding: 8px;
        margin-right: 5px;
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

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>