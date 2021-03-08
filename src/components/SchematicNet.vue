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
      let svg = '';
      // Force recompute on component drag
      if (this.design.selectedComponents.length != 0) {
        this.design.selectedComponents[0].properties.dragX;
        this.design.selectedComponents[0].properties.dragY;
      }

      // Draw a line for each part segment in the net
      this.net.segments.forEach((segment) => {
        let start = {};
        let end = {};
        if (segment.start.type == 'pin') {
          start = this.getPositionOfPin(segment.start.pin);
        } else {
          start = segment.start.node;
        }
        if (segment.end.type == 'pin') {
          end = this.getPositionOfPin(segment.end.pin);
        } else {
          end = segment.end.node;
        }
        svg += `<line x1=${start.x} y1=${start.y}
            x2=${end.x} y2=${end.y} stroke='black' />`;
      });

      // Go through each line segment and create a line for each
      return svg;
    },
  },
  methods: {
    getPositionOfPin(pin) {
      return this.getPosition(document.getElementById(
          `${pin.componentID}` +
          `:${pin.name}`));
    },
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
