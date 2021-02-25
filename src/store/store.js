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
    setWireStart(state, pin) {
      state.activeDesign.wireStart = pin;
    },
    setCurrentWire(state, net) {
      state.activeDesign.currentWire = net;
    },
    setConnectedNet(state, payload) { // This breaks if state is not passed
      payload.pin.connectedNet = payload.net;
    },
    setWireMouse(state, event) {
      state.activeDesign.currentWire.tempPosition.x = event.offsetX;
      state.activeDesign.currentWire.tempPosition.y = event.offsetY;
    },
    addPinToNet(state, payload) {
      payload.net.connectedPins.push(payload.pin);
    },
    saveNet(state) {
      state.activeDesign.nextNetID += 1;
      state.activeDesign.nets.push(state.activeDesign.currentWire);
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
    startWire(context, pin) {
      context.commit('setWireStart', pin);
      const newNet = {
        'netID': `net-${context.state.activeDesign.nextNetID}`,
        'connectedPins': [pin],
        'tempPosition': {'x': 0, 'y': 0},
      };
      context.commit('setCurrentWire', newNet);
      const payload = {'pin': pin, 'net': newNet};
      context.commit('setConnectedNet', payload);
    },
    abortWire(context) {
      context.state.activeDesign.currentWire.connectedPins.forEach((pin) => {
        const payload = {'pin': pin, 'net': 'open'};
        context.commit('setConnectedNet', payload);
      });
      context.commit('setCurrentWire', null);
      context.commit('setWireStart', null);
    },
    endWire(context, pin) {
      let payload =
          {'pin': pin, 'net': context.state.activeDesign.currentWire};
      context.commit('setConnectedNet', payload);
      payload = {'net': context.state.activeDesign.currentWire, 'pin': pin};
      context.commit('addPinToNet', payload);
      context.commit('saveNet');
      context.commit('setCurrentWire', null);
      context.commit('setWireStart', null);
    },
  },
});
