<template>
  <div>
    <StoreComponent
      :component="component" >
    </StoreComponent>
  </div>
</template>

<script>
import StoreComponent from './StoreComponent';

export default {
  name: 'GeneratedComponent',
  components: {
    StoreComponent,
  },
  props: {
    design: Object,
  },
  computed: {
    component: function() {
      const component = {
        'properties': {
          'componentName': '',
          'componentID': '',
          'x': 0,
          'y': 0,
          'dragX': 0,
          'dragY': 0,
          'strokeColour': '#000',
          'availableInputFill': '#fff',
          'availableOutputFill': '#fff',
        },
        'pins': [
        ],
        'customBodyPath': '',
        'sourceDesign': this.design,
      };
      component.properties.componentName = this.design.name;
      component.properties.componentID = `preview-${this.design.name}`;
      return component;
    },
  },
  methods: {
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
