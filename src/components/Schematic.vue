<template>
  <div>
      <svg id="svgpane" class="box unselectable-text"
        width="100%" height="100%"
        tabindex="0"
        @mousemove="backgroundMouseMove"
        @click="backgroundClick"
        @mouseup="backgroundMouseUp"
        @keyup.esc="cancelActions"
        @keyup.delete="deleteSelection">
        <SchematicComponent v-for="component in design.components"
            :key="design.id + ':' + component.properties.componentID"
            :design="design"
            :component="component">
        </SchematicComponent>
        <SchematicGhostWire id="ghostWire"
          v-if="design.ghostWire != null"
          :design="design"
          :ghostWire="design.ghostWire">
        </SchematicGhostWire>
        <SchematicNet id="ghostNet"
          v-if="design.ghostNet != null"
          :design="design"
          :net="design.ghostNet">
        </SchematicNet>
        <SchematicNet v-for="net in design.nets"
          :key="design.id + ':' + net.netID"
          :design="design"
          :net="net">
        </SchematicNet>
      </svg>
  </div>
</template>

<script>
import SchematicComponent from './SchematicComponent';
import SchematicNet from './SchematicNet';
import SchematicGhostWire from './SchematicGhostWire';

export default {
  name: 'Schematic',
  components: {
    SchematicComponent,
    SchematicNet,
    SchematicGhostWire,
  },
  props: {
    design: Object,
  },
  computed: {
  },
  data() {
    return {
    };
  },
  methods: {
    backgroundClick(event) {
      if (this.design.ghostWire != null) {
        this.$store.dispatch('addNodeToGhostNet', event);
      }
    },
    backgroundMouseMove(event) {
      if (this.design.isDragging) {
        this.$store.commit('modifyDrag', event);
      }
      if (this.design.ghostWire != null) {
        this.$store.commit('moveGhostWireEnd', event);
      }
    },
    backgroundMouseUp(event) {
      if (this.design.isSignificantDrag) {
        this.$store.commit('applyDrag', event);
      }
      this.$store.commit('endDrag');
    },
    deleteSelection(event) {
      this.$store.commit('deleteSelection');
    },
    cancelActions() {
      if (this.design.selectedComponents.length != 0) {
        this.$store.commit('deselectAll');
      }
      if (this.design.ghostWire != null) {
        this.$store.dispatch('abortGhostNet');
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
