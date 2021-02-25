<template>
  <div>
      <svg id="svgpane" class="box unselectable-text"
        width="100%" height="100%"
        tabindex="0"
        @mousemove="backgroundMouseMove"
        @dblclick="cancelActions"
        @keyup.delete="deleteSelection">
        <SchematicComponent v-for="component in design.components"
            :ref="component.properties.componentID"
            :key="component.properties.componentID"
            :design="design"
            :component="component">
        </SchematicComponent>
        <SchematicNet id="currentWireVisual"
          v-if="design.currentWire != null"
          :design="design"
          :net="design.currentWire">
        </SchematicNet>
        <SchematicNet v-for="net in design.nets"
          :key="net.netID"
          :design="design"
          :net="net">
        </SchematicNet>
      </svg>
  </div>
</template>

<script>
import SchematicComponent from './SchematicComponent';
import SchematicNet from './SchematicNet';

export default {
  name: 'Schematic',
  components: {
    SchematicComponent,
    SchematicNet,
  },
  props: {
    index: Number,
  },
  computed: {
    design() {
      return this.$store.state.designs[this.index];
    },
  },
  data() {
    return {
    };
  },
  methods: {
    backgroundMouseMove(event) {
      if (this.design.isDragging) {
        this.$store.commit('modifyDrag', event);
      }
      if (this.design.currentWire != null) {
        this.$store.commit('setWireMouse', event);
      }
    },
    deleteSelection(event) {
      this.$store.commit('deleteSelection');
    },
    cancelActions() {
      if (this.design.selectedComponents.length != 0) {
        this.$store.commit('deselectAll');
      }
      if (this.design.currentWire != null) {
        this.$store.dispatch('abortWire');
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
svg:focus {
  outline-width: 0;
}
</style>
