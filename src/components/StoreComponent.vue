<template>
  <div>
    <svg width="80%" viewBox="-25 -25 200 200"
        class="component-preview unselectable-text"
        :key="component.name"
        @click="addComponent">
        <g
        :id="component.properties.componentID"
        stroke="#000">
        <title>
          {{ component.properties.componentID }}
          {{ component.properties.componentName }}
        </title>
        <ComponentBody
          :component="component" />
        <ComponentPin v-for="pin in component.pins" :key="pin.name"
          :properties="component.properties"
          :pin="pin" />
      </g>
    </svg>
  </div>
</template>

<script>
import ComponentBody from './ComponentBody';
import ComponentPin from './ComponentPin';

export default {
  name: 'StoreComponent',
  components: {
    ComponentBody,
    ComponentPin,
  },
  props: {
    component: Object,
  },
  computed: {
  },
  methods: {
    addComponent() {
      this.$store.dispatch('addNewComponent', this.component);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.component-preview {
  background-color:#FFFFFF
}
</style>
