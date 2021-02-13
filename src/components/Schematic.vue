<template>
  <div>
      <svg ref="box" class="box unselectable-text" width="100%" height="100%"
        @dblclick="deselect">
        <SchematicComponent v-for="component in design.components"
            :key="component.properties.componentID"
            :component="component"
            @component-clicked="select">
        </SchematicComponent>
      </svg>
  </div>
</template>

<script>
import SchematicComponent from './SchematicComponent';

export default {
  name: 'Schematic',
  components: {
    SchematicComponent,
  },
  props: {
    design: Object,
  },
  data() {
    return {
      selectedComponents: [],
    };
  },
  methods: {
    select(component) {
      this.selectedComponents.push(component);
      this.$emit('select-components', [component]);
    },
    deselect() {
      this.$emit('deselect-components', this.selectedComponents);
      this.selectedComponents = [];
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
