<template>
  <div>
    <svg width="80%" viewBox="-25 -25 200 200"
        class="component-preview unselectable-text"
        :key="component.name"
        @click="$emit('add-component', component)">
        <SchematicComponent
          :component="component" />
    </svg>
  </div>
</template>

<script>
import SchematicComponent from './SchematicComponent';

export default {
  name: 'StoreComponent',
  components: {
    SchematicComponent,
  },
  props: {
    component: Object,
  },
  computed: {
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
