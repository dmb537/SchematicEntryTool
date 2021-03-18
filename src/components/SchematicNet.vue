<template>
  <g :id="net.netID">
    <g v-html="computedSVG" />
    <SchematicNetNode v-for="node in net.nodes"
      :key="'' + net.netID + node.properties.x + node.properties.y"
      :design="design"
      :node="node" />
  </g>
</template>


<script>
import SchematicNetNode from './SchematicNetNode';

export default {
  name: 'SchematicNet',
  components: {
    SchematicNetNode,
  },
  props: {
    design: Object,
    net: Object,
  },
  computed: {
    computedSVG: function() {
      let svg = '';

      // Force recompute when active design changes
      this.design.index;
      this.design.rerender;
      // Force recompute when a component moves
      if (this.design.selectedComponents.length != 0) {
        this.design.selectedComponents[0].properties.dragX;
        this.design.selectedComponents[0].properties.dragY;
      }

      // Draw a line for each part segment in the net
      this.net.segments.forEach((segment) => {
        let start = {};
        let end = {};
        let dx = 0;
        let dy = 0;
        if (segment.start.type == 'pin') {
          start = this.getPositionOfPin(segment.start.pin);
        } else {
          start = {
            x: segment.start.node.properties.x +
                segment.start.node.properties.dragX,
            y: segment.start.node.properties.y +
                segment.start.node.properties.dragY,
          };
        }
        if (segment.end.type == 'pin') {
          end = this.getPositionOfPin(segment.end.pin);
        } else {
          end = {
            x: segment.end.node.properties.x +
                segment.end.node.properties.dragX,
            y: segment.end.node.properties.y +
                segment.end.node.properties.dragY,
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
      });
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
