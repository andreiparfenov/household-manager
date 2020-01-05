<template>
  <div>
    <div class="container">
      <aside class="tree-root">
        <div v-if="getFamily.id" class="tree-item"
            @click.left.stop="$router.push({name: 'folder', params: {id: getFamily.id}})">
          <div class="tree-plate"  v-bind:class="{active: $route.params.id === getFamily.id}">
            <div class="circle"></div>
            <span class="folder no-select-color familyname">{{ getFamily.name }}</span>
          </div>
        </div>

      </aside>

      <div class="workspace-main">
        <router-view :key="$route.fullPath"></router-view>
      </div>

    </div>

  </div>

</template>

<script>
import { GetFamily } from '../constants/query.gql'
export default {
  data() {
    return {
      getFamily: {},
    }
  },
  apollo: {
    getFamily: {
      query: GetFamily,
    },
  },
}
</script>

<style scoped>
.container {
  width: 100%;
  height: calc(100% - 52px);
}
.plus-button {
  position: absolute;
  right: 0;
  top: 7px;
  margin: 0 2px;
}
aside {
  width: 220px;
  height: 100%;
  display: inline-block;
}
.workspace-main {
  flex: 1 1;
}
</style>