<template>
  <div>
      <svg ref="box" class="box unselectable-text" width="100%" height="100%"
        @mousemove="backgroundMouseMove"
        @dblclick="$store.commit('deselectAll')">
        <SchematicComponent v-for="component in design.components"
            :key="component.properties.componentID"
            :design="design"
            :component="component">
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
    index: Number,
  },
  computed: {
    design() {
      return this.$store.state.designs[this.index];
    },
  },
  data() {
    return {
    };
  },
  methods: {
    backgroundMouseMove(event) {
      if (this.design.isDragging) {
        this.$store.commit('modifyDrag', event);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
