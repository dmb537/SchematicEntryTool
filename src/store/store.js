import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    designs: [],
    activeDesign: null,
  },
  getters: {
  },
  mutations: {
    addDesign(state, newDesign) {
      state.designs.push(newDesign);
    },
    setActiveDesign(state, targetDesign) {
      state.activeDesign = targetDesign;
    },
    addComponent(state, newComponent) {
      state.activeDesign.components.push(newComponent);
    },
    deselectAll(state) {
      state.activeDesign.selectedComponents.forEach((toDeselect) => {
        toDeselect.properties.strokeColour = '#000';
      });
      state.activeDesign.selectedComponents = [];
    },
    deselect(state, toDeselect) {
      Vue.delete(state.activeDesign.selectedComponents,
          state.activeDesign.selectedComponents.indexOf(toDeselect));
      toDeselect.properties.strokeColour = '#000';
    },
    select(state, toSelect) {
      toSelect.properties.strokeColour = '#00F';
      state.activeDesign.selectedComponents.push(toSelect);
    },
    setSignificantDrag(state, isSignificantDrag) {
      state.activeDesign.isSignificantDrag = isSignificantDrag;
    },
    startDrag(state, mouseEvent) {
      state.activeDesign.draggedFrom.x = mouseEvent.offsetX;
      state.activeDesign.draggedFrom.y = mouseEvent.offsetY;
      state.activeDesign.isDragging = true;
    },
    modifyDrag(state, mouseEvent) {
      state.activeDesign.selectedComponents.forEach((toDrag) => {
        toDrag.properties.dragX =
            mouseEvent.offsetX - state.activeDesign.draggedFrom.x;
        toDrag.properties.dragY =
            mouseEvent.offsetY - state.activeDesign.draggedFrom.y;
      });
    },
    applyDrag(state, mouseEvent) {
      state.activeDesign.selectedComponents.forEach((toDrag) => {
        toDrag.properties.x =
            toDrag.properties.x +
            (mouseEvent.offsetX - state.activeDesign.draggedFrom.x);
        toDrag.properties.y =
            toDrag.properties.y +
            (mouseEvent.offsetY - state.activeDesign.draggedFrom.y);
        toDrag.properties.dragX = 0;
        toDrag.properties.dragY = 0;
      });
    },
    endDrag(state) {
      state.activeDesign.isDragging = false;
      state.activeDesign.isSignificantDrag = false;
    },
  },
  actions: {
    addNewComponent(context, component) {
      const newComponent = JSON.parse(JSON.stringify(component));
      newComponent.properties.componentID =
          `component-${context.state.activeDesign.components.length}`;
      context.commit('addComponent', newComponent);
    },
    startDrag(context, mouseEvent) {
      if (!context.state.activeDesign.isDragging) {
        context.commit('startDrag', mouseEvent);
      }
    },
  },
});
