<template>
  <div id="app">
    <div id="menu">
      <button @click="save"> Save Project </button>
      <input id="fileSelector" type='file' accept='.dbproj'
          style="display: none"
          @change="load">
      <button @click="triggerLoad"> Load Project </button>
      <button @click="saveDesign"> Save Design </button>
      <input id="fileSelectorDesign" type='file' accept='.dbpage'
          style="display: none"
          @change="loadDesign">
      <button @click="triggerLoadDesign"> Load Design </button>
      <button @click="rotateSelection"> Rotate Selection </button>
      <button @click="renameSelection"> Rename Selection </button>
      <VHDLConverter
        :activeDesign="activeDesign"
        :designs="designs"/>
    </div>
    <div id="content">
      <ComponentPane
        :components="componentLibrary"
        :designs="designs">
      </ComponentPane>
      <div id="viewer">
        <ul id="tab-selector" class='unselectable-text' @click="rerender">
          <li v-for="design in designs"
            :key="design.id"
            :class='{"selected": (activeDesign == design)}'
            @click="$store.commit('setActiveDesign', design)">
            {{ design.name }}
            <div v-if="activeDesign == design"
                style="display: flex; flex-direction: row;">
              <div style="text-align: left; flex-grow: 1;"
                  @click="renameDesign(design)">
                <small> Rename </small>
              </div>
              <div style="text-align: right; flex-grow: 1;"
                  @click="deleteDesign(design)">
                <small> Delete </small>
              </div>
            </div>
          </li>
          <li @click="addNewDesign"
              class="addNew">
            +
          </li>
        </ul>
        <Schematic v-if="activeDesign"
          :design="activeDesign"
          class='schematic-view'>
        </Schematic>
      </div>
      <Popup v-if="isRenaming"
          @close="isRenaming = false; newName = ''">
          <template #header>
            Rename design
          </template>
          <template #body>
            <input v-model="newName"
              :placeholder="activeDesign.name">
            <button @click="executeRenameDesign"
              :disabled="nameIsUsed || nameHasSpaces">
              Submit
            </button>
            <div>
              <small v-show="nameIsUsed">
                Name already in use
              </small>
              <small v-show="nameHasSpaces">
                Name should not have spaces
              </small>
            </div>
          </template>
          <template #footer>
            <div />
          </template>
      </Popup>
      <Popup v-if="isDeleting"
          @close="isDeleting = false; deleteName = ''">
          <template #header>
            Delete design
          </template>
          <template #body>
            Please enter the name of the design to delete it<br><br>
            <input v-model="deleteName"
              :placeholder="activeDesign.name">
            <button @click="executeDeleteDesign"
              :disabled="deleteName !== activeDesign.name">
              Delete
            </button>
          </template>
          <template #footer>
            <div />
          </template>
      </Popup>
      <Popup v-if="isRenamingComponent"
          @close="isRenamingComponent = false; newName = ''">
          <template #header>
            Rename component
          </template>
          <template #body>
            <input v-model="newName"
              :placeholder=
                  "activeDesign.selectedComponents[0].properties.displayName">
            <button @click="executeRenameComponent"
              :disabled="nameIsUsedInDesign || nameHasSpaces">
              Submit
            </button>
            <div>
              <small v-show="nameIsUsedInDesign">
                Name already in use
              </small>
              <small v-show="nameHasSpaces">
                Name should not have spaces
              </small>
            </div>
          </template>
          <template #footer>
            <div />
          </template>
      </Popup>
      <Popup v-if="isRenamingNet"
          @close="isRenamingNet = false; newName = ''">
          <template #header>
            Rename net
          </template>
          <template #body>
            <input v-model="newName"
              :placeholder=
                  "activeDesign.selectedComponents[0].properties.netID">
            <button @click="executeRenameNet"
              :disabled="nameIsUsedInDesign || nameHasSpaces">
              Submit
            </button>
            <div>
              <small v-show="nameIsUsedInDesign">
                Name already in use
              </small>
              <small v-show="nameHasSpaces">
                Name should not have spaces
              </small>
            </div>
          </template>
          <template #footer>
            <div />
          </template>
      </Popup>
    </div>
  </div>
</template>

<script>
import ComponentPane from './components/ComponentPane.vue';
import Popup from './components/Popup';
import Schematic from './components/Schematic.vue';
import VHDLConverter from './components/VHDLConverter.vue';

import componentsStore from './assets/componentsStore';
import {stringify, parse} from 'flatted';
import {saveAs} from 'file-saver';

export default {
  name: 'App',
  components: {
    ComponentPane,
    Schematic,
    Popup,
    VHDLConverter,
  },
  data() {
    return {
      componentLibrary: componentsStore,
      isRenaming: false,
      isDeleting: false,
      isRenamingComponent: false,
      isRenamingNet: false,
      newName: '',
      deleteName: '',
    };
  },
  computed: {
    designs() {
      return this.$store.state.designs;
    },
    activeDesign() {
      return this.$store.state.activeDesign;
    },
    nameHasSpaces() {
      return (this.newName.indexOf(' ') !== -1);
    },
    nameIsUsed() {
      // Name is invalid if it is used by an existing design,
      // is the default new schematic name, or is used as a name
      // in the component store
      return (this.designs.some((design) => design.name === this.newName) ||
          this.componentLibrary.some((component) =>
            component.properties.componentType === this.newName) ||
          this.newName === 'NewSchematic');
    },
    nameIsUsedInDesign() {
      // Name is invalid for a component or net if it is already used for a
      // component or net in the current design
      return (this.activeDesign.components.some(
          (component) => component.properties.displayName === this.newName) ||
          this.activeDesign.nets.some(
              (net) => net.netName === this.newName)
      );
    },
  },
  mounted() {
    this.addNewDesign();
  },
  methods: {
    addNewDesign() {
      const newDesign =
          {'id': Date.now(),
            'name': 'NewSchematic',
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
    save() {
      saveAs(new File([stringify(this.$store.state)],
          `${new Date().toISOString()}.dbproj`,
          {type: 'application/json'}));
    },
    load() {
      const fileSelector = document.getElementById('fileSelector');
      if (fileSelector.value != '') {
        this.readFileWithPromise(fileSelector.files[0]).then(
            (result) => {
              this.$store.commit('overwriteState',
                  parse(result));
              fileSelector.value = '';
              this.rerender();
            },
            (error) => {
              console.log('error:' + error);
              fileSelector.value = '';
            },
        );
      }
    },
    triggerLoad() {
      document.getElementById('fileSelector').click();
    },
    saveDesign() {
      saveAs(new File([stringify(this.activeDesign)],
          `${this.activeDesign.name}.dbpage`,
          {type: 'application/json'}));
    },
    loadDesign() {
      const fileSelectorDesign = document.getElementById('fileSelectorDesign');
      if (fileSelectorDesign.value != '') {
        this.readFileWithPromise(fileSelectorDesign.files[0]).then(
            (result) => {
              this.$store.commit('loadDesign',
                  parse(result));
              fileSelectorDesign.value = '';
              this.rerender();
            },
            (error) => {
              console.log('error:' + error);
              fileSelectorDesign.value = '';
            },
        );
      }
    },
    triggerLoadDesign() {
      document.getElementById('fileSelectorDesign').click();
    },
    renameDesign() {
      this.isRenaming = true;
    },
    deleteDesign() {
      this.isDeleting = true;
    },
    executeRenameDesign() {
      this.$store.commit('renameActiveDesign', this.newName);
      this.newName = '',
      this.isRenaming = false;
    },
    executeDeleteDesign() {
      this.$store.commit('deleteActiveDesign');
      this.deleteName = '',
      this.isDeleting = false;
    },
    rotateSelection() {
      this.$store.commit('rotateSelection');
      this.rerender();
    },
    renameSelection() {
      // If multiple or no things are selected, deselect all and return
      if (this.activeDesign.selectedComponents.length !== 1) {
        this.$store.commit('deselectAll');
      } else {
        if (this.activeDesign.selectedComponents[0].hasOwnProperty('pins')) {
          this.isRenamingComponent = true;
        } else {
          this.isRenamingNet = true;
        }
      }
    },
    executeRenameComponent() {
      this.$store.commit('renameComponent', this.newName);
      this.newName = '',
      this.isRenamingComponent = false;
    },
    executeRenameNet() {
      this.$store.commit('renameNet', this.newName);
      this.newName = '',
      this.isRenamingNet = false;
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
  flex-direction: column;
  background-color:#2E4272;
  height: 100vh;
  width: 100vw;
}
#menu {
  display: flex;
  flex-direction: row;
  margin: 5px 5px 5px 5px;
}
#content {
  display: flex;
  flex-direction: row;
  min-height: 0;
  flex-grow: 1;
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
  min-width: 120px;
  flex-shrink: 0;
  text-align: center;
}

#tab-selector > li.selected {
  background-color:#001955
}

#tab-selector > li.addNew {
  text-align: left;
  min-width: 0px;
}

.unselectable-text {
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
}
</style>
