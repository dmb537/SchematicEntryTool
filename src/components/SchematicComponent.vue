<template>
  <g
    :id="component.properties.componentID"
    :transform="transform"
    :stroke="component.properties.strokeColour"
    @mousedown.exact="mousedown"
    @mousedown.ctrl.exact="mousedownctl"
    @mousemove="mousemove"
    @mouseup="mouseup">
    <title>
      Name: {{ component.properties.componentID }}
      Type: {{ component.properties.componentName }}
    </title>
    <ComponentBody
      :component="component" />
    <ComponentPin v-for="pin in component.pins" :key="pin.name"
      :properties="component.properties"
      :pin="pin" />
  </g>
</template>


<script>
import ComponentBody from './ComponentBody';
import ComponentPin from './ComponentPin';

export default {
  name: 'SchematicComponent',
  components: {
    ComponentBody,
    ComponentPin,
  },
  props: {
    design: Object,
    component: Object,
  },
  computed: {
    transform: function() {
      const transform =
        `translate(${this.component.properties.x},` +
        `${this.component.properties.y})` +
        `translate(${this.component.properties.dragX},` +
        `${this.component.properties.dragY})`;
      return transform;
    },
  },
  methods: {
    mousedown(event) {
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
    mousedownctl(event) {
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
    mouseup(event) {
      if (this.design.isSignificantDrag) {
        this.$store.commit('applyDrag', event);
      }
      this.$store.commit('endDrag');
    },
    mousemove(event) {
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
.component-preview {
  background-color:#FFFFFF
}
</style>
