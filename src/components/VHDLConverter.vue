<template>
  <button
    @click="exportVHDL">
    Export VHDL for current design
  </button>
</template>

<script>
import componentsVHDL from './../assets/componentsVHDL';
import {saveAs} from 'file-saver';

export default {
  name: 'VHDLConverter',
  components: {
  },
  props: {
    activeDesign: Object,
    designs: Array,
  },
  data() {
    return {
      vhdl: '',
      currentDesign: null,
      processedDesigns: [],
      designsToProcess: [],
      componentTypesUsedThisDesign: [],
    };
  },
  methods: {
    exportVHDL() {
      // Reset all settings
      this.currentDesign = null;
      this.processedDesigns = [];
      this.designsToProcess = [];
      this.vhdl = `-- VHDL export of design ${this.activeDesign.name}\n` +
          `-- Exported on ${(new Date).toString()}\n`;

      this.convertDesign(this.activeDesign);
      saveAs(new File([this.vhdl],
          `${this.activeDesign.name}_${new Date().toISOString()}.vhd`,
          {type: 'text/plain'}));
    },
    convertDesign(design) {
      this.currentDesign = design;
      this.componentTypesUsedThisDesign = [];

      this.vhdl += `\n\n\n-- Outputting Design: ${design.name}\n\n` +
          `library ieee;\n` +
          `use ieee.std_logic_1164.ALL;\n` +
          `use ieee.numeric_std.ALL;\n` +
          `library UNISIM;\n` +
          `use UNISIM.Vcomponents.ALL;\n\n`;

      // Split components into ports and components
      const ports = [];
      const components = [];
      design.components.forEach((component) => {
        if (component.properties.componentType == 'INPUT' ||
            component.properties.componentType == 'OUTPUT') {
          ports.push(component);
        } else {
          components.push(component);
        }
      });

      // Declare entity
      this.vhdl += `entity ${design.name} is\n` +
          `\tport (`;
      // - Inputs
      this.vhdl += `\n\t\t--Inputs`;
      ports.filter((port) => {
        return (port.properties.componentType == 'INPUT');
      }).forEach((port) => {
        this.vhdl +=
            `\n\t\t\t${port.properties.displayName}\t: in \t\t std_logic;`;
      });
      // - Outputs
      this.vhdl += `\n\t\t--Outputs`;
      ports.filter((port) => {
        return (port.properties.componentType == 'OUTPUT');
      }).forEach((port) => {
        this.vhdl +=
            `\n\t\t\t${port.properties.displayName}\t: out \t\t std_logic;`;
      });
      this.vhdl = this.vhdl.slice(0, -1);
      this.vhdl += `\n\t);\n` +
          `end ${design.name};\n\n`;

      // Declare architecture
      this.vhdl += `architecture BEHAVIORAL of ${design.name} is\n` +
          `\tattribute BOX_TYPE\t: string;\n`;
      // Define nets
      design.nets.forEach((net) => {
        this.vhdl += `\tsignal ${net.netName} \t: std_logic;\n`;
      });
      this.vhdl += `\n`;
      // Define components
      components.forEach((component) => {
        if (this.componentTypesUsedThisDesign.indexOf(
            component.properties.componentType) == -1) {
          this.componentTypesUsedThisDesign.push(
              component.properties.componentType);

          if (componentsVHDL.hasOwnProperty(
              component.properties.componentType)) {
            this.vhdl += componentsVHDL[
                component.properties.componentType].vhdl;
          } else {
            const componentDesign = this.designs.find(
                (design) => design.id == component.sourceDesign.id,
            );
            if (this.processedDesigns.includes(componentDesign) ||
                this.designsToProcess.includes(componentDesign)) {
            } else {
              this.designsToProcess.push(componentDesign);
              this.vhdl += `\tcomponent ${component.properties.componentType}` +
                  `\n\t\tport (`;
              component.pins.filter((pin) => {
                return (pin.direction == 'in');
              }).forEach((pin) => {
                this.vhdl += `\n\t\t\t${pin.name}\t: in \t std_logic;`;
              });
              component.pins.filter((pin) => {
                return (pin.direction == 'out');
              }).forEach((pin) => {
                this.vhdl += `\n\t\t\t${pin.name}\t: out \t std_logic;`;
              });
              this.vhdl = this.vhdl.slice(0, -1);
              this.vhdl += `\n\t\t);\n\tend component;\n\n`;
            }
          }
        }
      });

      this.vhdl += `begin\n`;
      // Attach ports to nets
      // - Inputs
      ports.filter((port) => {
        return (port.properties.componentType == 'INPUT');
      }).forEach((port) => {
        this.vhdl += `\t${port.pins[0].connectedNet.netName} <= ` +
            `${port.properties.displayName};\n`;
      });
      // - Outputs
      ports.filter((port) => {
        return (port.properties.componentType == 'OUTPUT');
      }).forEach((port) => {
        this.vhdl += `\t${port.properties.displayName} <= ` +
            `${port.pins[0].connectedNet.netName};\n`;
      });

      // Create components
      this.vhdl += `\n`;
      components.forEach((component) => {
        this.vhdl += `\t${component.properties.displayName} : ` +
          `${component.properties.componentType}\n` +
          `\t\tport map (`;
        component.pins.forEach((pin) => {
          this.vhdl += `\n\t\t\t${pin.name}\t=> ${pin.connectedNet.netName},`;
        });
        this.vhdl = this.vhdl.slice(0, -1);
        this.vhdl += `\n\t\t);\n\n`;
      });

      this.vhdl += `end BEHAVIORAL;\n\n`;

      this.currentDesign = null;
      this.processedDesigns.push(design);
      if (this.designsToProcess.length != 0) {
        this.convertDesign(this.designsToProcess.shift());
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
