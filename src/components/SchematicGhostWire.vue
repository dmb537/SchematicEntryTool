<template>
  <g v-html="computedSVG" />
</template>

<script>
export default {
  name: 'SchematicGhostWire',
  components: {
  },
  props: {
    design: Object,
    ghostWire: Object,
  },
  computed: {
    computedSVG: function() {
      let svg = '';
      let dx = 0;
      let dy = 0;
      const start = this.startCoords;
      const end = {x: this.mouseX, y: this.mouseY};


      dx = end.x - start.x;
      dy = end.y - start.y;
      // Rendering
      svg += '<polyline fill="none" stroke="grey" points="';
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
      svg += `" />`;
      return svg;
    },
    mouseX: function() {
      const x = this.ghostWire.end.x;
      return x;
    },
    mouseY: function() {
      const y = this.ghostWire.end.y;
      return y;
    },
    startCoords: function() {
      if (this.ghostWire.start.type == 'pin') {
        return this.pinPosition;
      } else if (this.ghostWire.start.type == 'node') {
        return {x: this.ghostWire.start.node.properties.x,
          y: this.ghostWire.start.node.properties.y};
      } else {
        return {x: 0, y: 0};
      }
    },
    pinPosition: function() {
      if (this.ghostWire.start.type == 'pin') {
        // If components are selected then recompute if dragX or Y change
        // (computed functions reevaluate if a dependency changes)
        if (this.design.selectedComponents.length != 0) {
          this.design.selectedComponents[0].properties.dragX;
          this.design.selectedComponents[0].properties.dragY;
        }

        return this.getPosition(document.getElementById(
            `${this.ghostWire.start.pin.componentID}` +
            `:${this.ghostWire.start.pin.name}`));
      } else {
        return '';
      }
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
