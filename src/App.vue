<template>
  <div id="app">
    <ComponentPane
      :components="componentLibrary"
      @add-component="addComponent">
    </ComponentPane>
    <div id="viewer">
      <ul id="tab-selector" class='unselectable-text'>
        <li v-for="design in designs"
          :key="design.id"
          :class='{"selected": (activeDesign == design)}'
          @click="activeDesign = design">
          {{ design.name }}
        </li>
        <li @click="addNewDesign">
          +
        </li>
      </ul>
      <Schematic v-for="design in designs"
        :key="design.id"
        :design="design"
        v-show="activeDesign == design"
        class='schematic-view'
        @select-components="selectComponents"
        @deselect-components="deselectComponents"
        @modify-drag="modifyDrag"
        @apply-drag="applyDrag">
      </Schematic>
    </div>
  </div>
</template>

<script>
import ComponentPane from './components/ComponentPane.vue';
import Schematic from './components/Schematic.vue';
import componentsStore from './assets/componentsStore';

export default {
  name: 'App',
  components: {
    ComponentPane,
    Schematic,
  },
  data() {
    return {
      componentLibrary: componentsStore,
      activeDesign: null,
      designs: [
        {'id': 0, 'name': 'New Schematic', 'components': []},
      ],
    };
  },
  computed: {
  },
  mounted() {
    this.activeDesign = this.designs[0];
  },
  methods: {
    addNewDesign() {
      const newDesign =
          {'id': this.designs.length,
            'name': 'New Schematic',
            'components': []};
      this.designs.push(newDesign);
      this.activeDesign = newDesign;
    },
    addComponent(component) {
      const newComponent = JSON.parse(JSON.stringify(component));
      newComponent.properties.componentID =
          `component-${this.activeDesign.components.length}`;
      this.activeDesign.components.push(newComponent);
    },
    selectComponents(components) {
      components.forEach((toSelect) => {
        toSelect.properties.strokeColour = '#00F';
      });
    },
    deselectComponents(components) {
      components.forEach((toDeselect) => {
        toDeselect.properties.strokeColour = '#000';
      });
    },
    modifyDrag(components, dragX, dragY) {
      components.forEach((toDrag) => {
        toDrag.properties.dragX = dragX;
        toDrag.properties.dragY = dragY;
      });
    },
    applyDrag(components, dragX, dragY) {
      components.forEach((toDrag) => {
        toDrag.properties.x = toDrag.properties.x + dragX;
        toDrag.properties.y = toDrag.properties.y + dragY;
        toDrag.properties.dragX = 0;
        toDrag.properties.dragY = 0;
      });
    },
  },
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  display: flex;
  flex-direction: row;
  background-color:#2E4272;
  height: 100vh;
  width: 100vw;
  overflow: auto;
}
#component-pane {
  color: #ffffff;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 150px;
  overflow: auto;
}

#viewer {
  flex-grow: 1;
  display: flex;
  /* Setting this prevents  this expanding wider than the screen*/
  min-width: 0;
  flex-direction: column;
  background-color:#c0c0c0;
}

.schematic-view {
  background-color:#ffffff;
  flex-grow: 1;
}

#tab-selector {
  display: block;
  list-style: none;
  margin: 0 0 0 0;
  color: #ffffff;
  background-color:#2E4272;
  overflow-y: auto;
  white-space:nowrap;
  flex-grow: 0;
  flex-shrink: 0;
  text-align: left;
}

#tab-selector > li {
  padding: 15px 30px;
  display: inline-block;
  cursor: pointer;
  white-space: nowrap;
}

#tab-selector > li.selected {
  background-color:#001955
}

.unselectable-text {
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
}
</style>
