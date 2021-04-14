<template>
  <g v-html="pinSVG" class="component-pin"
    :id="computedID"
    @click.stop="pinMouseClick" />
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
      const componentName =
          (this.component.properties.displayName === '' ?
          this.component.properties.componentID :
          this.component.properties.displayName);

      pinSVG += `<rect id=\"${this.pin.componentID}:${this.pin.name}\"
          height=\"20\" width=\"20\" x=\"${this.pin.x - 10}\"
          y=\"${this.pin.y - 10}\"`;

      if (this.pin.connectedNet == 'open') {
        pinSVG += `fill=\"${properties.availableInputFill}\">` +
            `<title>${componentName}:${this.pin.name}</title>`;
      } else {
        pinSVG +=
          `fill=\"#000\">
          <title>${componentName}:${this.pin.name} -> ` +
          `${this.pin.connectedNet.netName}</title>`;
      }
      pinSVG += '</rect>';
      return pinSVG;
    },
    computedID: function() {
      return `${this.pin.componentID}:${this.pin.name}`;
    },
  },
  methods: {
    pinMouseClick(event) {
      if (this.design.ghostWire == null && this.pin.connectedNet == 'open') {
        // If we are not currently adding a wire then
        // clicking on an unconnected pin should start a wire
        this.$store.dispatch('startGhostWire', {pin: this.pin, event: event});
      }
      if (this.design.ghostWire != null && this.pin.connectedNet == 'open') {
        // If we are currently adding a wire then clicking on
        // an unconnected pin should terminate the wire at that pin
        this.$store.dispatch('endGhostNetAtPin', this.pin);
      }
    },
  },
};
</script>
