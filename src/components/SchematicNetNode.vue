<template>
  <g v-html="computedSVG" />
</template>


<script>

export default {
  name: 'SchematicNetNode',
  components: {
  },
  props: {
    design: Object,
    node: Object,
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

      svg += `<circle cx=${this.node.x} cy=${this.node.y} r=4>`;

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
