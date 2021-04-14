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
    // List of all designs to check design still exists
    designs() {
      return this.$store.state.designs;
    },

    // If the cached version of the design does not have the same
    // inputs and outputs as teh current version of the design then
    // fill the body red so that the user knows it is outdated and
    // should be re-created
    fillAndError() {
      // Check that there is a design to check against
      if (this.component.hasOwnProperty('sourceDesign') &&
          this.component.sourceDesign != '') {
        // Find that design in the list of designs
        const currentDesign = this.designs.find(
            (design) => design.id == this.component.sourceDesign.id,
        );

        if (currentDesign === undefined) {
          // If the design was not found, highlight it in a strange colour
          // (should never happen in normal usage)
          return {fill: '#F00', error: 'Design no longer exists'};
        }
        // Check name is the same
        if (this.component.properties.componentType !== currentDesign.name) {
          return {fill: '#F00', error: 'Design has been renamed'};
        }
        // Check number of inputs and outputs match
        if (
          (this.component.pins.filter((pin) =>
            pin.direction === 'in').length !=
          currentDesign.components.filter((component) =>
            component.properties.componentType === 'INPUT').length) ||
          (this.component.pins.filter((pin) =>
            pin.direction === 'out').length !=
          currentDesign.components.filter((component) =>
            component.properties.componentType === 'OUTPUT').length)
        ) {
          // Quantities do not match
          return {fill: '#F00', error: 'Number of pins has changed'};
        }
        // Check names match
        if (!this.component.pins.every((pin) => {
          return currentDesign.components.some((component) => {
            if (component.properties.displayName === '') {
              return component.properties.componentID === pin.name;
            } else {
              return component.properties.displayName === pin.name;
            }
          });
        })) {
          return {fill: '#F88', error: 'Names of pins have changed'};
        }

        // Passed all tests - return white with no error
        return {fill: '#FFF', error: ''};
      } else {
        // Component does not have a design to check against
        // (so is a store component) - do not highlight it
        return {fill: '#FFF', error: ''};
      }
    },

    // Form the SVG for the body of the component
    bodySVG() {
      let svgTemplate = '';

      if (this.fillAndError.error != '') {
        svgTemplate += `<title>${this.fillAndError.error}</title>`;
      }

      // Create body using custom path if present, else just
      // use a rectangle and text of the component name
      if (this.component.customBodyPath !== '') {
        svgTemplate +=
          `<path d=\"${this.component.customBodyPath}\"
          fill=\"${this.fillAndError.fill}\"/>`;
      } else {
        svgTemplate +=
          `<rect height=\"150\" width=\"150\" x=\"0\" y=\"0\"
          fill=\"${this.fillAndError.fill}\"/>
          <text xml:space=\"preserve\" text-anchor=\"middle\"
          font-family=\"sans-serif\" font-size=\"15\" y=\"80\" x=\"75\"
          fill-opacity=\"null\" stroke-opacity=\"null\" stroke-width=\"0\"
          fill=\"#000000\">` +
          (this.component.properties.displayName === '' ?
              this.component.properties.componentType :
              this.component.properties.displayName) +
          `</text>`;
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
