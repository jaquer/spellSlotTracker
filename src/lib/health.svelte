<script lang="ts">
  import { fly } from "svelte/transition";
  import type { PlayerData } from "./types";

  let { playerData = $bindable(), onSave: save}: { playerData: PlayerData, onSave:()=>void } = $props();
  let showKeypad = $state(false);
  let healthS: string = $state(playerData.health.toString());

  function keyPress(n: number | string) {
    if (healthS === "0") healthS = "";
    healthS = healthS + n.toString();
  }

  function accept() {
    playerData.health = Math.max(eval(healthS), 0);
    healthS = playerData.health.toString();
    showKeypad = !showKeypad;
    save();
  }

  function backSpace() {
    healthS = healthS.slice(0, -1);
    if (healthS === "") healthS = "0";
  }

</script>

{#if showKeypad}
  <span class="fullScreen" transition:fly={{y: 200, duration: 200}}>
    <div class="keypad">
      <h1 class="fw5">
        {healthS}
      </h1>

      <span class="flex">
        <button onclick={() => keyPress(1)}> 1 </button>
        <button onclick={() => keyPress(2)}> 2 </button>
        <button onclick={() => keyPress(3)}> 3 </button>
      </span>

      <span class="flex">
        <button onclick={() => keyPress(4)}> 4 </button>
        <button onclick={() => keyPress(5)}> 5 </button>
        <button onclick={() => keyPress(6)}> 6 </button>
      </span>

      <span class="flex">
        <button onclick={() => keyPress(7)}> 7 </button>
        <button onclick={() => keyPress(8)}> 8 </button>
        <button onclick={() => keyPress(9)}> 9 </button>
      </span>

      <span class="flex">
        <button onclick={() => keyPress("-")}> - </button>
        <button onclick={() => keyPress(0)}> 0 </button>
        <button onclick={() => keyPress("+")}> + </button>
      </span>

      <span class="flex">
        <button onclick={backSpace}> Delete </button>
        <button onclick={() => accept()} class="green"> Accept </button>
      </span>
    </div>
  </span>
{/if}

<div class="widget">
  <button onclick={() => (showKeypad = true)}>
  <h1>
    <span class="fw5"> {playerData.health}/{playerData.maxHealth}</span> HP
  </h1></button>
</div>

<style>
  h1{
    padding: 5px 5px 10px;
    margin: 0;
  }
  .fw5{
    font-weight: 500;
  }
  .widget {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }
  .widget * {
    margin: 0;
  }
  .keypad {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: end;
    background-color: #242424;
    padding: 0 10vw 30px;
    height: 100vh;
    width: 100vw;
  }
  .green {
    background-color: #40c9a2;
    color: #1a1a1a;
  }
  .keypad button {
    width: 100%;
    padding: 15px;
  }
  .flex {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
  .fullScreen {
    position: fixed;
    height: 100%;
    z-index: 5;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .keypad {
    margin: 0 auto;
  }
  div {
    padding: 30px;
  }
  h1 {
    margin-top: 0;
  }
</style>
