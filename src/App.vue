<template>
  <div id="app">
    <ComponentPane
      :components="componentLibrary">
    </ComponentPane>
    <div id="viewer">
      <ul id="tab-selector">
        <li v-for="design in designs"
          :key="design.id"
          :class='{"selected": (selectedDesign == design.id)}'
          @click="selectedDesign = design.id">
          {{ design.name }}
        </li>
        <li @click="addNewDesign">
          +
        </li>
      </ul>
      <Schematic v-for="design in designs"
        :key="design.id"
        :design="design"
        v-show="selectedDesign == design.id"
        class='schematic-view'>
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
      selectedDesign: 0,
      designs: [
        {'id': 0, 'name': 'New Schematic', 'components': []},
      ],
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    addNewDesign() {
      const newID = this.designs.length;
      this.designs.push(
          {'id': newID, 'name': 'New Schematic', 'components': []});
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
  background-color:#ffffff;
}

.schematic-view {
  background-color:#c0c0c0;
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
