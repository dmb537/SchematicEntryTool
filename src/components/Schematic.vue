<template>
  <div>
      <svg ref="box" class="box unselectable-text" width="100%" height="100%"
        @dblclick="deselect"
        @mousedown="startDrag"
        @mousemove="dragging"
        @mouseup="stopDrag">
        <SchematicComponent v-for="component in design.components"
            :key="component.properties.componentID"
            :component="component"
            @component-clicked="select">
        </SchematicComponent>
      </svg>
  </div>
</template>

<script>
import SchematicComponent from './SchematicComponent';

export default {
  name: 'Schematic',
  components: {
    SchematicComponent,
  },
  props: {
    design: Object,
  },
  data() {
    return {
      selectedComponents: [],
      isDragging: false,
      isSignificantDrag: false,
      draggedFrom: {x: 0, y: 0},
    };
  },
  methods: {
    select(component) {
      this.selectedComponents.push(component);
      this.$emit('select-components', [component]);
    },
    deselect() {
      this.$emit('deselect-components', this.selectedComponents);
      this.selectedComponents = [];
    },
    startDrag(event) {
      this.draggedFrom.x = event.offsetX;
      this.draggedFrom.y = event.offsetY;
      this.isDragging = true;
    },
    dragging(event) {
      if (this.isDragging) {
        if (!this.isSignificantDrag) {
          if (Math.abs(event.offsetX - this.draggedFrom.x) > 10 ||
              Math.abs(event.offsetY - this.draggedFrom.y) > 10) {
            this.isSignificantDrag = true;
          }
        } else {
          this.$emit('modify-drag', this.selectedComponents,
              event.offsetX - this.draggedFrom.x,
              event.offsetY - this.draggedFrom.y);
        }
      }
    },
    stopDrag(event) {
      if (this.isSignificantDrag) {
        this.$emit('apply-drag', this.selectedComponents,
            event.offsetX - this.draggedFrom.x,
            event.offsetY - this.draggedFrom.y);
      }
      this.isDragging = false;
      this.isSignificantDrag = false;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
