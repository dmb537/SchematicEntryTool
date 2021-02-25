<template>
  <g v-html="bodySVG" class="component-body"
    @mousedown.exact="bodyMouseDown"
    @mousedown.ctrl.exact="bodyMouseDownCtrl"
    @mousemove="bodyMouseMove"
    @mouseup="bodyMouseUp" />
</template>


<script>
export default {
  name: 'ComponentBody',
  props: {
    design: Object,
    component: Object,
  },
  computed: {
    // Form the SVG for the body of the component
    bodySVG: function() {
      let svgTemplate = '';

      // Create body using custom path if present, else just
      // use a rectangle and text of the component name
      if (this.component.customBodyPath !== '') {
        svgTemplate +=
          `<path d=\"${this.component.customBodyPath}\" fill=\"#fff\"/>`;
      } else {
        svgTemplate +=
          `<rect height=\"150\" width=\"150\" x=\"0\" y=\"0\" fill=\"#fff\"/>
          <text xml:space=\"preserve\" text-anchor=\"middle\"
          font-family=\"sans-serif\" font-size=\"15\" y=\"80\" x=\"75\"
          fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"0\"
          fill=\"#000000\">${this.component.properties.componentName}</text>`;
      }
      return svgTemplate;
    },
  },
  methods: {
    bodyMouseDown(event) {
      // Mouse down without ctrl:
      //  If on a currently unselected component, select only that component
      //    then drag
      //  If on a selected component, don't change selection and drag
      if (this.design.selectedComponents.indexOf(this.component) == -1) {
        this.$store.commit('deselectAll');
        this.$store.commit('select', this.component);
      }
      this.$store.dispatch('startDrag', event);
    },
    bodyMouseDownCtrl(event) {
      // Mouse down with ctrl:
      //  If on an unselected component, add to selection and begin drag
      //  If on a selected component, deselect it and don't allow drag
      if (this.design.selectedComponents.indexOf(this.component) != -1) {
        this.$store.commit('deselect', this.component);
      } else {
        this.$store.commit('select', this.component);
        this.$store.dispatch('startDrag', event);
      }
    },
    bodyMouseUp(event) {
      if (this.design.isSignificantDrag) {
        this.$store.commit('applyDrag', event);
      }
      this.$store.commit('endDrag');
    },
    bodyMouseMove(event) {
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
