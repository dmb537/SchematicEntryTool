<template>
  <div v-html="svg">
  </div>
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
      for (const property in this.component.displayProperties) {
        if (this.component.displayProperties.hasOwnProperty(property)) {
          computedSVG = computedSVG.replace(
              new RegExp('\\$\\{' + property + '\\}', 'g'),
              this.component.displayProperties[property]);
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
