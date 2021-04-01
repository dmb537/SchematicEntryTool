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
          'componentType': '',
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
      component.properties.componentType = this.design.name;
      component.properties.componentID = `preview-${this.design.name}`;

      // Get all pins
      const pinsIn = this.design.components.filter((component) =>
        component.properties.componentType === 'INPUT');
      const pinsOut = this.design.components.filter((component) =>
        component.properties.componentType === 'OUTPUT');

      pinsIn.forEach((pin, index) => {
        const newPin = {
          'name': pin.properties.componentID,
          'x': 0,
          'y': 15 + (30 * index),
          'direction': 'in',
          'connectedNet': 'open',
          'componentID': component.properties.componentID,
        };
        component.pins.push(newPin);
      });

      pinsOut.forEach((pin, index) => {
        const newPin = {
          'name': pin.properties.componentID,
          'x': 150,
          'y': 15 + (30 * index),
          'direction': 'out',
          'connectedNet': 'open',
          'componentID': component.properties.componentID,
        };
        component.pins.push(newPin);
      });

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
