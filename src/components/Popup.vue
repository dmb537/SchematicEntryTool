<template>
  <div class="popup-backdrop">
    <div class="popup">
      <header class="popup-header">
        <slot name="header">
          Default
        </slot>
      </header>

      <section class="popup-body">
        <slot name="body">
          Default
        </slot>
       </section>

      <footer class="popup-footer">
        <slot name="footer">
          Default
        </slot>
        <button
          type="button"
          class="btn"
          @click="close"
        >
          Close popup
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style>
  .popup-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .popup {
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
  }

  .popup-header,
  .popup-footer {
    padding: 15px;
    display: flex;
  }

  .popup-header {
    border-bottom: 1px solid #eeeeee;
    color: #2E4272;
    justify-content: flex-start;
  }

  .popup-footer {
    border-top: 1px solid #eeeeee;
    flex-direction: column;
    justify-content: flex-end;
  }

  .popup-body {
    position: relative;
    padding: 20px 10px;
  }

  .btn {
    color: white;
    background: #2E4272;
    border: 1px solid #2E4272;
    border-radius: 2px;
  }
</style>
