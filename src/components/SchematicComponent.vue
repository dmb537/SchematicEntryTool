<template>
  <g
    :id="component.properties.componentID"
    :transform="transform"
    :stroke="component.properties.strokeColour" >
    <title>
      Name: {{ component.properties.componentID }}
      Type: {{ component.properties.componentName }}
    </title>
    <ComponentBody
      :design="design"
      :component="component" />
    <ComponentPin v-for="pin in component.pins" :key="pin.name"
      :design="design"
      :component="component"
      :pin="pin" />
  </g>
</template>


<script>
import ComponentBody from './ComponentBody';
import ComponentPin from './ComponentPin';

export default {
  name: 'SchematicComponent',
  components: {
    ComponentBody,
    ComponentPin,
  },
  props: {
    design: Object,
    component: Object,
  },
  computed: {
    transform: function() {
      const transform =
        `translate(${this.component.properties.x},` +
        `${this.component.properties.y})` +
        `translate(${this.component.properties.dragX},` +
        `${this.component.properties.dragY})`;
      return transform;
    },
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.component-preview {
  background-color:#FFFFFF
}
</style>
