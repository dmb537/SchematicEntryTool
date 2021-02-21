<template>
  <g v-html="bodySVG" class="component-body"/>
</template>


<script>
export default {
  name: 'ComponentBody',
  props: {
    component: Object,
  },
  computed: {
    // Form the SVG for the body of the component
    bodySVG: function() {
      let svgTemplate = '';

      // Create body using custom path if present, else just
      // use a rectangle and text of the component name
      if (this.component.customBodyPath !== '') {
        svgTemplate +=
          `<path d=\"${this.component.customBodyPath}\" fill=\"#fff\"/>`;
      } else {
        svgTemplate +=
          `<rect height=\"150\" width=\"150\" x=\"0\" y=\"0\" fill=\"#fff\"/>
          <text xml:space=\"preserve\" text-anchor=\"middle\"
          font-family=\"sans-serif\" font-size=\"15\" y=\"80\" x=\"75\"
          fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"0\"
          fill=\"#000000\">${this.component.properties.componentName}</text>`;
      }
      return svgTemplate;
    },
  },
};
</script>
