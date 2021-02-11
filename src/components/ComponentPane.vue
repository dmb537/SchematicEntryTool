<template>
  <div id="component-pane">
    <!--<button v-on:click="$emit('draw-shape')">Add Rectangle</button>
    <button v-on:click="$emit('remove-shape')">Remove Last</button>-->
    <template v-for="component in components">
      <svg width="100" height="100" viewBox="-25 -25 200 200"
          class="component-preview"
          v-html="component.svg"
          v-bind:key="component.name"
          @click="$emit('add-component', component)">
      </svg>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ComponentPane',
  props: {
    components: Array,
    oParser: DOMParser,
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
