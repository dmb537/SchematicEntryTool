<template>
  <div id="app">
    <div id="controls">
      <button @click="save"> Save </button>
      <input id="fileSelector" type='file' accept='.dbsim'
          style="display: none"
          @change="load">
      <button @click="triggerLoad"> Load </button>
    </div>
    <ComponentPane
      :components="componentLibrary">
    </ComponentPane>
    <div id="viewer">
      <ul id="tab-selector" class='unselectable-text' @click="rerender">
        <li v-for="design in designs"
          :key="design.index"
          :index="design.index"
          :class='{"selected": (activeDesign == design)}'
          @click="$store.commit('setActiveDesign', design)">
          {{ design.name }}
        </li>
        <li @click="addNewDesign">
          +
        </li>
      </ul>
      <Schematic v-if="activeDesign"
        :design="activeDesign"
        class='schematic-view'>
      </Schematic>
    </div>
  </div>
</template>

<script>
import ComponentPane from './components/ComponentPane.vue';
import Schematic from './components/Schematic.vue';
import componentsStore from './assets/componentsStore';
import {stringify, parse} from 'flatted';
import {saveAs} from 'file-saver';

export default {
  name: 'App',
  components: {
    ComponentPane,
    Schematic,
  },
  data() {
    return {
      componentLibrary: componentsStore,
    };
  },
  computed: {
    designs() {
      return this.$store.state.designs;
    },
    activeDesign() {
      return this.$store.state.activeDesign;
    },
  },
  mounted() {
    this.addNewDesign();
  },
  methods: {
    addNewDesign() {
      const newDesign =
          {'index': this.designs.length,
            'name': 'New Schematic',
            'rerender': 0,
            'components': [],
            'nextComponentID': 0,
            'nets': [],
            'nextNetID': 0,
            'ghostWire': null,
            'ghostNet': null,
            'selectedComponents': [],
            'isDragging': false,
            'draggedFrom': {'x': 0, 'y': 0}};
      this.$store.commit('addDesign', newDesign);
      this.$store.commit('setActiveDesign', newDesign);
    },
    rerender() {
      this.$nextTick(() => {
        this.$store.commit('incrementRerender');
      });
    },
    save() {
      saveAs(new File([stringify(this.$store.state)],
          `${new Date().toISOString()}.dbsim`,
          {type: 'application/json'}));
    },
    load() {
      const fileSelector = document.getElementById('fileSelector');
      if (fileSelector.value != '') {
        this.readFileWithPromise(fileSelector.files[0]).then(
            (result) => {
              this.$store.commit('overwriteState',
                  parse(result));
              this.rerender;
            },
            (error) => {
              console.log('error');
            },
        );
      }
    },
    readFileWithPromise(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = ((res) => {
          resolve(res.target.result);
        });
        reader.onerror = ((err) => {
          reject(err);
        });
        reader.readAsText(file);
      });
    },
    triggerLoad() {
      document.getElementById('fileSelector').click();
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
#controls {
  display: flex;
  flex-direction: column;
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
