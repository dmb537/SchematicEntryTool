<template>
  <g v-html="computedSVG" />
</template>


<script>
export default {
  name: 'SchematicNetSegment',
  components: {
  },
  props: {
    design: Object,
    net: Object,
    segment: Object,
  },
  computed: {
    computedSVG: function() {
      let svg = '';

      // Force recompute when active design changes
      this.design.id;
      this.design.rerender;
      // Force recompute when a component moves
      if (this.design.selectedComponents.length != 0) {
        this.design.selectedComponents[0].properties.dragX;
        this.design.selectedComponents[0].properties.dragY;
      }

      // Draw a line for the segment
      let start = {};
      let end = {};
      let dx = 0;
      let dy = 0;
      if (this.segment.start.type == 'pin') {
        start = this.getPositionOfPin(this.segment.start.pin);
      } else {
        start = {
          x: this.segment.start.node.properties.x +
              this.segment.start.node.properties.dragX,
          y: this.segment.start.node.properties.y +
              this.segment.start.node.properties.dragY,
        };
      }
      if (this.segment.end.type == 'pin') {
        end = this.getPositionOfPin(this.segment.end.pin);
      } else {
        end = {
          x: this.segment.end.node.properties.x +
              this.segment.end.node.properties.dragX,
          y: this.segment.end.node.properties.y +
              this.segment.end.node.properties.dragY,
        };
      }

      dx = end.x - start.x;
      dy = end.y - start.y;
      svg += '<polyline fill="none" stroke="black" points="';
      if (Math.abs(dx) > Math.abs(dy)) {
        svg += `${start.x},${start.y}
            ${start.x + dx/2},${start.y}
            ${start.x + dx/2},${end.y}
            ${end.x},${end.y}`;
      } else {
        svg += `${start.x},${start.y}
            ${start.x},${start.y + dy/2}
            ${end.x},${start.y + dy/2}
            ${end.x},${end.y}`;
      }
      svg += '" />';
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
