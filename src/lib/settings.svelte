<script lang="ts">
  import type { PlayerData } from "./lib/types";
  import {fly} from "svelte/transition";

  interface Props {
    playerData: PlayerData;
    spellTable: Array<Array<number>>;
    save: () => void;
  }
  let { playerData: cd = $bindable(), spellTable, save }: Props = $props();
  let open: boolean = $state(false);

  function levelPicker(node: HTMLInputElement) {
    node.value = cd.level.toString();
  }

  function changeLevel(e: any): void {
    const v = e.target.value;
    cd.deltas = Array(spellTable[v ? v - 1 : 1].length)
      .fill(0)
      .map((_, i) => (i < cd.deltas.length ? cd.deltas[i] : 0));
    cd.level = v ? v : 1;
    save();
  }
</script>

<div class="widget">
  {#if open}

    <label>
      Caster Level
      <input
        use:levelPicker
        onchange={changeLevel}
        type="number"
        min="1"
        max={spellTable.length}
      />
    </label>
      <label>
      Max HP
    <input type="number" bind:value={cd.maxHealth} onchange={save} />
    </label>
    <button onclick={() => (open = !open)}> close </button>
  {:else}
    <button onclick={() => (open = !open)}> settings </button>
  {/if}
</div>

<style>
  button {
    background: none;
    width: 100%;
  }
  input {
    height: 25px;
    width: 200px;
    text-decoration: none;
    padding: 4px;
    padding-left: 12px;
    padding-right: 8px;
    border: none;
    font-size: 1em;
    box-shadow: none;
    outline: none;
    border-radius: 10px;
    background-color: #1a1a1a;
    margin: 10px;
    transition: background-color 100ms;
  }
  .widget {
    display: flex;
    flex-direction: column;
    align-items: end;
    border-radius: 10px;
    width: fit-content;
    margin: 0 auto;
  }
</style>
