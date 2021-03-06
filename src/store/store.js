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
      state.activeDesign.nextComponentID += 1;
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
    deleteSelection(state) {
      state.activeDesign.selectedComponents.forEach((toDelete) => {
        Vue.delete(state.activeDesign.components,
            state.activeDesign.components.indexOf(toDelete));
      });
      state.activeDesign.selectedComponents = [];
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
      const moveX = Math.round(
          ((mouseEvent.offsetX - state.activeDesign.draggedFrom.x)+2.5)/5) * 5;
      const moveY = Math.round(
          ((mouseEvent.offsetY - state.activeDesign.draggedFrom.y)+2.5)/5) * 5;
      state.activeDesign.selectedComponents.forEach((toDrag) => {
        toDrag.properties.dragX = moveX;
        toDrag.properties.dragY = moveY;
      });
    },
    applyDrag(state, mouseEvent) {
      const moveX = Math.round(
          ((mouseEvent.offsetX - state.activeDesign.draggedFrom.x)+2.5)/5) * 5;
      const moveY = Math.round(
          ((mouseEvent.offsetY - state.activeDesign.draggedFrom.y)+2.5)/5) * 5;
      state.activeDesign.selectedComponents.forEach((toDrag) => {
        toDrag.properties.x =
            toDrag.properties.x + moveX;
        toDrag.properties.y =
            toDrag.properties.y + moveY;
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
      const newComponentID =
          `component-${context.state.activeDesign.nextComponentID}`;
      newComponent.properties.componentID = newComponentID;
      newComponent.pins.forEach((pin) => {
        pin.componentID = newComponentID;
      });
      context.commit('addComponent', newComponent);
    },
    startDrag(context, mouseEvent) {
      if (!context.state.activeDesign.isDragging) {
        context.commit('startDrag', mouseEvent);
      }
    },
  },
});
