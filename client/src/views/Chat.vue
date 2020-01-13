<template>
  <div class="container">
    <div class="space">
      {{getMessages}}
    </div>
  </div>
</template>

<script>
import { GetMessages } from '../constants/query.gql'

export default {
  data() {
    return {
      getMessages: []
    }
  },
  apollo: {
    getMessages: {
      query: GetMessages
    }
  }
}
</script>

<style>

</style>