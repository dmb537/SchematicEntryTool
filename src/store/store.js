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
          ((mouseEvent.offsetX - state.activeDesign.draggedFrom.x)-2.5)/5) * 5;
      const moveY = Math.round(
          ((mouseEvent.offsetY - state.activeDesign.draggedFrom.y)-2.5)/5) * 5;
      state.activeDesign.selectedComponents.forEach((toDrag) => {
        toDrag.properties.dragX = moveX;
        toDrag.properties.dragY = moveY;
      });
    },
    applyDrag(state, mouseEvent) {
      const moveX = Math.round(
          ((mouseEvent.offsetX - state.activeDesign.draggedFrom.x)-2.5)/5) * 5;
      const moveY = Math.round(
          ((mouseEvent.offsetY - state.activeDesign.draggedFrom.y)-2.5)/5) * 5;
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
    setConnectedNet(state, payload) { // This breaks if state is not passed
      payload.pin.connectedNet = payload.net;
    },
    setGhostWire(state, ghostWire) {
      state.activeDesign.ghostWire = ghostWire;
    },
    setGhostNet(state, ghostNet) {
      state.activeDesign.ghostNet = ghostNet;
    },
    moveGhostWireEnd(state, event) {
      state.activeDesign.ghostWire.end.x =
          Math.round((event.offsetX-2.5)/5)*5;
      state.activeDesign.ghostWire.end.y =
          Math.round((event.offsetY-2.5)/5)*5;
    },
    addNodeToNet(state, payload) {
      payload.net.nodes.push(payload.node);
    },
    addSegmentToNet(state, payload) {
      payload.net.segments.push(payload.segment);
    },
    overwriteState(state, newState) {
      state.designs = newState.designs;
      state.activeDesign = newState.activeDesign;
    },
    addNetToDesign(state, net) {
      state.activeDesign.nets.push(net);
    },
    incrementNetID(state) {
      state.activeDesign.nextNetID += 1;
    },
    incrementRerender(state) {
      state.activeDesign.rerender += 1;
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
    startGhostWire(context, payload) {
      const newNet = {
        netID: 'net-' + context.state.activeDesign.nextNetID,
        pins: [payload.pin],
        nodes: [],
        segments: [],
      };
      context.commit('setGhostNet', newNet);
      context.commit('incrementNetID');
      context.commit('setConnectedNet',
          {pin: payload.pin, net: context.state.activeDesign.ghostNet});
      const newWireSegment = {
        start:
          {type: 'pin', pin: payload.pin},
        end:
          {type: 'point',
            x: Math.round((payload.event.offsetX-2.5)/5)*5,
            y: Math.round((payload.event.offsetY-2.5)/5)*5,
          },
      };
      context.commit('setGhostWire', newWireSegment);
    },
    addNodeToGhostNet(context, event) {
      // Create new node at click point
      const newNode = {
        properties: {
          x: Math.round((event.offsetX-2.5)/5)*5,
          y: Math.round((event.offsetY-2.5)/5)*5,
          dragX: 0,
          dragY: 0,
          strokeColour: '#000',
        },
      };
      context.commit('addNodeToNet',
          {node: newNode, net: context.state.activeDesign.ghostNet});
      // Terminate previous segment at node and add as a segment
      const newSegment = {
        start: context.state.activeDesign.ghostWire.start,
        end:
          {type: 'node', node: newNode},
      };
      context.commit('addSegmentToNet',
          {segment: newSegment, net: context.state.activeDesign.ghostNet});
      // Create new wire segment starting node
      const newGhostWire = {
        start:
        {type: 'node', node: newNode},
        end:
          {type: 'point',
            x: Math.round((event.offsetX-2.5)/5)*5,
            y: Math.round((event.offsetY-2.5)/5)*5,
          },
      };
      context.commit('setGhostWire', newGhostWire);
    },
    abortGhostNet(context) {
      // Disconnect all pins from the ghost net
      context.state.activeDesign.ghostNet.pins.forEach((pin) => {
        context.commit('setConnectedNet',
            {pin: pin, net: 'open'});
      });
      if (context.state.activeDesign.ghostWire.start.type == 'pin') {
        context.commit('setConnectedNet',
            {pin: context.state.activeDesign.ghostWire.start.pin, net: 'open'});
      }
      // Delete the ghost net
      context.commit('setGhostWire', null);
      context.commit('setGhostNet', null);
    },
    endGhostNetAtPin(context, pin) {
      // Make the pin know it is connected
      context.commit('setConnectedNet',
          {pin: pin, net: context.state.activeDesign.ghostNet});
      // Terminate current segment at pin and add it to the net
      const newSegment = {
        start: context.state.activeDesign.ghostWire.start,
        end:
          {type: 'pin', pin: pin},
      };
      context.commit('addSegmentToNet',
          {segment: newSegment, net: context.state.activeDesign.ghostNet});
      // Push the net to the array of completed nets
      context.commit('addNetToDesign', context.state.activeDesign.ghostNet);
      // Clear the ghost wire and net
      context.commit('setGhostWire', null);
      context.commit('setGhostNet', null);
    },
  },
});
