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
      return '';
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
