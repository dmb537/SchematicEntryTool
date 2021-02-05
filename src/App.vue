<template>
  <div id="app">
    <div id="sidebar">
      <h1>Sidebar</h1>
      <button v-on:click="drawShape">Add Rectangle</button>
      <button v-on:click="removeShape">Remove Last</button>
    </div>
    <div id="svgSpace">
      <svg ref="box" class="box" width="100%" height="100%">
        <rect width="100%" height="100%" fill="white" stroke="black" stroke-width="5"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      count: 0,
      dragOffsetX: null,
      dragOffsetY: null,
      draggedObject: null,
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    createSvg(svgType, attributes) {
      var svgElement = document.createElementNS("http://www.w3.org/2000/svg", svgType);
      for (var attribute in attributes)
        svgElement.setAttributeNS(null, attribute, attributes[attribute]);
      return svgElement;
    },
    drawShape() {
      //console.log("Adding");
      this.count += 1;
      var randomColor = Math.floor(Math.random()*16777215).toString(16);
      var randomX = Math.floor(Math.random() * 100);
      var randomY = Math.floor(Math.random() * 100);
      var newShape = this.createSvg('rect', {
          id:`svgelement-${this.count}`,
          x:`${randomX}`,
          y:`${randomY}`,
          width:20,
          height:20,
          fill:`#${randomColor}`,
          cursor: 'move',
          });
      newShape.addEventListener('mousedown', this.drag);
      newShape.addEventListener('mouseup', this.drop);
      this.$refs.box.appendChild(newShape);
    },
    removeShape() {
      if (this.count > 0) {
        //console.log("removing");
      document.getElementById(`svgelement-${this.count}`).remove();
      this.count -= 1;
      } else {
        //console.log("cannot remove with 0 elements");
      }
    },
    drag(event) {
      this.draggedObject = event.target.getAttribute('id');
      this.dragOffsetX = event.offsetX - document.getElementById(this.draggedObject).getAttribute('x');
      this.dragOffsetY = event.offsetY - document.getElementById(this.draggedObject).getAttribute('y');
      this.$refs.box.addEventListener('mousemove', this.move);
      //console.log(`dragging id=${this.draggedObject} with offset (${this.dragOffsetX}, ${this.dragOffsetY})`);
    },
    drop() {
      //console.log(`dropping id=${this.draggedObject}`);
      this.draggedObject = this.dragOffsetX = this.dragOffsetY = null;
      this.$refs.box.removeEventListener('mousemove', this.move);
    },
    move({offsetX, offsetY}) {
      var newX = offsetX - this.dragOffsetX;
      var newY = offsetY - this.dragOffsetY;
      document.getElementById(this.draggedObject).setAttributeNS(null, 'x', `${newX}`);
      document.getElementById(this.draggedObject).setAttributeNS(null, 'y', `${newY}`);
      //console.log(`moving id=${this.draggedObject} to (${offsetX}, ${offsetY})`);
    },
  },
}
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
}

#sidebar {
  flex-grow: 0;
  flex-basis: 10%;
}

#svgSpace {
  flex-grow: 1;
  background-color:#ffffff;
}
</style>
