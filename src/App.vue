<template>
  <div id="app">
    <!--<ComponentPane
      id="component-pane"
      v-bind:components="componentLibrary"
      v-on:draw-shape="drawShape"
      v-on:remove-shape="removeShape"
      v-on:add-component="addComponent">
    </ComponentPane>-->
    <ComponentPane
      id="component-pane"
      v-bind:components="componentLibrary"
      v-on:add-component="addComponent">
    </ComponentPane>
    <div id="svgSpace">
      <svg ref="box" class="box" width="100%" height="100%">
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
        this.oParser.parseFromString(component.svg, 'image/svg+xml').
            documentElement.firstChild;
      newComponent.setAttributeNS(null, 'id', `svgelement-${this.count}`);
      newComponent.setAttributeNS(null, 'transform', 'translate(100,100)');
      newComponent.setAttributeNS(null, 'cursor', 'move');
      newComponent.addEventListener('mousedown', this.drag);
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
    /*
    createSvg(svgType, attributes) {
      const svgElement = document.createElementNS('http://www.w3.org/2000/svg', svgType);
      for (const attribute in attributes) {
        if (Object.prototype.hasOwnProperty.call(attributes, attribute)) {
          svgElement.setAttributeNS(null, attribute, attributes[attribute]);
        }
      }
      return svgElement;
    },
    drawShape() {
      // console.log("Adding");
      this.count += 1;
      const randomColor = Math.floor(Math.random()*16777215).toString(16);
      const randomX = Math.floor(Math.random() * 100);
      const randomY = Math.floor(Math.random() * 100);
      const newShape = this.createSvg('rect', {
        id: `svgelement-${this.count}`,
        x: `${randomX}`,
        y: `${randomY}`,
        width: 150,
        height: 150,
        fill: `#${randomColor}`,
        cursor: 'move',
      });
      newShape.addEventListener('mousedown', this.drag);
      newShape.addEventListener('mouseup', this.drop);
      this.$refs.box.appendChild(newShape);
    },
    removeShape() {
      if (this.count > 0) {
        // console.log("removing");
        document.getElementById(`svgelement-${this.count}`).remove();
        this.count -= 1;
      } else {
        // console.log("cannot remove with 0 elements");
      }
    },
    drag(event) {
      this.draggedObject = event.target.getAttribute('id');
      this.dragOffsetX = event.offsetX -
          document.getElementById(this.draggedObject).getAttribute('x');
      this.dragOffsetY = event.offsetY -
          document.getElementById(this.draggedObject).getAttribute('y');
      this.$refs.box.addEventListener('mousemove', this.move);
      console.log(this.draggedObject);
      // console.log(`dragging id=${this.draggedObject}
      //    with offset (${this.dragOffsetX}, ${this.dragOffsetY})`);
    },
    drop() {
      // console.log(`dropping id=${this.draggedObject}`);
      this.draggedObject = this.dragOffsetX = this.dragOffsetY = null;
      this.$refs.box.removeEventListener('mousemove', this.move);
    },
    move({offsetX, offsetY}) {
      const newX = offsetX - this.dragOffsetX;
      const newY = offsetY - this.dragOffsetY;
      document.getElementById(
          this.draggedObject).setAttributeNS(null, 'x', `${newX}`);
      document.getElementById(
          this.draggedObject).setAttributeNS(null, 'y', `${newY}`);
      // console.log(`moving id=${this.draggedObject}
      //    to (${offsetX}, ${offsetY})`);
    },
    */
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
  flex-basis: 10%;
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
