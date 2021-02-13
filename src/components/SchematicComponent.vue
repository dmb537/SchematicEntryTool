<template>
  <g v-html="svg"
    @click="$emit('component-clicked', component)">
  </g>
</template>

<script>
export default {
  name: 'SchematicComponent',
  props: {
    component: Object,
  },
  computed: {
    svg: function() {
      let computedSVG = this.component.customSVG;
      for (const property in this.component.properties) {
        if (this.component.properties.hasOwnProperty(property)) {
          computedSVG = computedSVG.replace(
              new RegExp('\\$\\{' + property + '\\}', 'g'),
              this.component.properties[property]);
        }
      }
      return computedSVG;
    },
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.component-preview {
  background-color:#FFFFFF
}
</style>
