<template>
  <g
    :id="net.netID"
    v-html="computedSVG">
  </g>
</template>


<script>

export default {
  name: 'SchematicNet',
  components: {
  },
  props: {
    design: Object,
    net: Object,
  },
  computed: {
    computedSVG: function() {
      // If components are selected then recompute if dragX or Y change
      // (computed functions reevaluate if a dependency changes)
      if (this.design.selectedComponents.length != 0) {
        this.design.selectedComponents[0].properties.dragX;
        this.design.selectedComponents[0].properties.dragY;
      }

      let svg = '<polyline points=\"';
      if (this.design.currentWire == this.net) {
        this.net.connectedPins.forEach((pin) => {
          const pos = this.getPosition(document.getElementById(
              `${pin.componentID}:${pin.name}`));
          svg += `${pos.x},${pos.y} `;
        });
        svg += `${this.net.tempPosition.x - 1},${this.net.tempPosition.y - 1} `;
        svg += '\" stroke=\"black\" />';
      } else {
        this.net.connectedPins.forEach((pin) => {
          const pos = this.getPosition(document.getElementById(
              `${pin.componentID}:${pin.name}`));
          svg += `${pos.x},${pos.y} `;
        });
        svg += '\" stroke=\"black\" />';
      }
      return svg;
    },
  },
  methods: {
    getPosition(element) {
      const area = element.getBBox();
      const x = area.x + (area.width / 2);
      const y = area.y + (area.height / 2);
      const offset =
        document.getElementById('svgpane').getBoundingClientRect();
      const matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top,
      };
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
