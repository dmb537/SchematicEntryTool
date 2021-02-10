<template>
  <div class="component-pane">
    <!--<button v-on:click="$emit('draw-shape')">Add Rectangle</button>
    <button v-on:click="$emit('remove-shape')">Remove Last</button>-->
    <template v-for="component in components">
      <div
      :key="component.name">
        <button
          @click="$emit('add-component', component)">
          {{ component.componentName }}
        </button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ComponentPane',
  props: {
    components: Array,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
