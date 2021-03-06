<template>
  <g v-html="pinSVG" class="component-pin"
    :id="computedID"
    @click="pinMouseClick" />
</template>

<script>
export default {
  name: 'ComponentPin',
  props: {
    design: Object,
    component: Object,
    pin: Object,
  },
  computed: {
    // Form the SVG for the body of the component
    pinSVG: function() {
      let pinSVG = '';
      const properties = this.component.properties;

      if (this.pin.connectedNet == 'open') {
        pinSVG +=
          `<rect id=\"${this.pin.componentID}:${this.pin.name}\"
          height=\"20\" width=\"20\" x=\"${this.pin.x - 10}\"
          y=\"${this.pin.y - 10}\"
          fill=\"${properties.availableInputFill}\">
          <title>${this.pin.componentID}:${this.pin.name}</title>
          </rect>`;
      } else {
        pinSVG +=
          `<rect id=\"${this.pin.componentID}:${this.pin.name}\"
          height=\"20\" width=\"20\" x=\"${this.pin.x - 10}\"
          y=\"${this.pin.y - 10}\" fill=\"#000\">
          <title>${properties.componentID}:${this.pin.name}
          Net: ${this.pin.connectedNet.netID}</title></rect>`;
      }

      return pinSVG;
    },
    computedID: function() {
      return `${this.pin.componentID}:${this.pin.name}`;
    },
  },
  methods: {
    pinMouseClick(event) {
    },
  },
};
</script>
