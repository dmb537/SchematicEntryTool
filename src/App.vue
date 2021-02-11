<template>
  <div id="app">
    <ComponentPane
      v-bind:components="componentLibrary"
      v-bind:o-parser="oParser"
      v-on:add-component="addComponent">
    </ComponentPane>
    <div id="svgSpace">
      <svg ref="box" class="box" width="100%" height="100%"
        @dblclick="deselectComponents">
      </svg>
    </div>
  </div>
</template>

<script>
import ComponentPane from './components/ComponentPane.vue';
import componentsStore from './assets/componentsStore';

export default {
  name: 'App',
  components: {
    ComponentPane,
  },
  data() {
    return {
      count: 0,
      dragOffsetX: null,
      dragOffsetY: null,
      draggedObject: null,
      selectedObjects: [],
      componentLibrary: componentsStore,
      oParser: new DOMParser(),
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    addComponent(component) {
      const newComponent =
        this.oParser.parseFromString('<svg width=\"150\" height=\"150\" xmlns=\"http://www.w3.org/2000/svg\">' + component.svg + '</svg>', 'image/svg+xml').
            documentElement.firstChild;
      newComponent.setAttributeNS(null, 'id', `svgelement-${this.count}`);
      newComponent.setAttributeNS(null, 'transform', 'translate(0,0)');
      newComponent.setAttributeNS(null, 'cursor', 'move');
      newComponent.addEventListener('mousedown', this.drag);
      newComponent.addEventListener('mousedown', this.selectSingleComponent);
      newComponent.addEventListener('mouseup', this.drop);
      this.$refs.box.appendChild(newComponent);
      this.count += 1;
    },
    drag(event) {
      this.draggedObject =
          document.getElementById(event.target.parentNode.getAttribute('id'));
      this.dragOffsetX = event.offsetX -
          parseInt(this.draggedObject.getAttribute('transform').
              match(/(?<=\()(.*?)(?=\,)/g));
      this.dragOffsetY = event.offsetY -
          parseInt(this.draggedObject.getAttribute('transform').
              match(/(?<=\,)(.*?)(?=\))/g));
      this.$refs.box.addEventListener('mousemove', this.move);
    },
    move({offsetX, offsetY}) {
      const newX = offsetX - this.dragOffsetX;
      const newY = offsetY - this.dragOffsetY;
      this.draggedObject.setAttributeNS(
          null, 'transform', `translate(${newX}, ${newY})`);
    },
    drop() {
      this.draggedObject = this.dragOffsetX = this.dragOffsetY = null;
      this.$refs.box.removeEventListener('mousemove', this.move);
    },
    selectSingleComponent(event) {
      this.deselectComponents();
      event.target.parentNode.setAttributeNS(null, 'stroke', '#00F');
      this.selectedObjects.push(event.target.parentNode.getAttribute('id'));
    },
    deselectComponents() {
      this.selectedObjects.forEach((object) =>
        document.getElementById(object).setAttributeNS(null, 'stroke', '#000'),
      );
      this.selectedObjects = [];
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
  color: #ffffff;
  display: flex;
  flex-direction: row;
  background-color:#2E4272;
  height: 100%;
  overflow: hidden;
}
#component-pane {
  flex-grow: 0;
  flex-basis: 150px;
  overflow: auto;
}

#svgSpace {
  flex-grow: 1;
  background-color:#ffffff;
}

svg text {
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
}
</style>
