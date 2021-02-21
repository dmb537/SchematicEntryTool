<template>
  <div id="component-pane">
    <!--<button v-on:click="$emit('draw-shape')">Add Rectangle</button>
    <button v-on:click="$emit('remove-shape')">Remove Last</button>-->
    <div width="100%"
        class="unselectable-text">
      Provided Components
    </div>
    <StoreComponent v-for="component in components"
      :key="component.componentID"
      :component="component"
      >
    </StoreComponent>
  </div>
</template>

<script>
import StoreComponent from './StoreComponent.vue';

export default {
  name: 'ComponentPane',
  components: {
    StoreComponent,
  },
  props: {
    components: Array,
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
