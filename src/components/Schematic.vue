<template>
  <div>
      <svg ref="box" class="box unselectable-text" width="100%" height="100%">
        <SchematicComponent v-for="component in design.components"
            :key="component.displayProperties.componentID">
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
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
