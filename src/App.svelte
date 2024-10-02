<script lang="ts">
  import spellTable from "./lib/spellTable.json";
  console.log(spellTable);
  let charLevel: number = 1;

  let deltas: Array<number>;
  $: deltas = Array(spellTable[charLevel ? charLevel - 1 : 0].length).fill(0);

  let onePDays: Array<{ name: String; state: boolean }> = [];
  $: console.log(onePDays.length);

  function calculateBoxColor(
    numSlots: number,
    level: number,
    slotIndex: number,
    deltas: any,
  ): string {
    if (slotIndex > numSlots - 1) return "box green";
    if (slotIndex < numSlots + deltas[level]) return "box white";
    return "box";
  }
</script>

<main>
  <h1>Spell Slots</h1>
  <div class="flex">
    <input
      class="box field"
      type="number"
      min="1"
      max={spellTable.length}
      bind:value={charLevel}
    />
    <!-- <input -->
    <!--   type="range" -->
    <!--   min="0" -->
    <!--   max={spellTable.length - 1} -->
    <!--   bind:value={charLevel} -->
    <!-- /> -->
  </div>
<section>
  {#each spellTable[charLevel ? charLevel - 1 : 0] as numSlots, level_i}
    <div class="flex">
      <h2>{level_i + 1}</h2>
      <button
        on:click={() => (deltas[level_i] >= -numSlots ? deltas[level_i]-- : 0)}
        >-</button
      >
      {#each Array(numSlots + Math.max(0, deltas[level_i])) as _, slot_i}
        <div class={calculateBoxColor(numSlots, level_i, slot_i, deltas)}></div>
      {/each}
      <button on:click={() => deltas[level_i]++}>+</button>
    </div>
  {/each}
  </section>

  <section>
    {#each onePDays as spell}
      <div class="flex">
        <input class="box field" type="text" bind:value={spell.name} />
        <button
          class={spell.state ? "box white" : "box"}
          on:click={() => (spell.state = !spell.state)}
        ></button>
      </div>
    {/each}
    <button
      on:click={() => {
        onePDays.push({ name: "Spell", state: true });
        onePDays = onePDays;
      }}>Add a once-per-day</button
    >
  </section>
</main>

<style>
  .box {
    width: 25px;
    height: 25px;
    background-color: #1a1a1a;
    outline: #1a1a1a 5px solid;
    border-radius: 3px;
    padding: 0;
    margin: 10px;
  }
  .field {
    width: 200px;
    text-decoration: none;
    padding: 4px ;
    padding-left: 12px;
    padding-right: 8px;
    border: none;
    font-size: 1em;
    box-shadow: none;
    outline: none;
    border-radius: 8px;
    margin-left: 0;
  }
  .field:focus{
    box-shadow: none;
    text-decoration: none;
  }
  .white {
    background-color: white;
  }
  .green {
    background-color: green;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  section {
    margin: 30px 0px;
  }
</style>
