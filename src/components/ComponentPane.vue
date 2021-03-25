<template>
  <div id="component-pane">
    <div width="100%"
        class="unselectable-text">
      Provided Components
    </div>
    <StoreComponent v-for="component in components"
      :key="component.componentID"
      :component="component"
      >
    </StoreComponent>
    <div width="100%"
        class="unselectable-text">
      Generated Components
    </div>
    <GeneratedComponent v-for="design in designs"
      :key="design.id"
      >
    </GeneratedComponent>
  </div>
</template>

<script>
import StoreComponent from './StoreComponent.vue';
import GeneratedComponent from './GeneratedComponent.vue';

export default {
  name: 'ComponentPane',
  components: {
    StoreComponent,
    GeneratedComponent,
  },
  props: {
    components: Array,
    designs: Array,
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
