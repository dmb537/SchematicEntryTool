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
    pinMouseClick() {
      if (this.design.wireStart == null) {
        // No wire has been started; start one
        this.$store.dispatch('startWire', this.pin);
      } else if (this.design.wireStart == this.pin) {
        // Click same place as start, cancel wire
        this.$store.dispatch('abortWire');
      } else {
        // Clicked on a different pin than start - connect them
        this.$store.dispatch('endWire', this.pin);
      }
    },
  },
};
</script>
