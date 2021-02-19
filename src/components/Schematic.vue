<template>
  <div>
      <svg ref="box" class="box unselectable-text" width="100%" height="100%"
        @mousemove="backgroundMouseMove"
        @dblclick="deselectAll">
        <SchematicComponent v-for="component in design.components"
            :key="component.properties.componentID"
            :component="component"
            @component-mousedown="(component, event) =>
                componentMouseDown(component, event)"
            @component-mousedownctrl="(component, event) =>
                componentMouseDownCtrl(component, event)"
             @component-mousemove="(component, event) =>
                componentMouseMove(component, event)"
            @component-mouseup="(component, event) =>
                componentMouseUp(component, event)">
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
    componentMouseDown(component, event) {
      // Mouse down without ctrl:
      //  If on a currently onselected component, select only that component
      //    then drag
      //  If on a selected component, don't change selection and drag
      if (this.selectedComponents.indexOf(component) == -1) {
        this.deselectAll();
        this.select(component);
      }
      this.startDrag(event);
    },
    componentMouseDownCtrl(component, event) {
      // Mouse down with ctrl:
      //  If on an unselected component, add to selection and begin drag
      //  If on a selected component, deselect it and don't allow drag
      if (this.selectedComponents.indexOf(component) != -1) {
        this.deselect(component);
      } else {
        this.select(component);
        this.startDrag(event);
      }
    },
    componentMouseUp(component, event) {
      this.stopDrag(event);
    },
    componentMouseMove(component, event) {
      this.dragging(event);
    },
    backgroundMouseMove(event) {
      if (this.isDragging) {
        // Mouse moved to quickly and left the component; catch up
        this.dragging(event);
      }
    },
    select(component) {
      if (this.selectedComponents.indexOf(component) == -1) {
        this.selectedComponents.push(component);
        this.$emit('select-components', [component]);
      }
    },
    deselect(component) {
      if (this.selectedComponents.indexOf(component) != -1) {
        this.$emit('deselect-components', [component]);
        this.$delete(this.selectedComponents,
            this.selectedComponents.indexOf(component));
      }
    },
    deselectAll() {
      this.$emit('deselect-components', this.selectedComponents);
      this.selectedComponents = [];
    },
    startDrag(event) {
      // Handle if mouse was released outside the schematic area and re-pressed
      if (!this.isDragging) {
        this.draggedFrom.x = event.offsetX;
        this.draggedFrom.y = event.offsetY;
        this.isDragging = true;
      }
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
