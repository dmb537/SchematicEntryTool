<template>
  <g v-html="pinSVG" class="component-pin"/>
</template>


<script>
export default {
  name: 'ComponentPin',
  props: {
    properties: Object,
    pin: Object,
  },
  computed: {
    // Form the SVG for the body of the component
    pinSVG: function() {
      let pinSVG = '';

      if (this.pin.connectedNet == 'open') {
        pinSVG +=
          `<rect id=\"${this.properties.componentID}:${this.pin.name}\"
          height=\"20\" width=\"20\" x=\"${this.pin.x - 10}\"
          y=\"${this.pin.y - 10}\"
          fill=\"${this.properties.availableInputFill}\">
          <title>${this.properties.componentID}:${this.pin.name}</title>
          </rect>`;
      } else {
        pinSVG +=
          `<rect id=\"${this.properties.componentID}:${this.pin.name}\"
          height=\"20\" width=\"20\" x=\"${this.pin.x - 10}\"
          y=\"${this.pin.y - 10}\" fill=\"#000\">
          <title>${this.properties.componentID}:${this.pin.name}
          Net: ${this.pin.connectedNet}</title></rect>`;
      }

      return pinSVG;
    },
  },
};
</script>
