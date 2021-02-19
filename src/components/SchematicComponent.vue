<template>
  <g v-html="formattedSVG"
    @mousedown.exact="$emit('component-mousedown', component, $event)"
    @mousedown.ctrl.exact="$emit('component-mousedownctrl', component, $event)"
    @mousemove="$emit('component-mousemove', component, $event)"
    @mouseup="$emit('component-mouseup', component, $event)">
  </g>
</template>

<script>
export default {
  name: 'SchematicComponent',
  props: {
    component: Object,
  },
  computed: {
    // Apply all replacements with a regex
    formattedSVG: function() {
      let computedSVG = this.svgTemplate;
      for (const property in this.component.properties) {
        if (this.component.properties.hasOwnProperty(property)) {
          computedSVG = computedSVG.replace(
              new RegExp('\\$\\{' + property + '\\}', 'g'),
              this.component.properties[property]);
        }
      }
      return computedSVG;
    },
    svgTemplate: function() {
      let svgTemplate = '';

      // Set up group with shared properties
      svgTemplate +=
        '<g id=\"${componentID}\" transform=\"translate(${x},${y})' +
        'translate(${dragX},${dragY})\" stroke=\"${strokeColour}\">' +
        '<title>ID: ${componentID} Type: ${componentName}</title>';

      // Create body using custom path if present, else just
      // use a rectangle and text of the component name
      if (this.component.customBodyPath !== '') {
        svgTemplate +=
          `<path d=\"${this.component.customBodyPath}\" fill=\"#fff\"/>`;
      } else {
        svgTemplate +=
          '<rect height=\"150\" width=\"150\" x=\"0\" y=\"0\" fill=\"#fff\"/>' +
          '<text xml:space=\"preserve\" text-anchor=\"middle\"' +
          'font-family=\"sans-serif\" font-size=\"15\" y=\"80\" x=\"75\"' +
          'fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"0\"' +
          'fill=\"#000000\">${componentName}</text>';
      }

      // Terminate group
      svgTemplate += '</g>';
      return svgTemplate;
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
