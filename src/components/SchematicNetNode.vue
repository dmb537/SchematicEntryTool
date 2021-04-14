<template>
  <g v-html="computedSVG"
    @mousedown.exact="nodeMouseDown"
    @mousedown.ctrl.exact="nodeMouseDownCtrl"
    @mousemove="nodeMouseMove"
    @mouseup="nodeMouseUp"/>
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
      this.design.id;
      this.design.rerender;
      // Force recompute when a component moves
      if (this.design.selectedComponents.length != 0) {
        this.design.selectedComponents[0].properties.dragX;
        this.design.selectedComponents[0].properties.dragY;
      }

      svg += `<circle
          cx=${this.node.properties.x + this.node.properties.dragX}
          cy=${this.node.properties.y + this.node.properties.dragY}
          r=4
          stroke=${this.node.properties.strokeColour}
          fill=${this.node.properties.strokeColour}/>` +
          `<title>${this.node.properties.netName}</title>`;

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
    nodeMouseDown(event) {
      // Mouse down without ctrl:
      //  If on a currently unselected node, select only that node
      //    then drag
      //  If on a selected node, don't change selection and drag
      if (this.design.selectedComponents.indexOf(this.node) == -1) {
        this.$store.commit('deselectAll');
        this.$store.commit('select', this.node);
      }
      this.$store.dispatch('startDrag', event);
    },
    nodeMouseDownCtrl(event) {
      // Mouse down with ctrl:
      //  If on an unselected node, add to selection and begin drag
      //  If on a selected node, deselect it and don't allow drag
      if (this.design.selectedComponents.indexOf(this.node) != -1) {
        this.$store.commit('deselect', this.node);
      } else {
        this.$store.commit('select', this.node);
        this.$store.dispatch('startDrag', event);
      }
    },
    nodeMouseUp(event) {
      if (this.design.isSignificantDrag) {
        this.$store.commit('applyDrag', event);
      }
      this.$store.commit('endDrag');
    },
    nodeMouseMove(event) {
      if (this.design.isDragging) {
        if (!this.design.isSignificantDrag) {
          if (Math.abs(event.offsetX - this.design.draggedFrom.x) > 10 ||
              Math.abs(event.offsetY - this.design.draggedFrom.y) > 10) {
            this.$store.commit('setSignificantDrag', true);
          }
        } else {
          this.$store.commit('modifyDrag', event);
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
