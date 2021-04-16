import Vuex from 'vuex';
import Vue from 'vue';
import {stringify, parse} from 'flatted';

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
    addPinToNet(state, payload) {
      payload.net.pins.push(payload.pin);
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
    loadDesign(state, newDesign) {
      while (state.designs.some((design) => design.id == newDesign.id)) {
        newDesign.id -= 1;
      }
      state.designs.push(newDesign);
      state.activeDesign = newDesign;
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
    renameActiveDesign(state, newName) {
      state.activeDesign.name = newName;
    },
    deleteActiveDesign(state) {
      Vue.delete(state.designs, state.designs.indexOf(state.activeDesign));
      if (state.designs.length == 0) {
        state.activeDesign = null;
      } else {
        state.activeDesign = state.designs[0];
      }
    },
    rotateSelection(state) {
      state.activeDesign.selectedComponents.forEach((component) => {
        component.properties.rotation =
            (component.properties.rotation + 90) % 360;
      });
    },
    renameComponent(state, newName) {
      state.activeDesign.selectedComponents[0].properties.displayName = newName;
    },
    renameNet(state, newName) {
      const targetNet = state.activeDesign.nets.find((net) => {
        return (net.netID ===
          state.activeDesign.selectedComponents[0].properties.netID);
      });
      targetNet.netName = newName;
      targetNet.nodes.forEach((node) => node.properties.netName = newName);
    },
    deleteNet(state, net) {
      Vue.delete(state.activeDesign.nets, state.activeDesign.nets.indexOf(net));
    },
    deleteComponent(state, component) {
      Vue.delete(state.activeDesign.components,
          state.activeDesign.components.indexOf(component));
    },
    deleteSegment(state, segment) {
      Vue.delete(segment.parentNet.segments,
          segment.parentNet.segments.indexOf(segment));
    },
  },
  actions: {
    addNewComponent(context, component) {
      if (context.state.activeDesign == null) {
        return;
      }
      const newComponent = parse(stringify(component));
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
        netName: 'net-' + context.state.activeDesign.nextNetID,
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
        parentNet: newNet,
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
          netID: context.state.activeDesign.ghostNet.netID,
          netName: context.state.activeDesign.ghostNet.netID,
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
        parentNet: context.state.activeDesign.ghostNet,
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
        parentNet: context.state.activeDesign.ghostNet,
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
      // Add the pin to the list of pins belonging to the net
      context.commit('addPinToNet',
          {pin: pin, net: context.state.activeDesign.ghostNet});
      // Make the pin know it is connected
      context.commit('setConnectedNet',
          {pin: pin, net: context.state.activeDesign.ghostNet});
      // Terminate current segment at pin and add it to the net
      const newSegment = {
        start: context.state.activeDesign.ghostWire.start,
        end:
          {type: 'pin', pin: pin},
        parentNet: context.state.activeDesign.ghostNet,
      };
      context.commit('addSegmentToNet',
          {segment: newSegment, net: context.state.activeDesign.ghostNet});
      // Push the net to the array of completed nets
      context.commit('addNetToDesign', context.state.activeDesign.ghostNet);
      // Clear the ghost wire and net
      context.commit('setGhostWire', null);
      context.commit('setGhostNet', null);
    },
    deleteSelection(context) {
      // Split list into nodes and components
      const componentsToDelete =
          context.state.activeDesign.selectedComponents.filter((selected) => {
            return selected.hasOwnProperty('pins');
          });
      const nodesToDelete =
          context.state.activeDesign.selectedComponents.filter((selected) => {
            return !selected.hasOwnProperty('pins');
          });
      const netsToDelete = [];
      // Components: For each pin, delete the net connected to it
      componentsToDelete.forEach((component) => {
        component.pins.forEach((pin) => {
          if (pin.connectedNet !== 'open' &&
              netsToDelete.indexOf(pin.connectedNet) == -1) {
            netsToDelete.push(pin.connectedNet);
          }
        });
      });
      // For each node, delete the parent net
      nodesToDelete.forEach((node) => {
        const parentNet = context.state.activeDesign.nets.find((net) => {
          return (net.netID === node.properties.netID);
        });
        if (netsToDelete.indexOf(parentNet) == -1) {
          netsToDelete.push(parentNet);
        };
      });
      // Disconnect all pins connected to the nets to be deleted
      netsToDelete.forEach((net) => {
        net.pins.forEach((pin) => {
          context.commit('setConnectedNet', {pin: pin, net: 'open'});
        });
      });
      // Delete all nets queued to be deleted
      netsToDelete.forEach((net) => context.commit('deleteNet', net));
      // Delete all components queued for deletion
      componentsToDelete.forEach((component) => {
        context.commit('deleteComponent', component);
      });
    },
    addNodeToSegment(context, payload) {
      // Get the two current ends of the segment
      const oldStart = payload.segment.start;
      const oldEnd = payload.segment.end;
      // Remove the old segment from the net
      context.commit('deleteSegment', payload.segment);
      // Create a new node at the mouse location
      const newNode = {
        properties: {
          x: Math.round((payload.event.offsetX-2.5)/5)*5,
          y: Math.round((payload.event.offsetY-2.5)/5)*5,
          dragX: 0,
          dragY: 0,
          netID: payload.segment.parentNet.netID,
          netName: payload.segment.parentNet.netName,
          strokeColour: '#000',
        },
      };
      // Add that node to the net
      context.commit('addNodeToNet',
          {node: newNode, net: payload.segment.parentNet});
      // Make a new segment from each previous ends to the new node
      const newSegmentOne = {
        start: oldStart,
        end:
          {type: 'node', node: newNode},
        parentNet: payload.segment.parentNet,
      };
      const newSegmentTwo = {
        start: {type: 'node', node: newNode},
        end: oldEnd,
        parentNet: payload.segment.parentNet,
      };
      // Add the new segments to the net
      context.commit('addSegmentToNet',
          {segment: newSegmentOne, net: payload.segment.parentNet});
      context.commit('addSegmentToNet',
          {segment: newSegmentTwo, net: payload.segment.parentNet});
    },
  },
});
