<script>
  export let disabled = false;
  export let onClick = () => {};
</script>

<button {disabled} on:click={onClick} class="game-button" {...$$restProps}>
  <slot></slot>
</button>

<style>
  button {
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: #4CAF50;
    color: white;
    transition: background-color 0.2s;
  }

  button:hover:not(:disabled) {
    background-color: #45a049;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }

  button:disabled:hover {
    background-color: #cccccc;
  }
</style> 