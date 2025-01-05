<script lang="ts">
  // the spells each level caster gets as a json file
  import spellTable from "./lib/spellTable.json";
  import { onMount } from "svelte";

  // character data stored as an object
  let cd: {
    level: number;
    deltas: Array<number>;
    onePerDays: Array<{ name: String; state: boolean }>;
    sps: number;
  };

  // if the user has used this site before, grab the data
  const savedData = localStorage.getItem("characterData");

  // if the user has local data, parse it to cd. otherwise, make a new player.
  if (savedData == null)
    cd = {
      level: 1,
      deltas: [0],
      onePerDays: [],
      sps: 0,
    };
  else cd = JSON.parse(savedData);

  var levelPicker : HTMLElement;
  onMount(() => {
    levelPicker.value = cd.level;
  });

  // spell slot box color. takes in spell info, and returns html classes
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

  // increments, or decrements the current slot
  // numSlots makes sure that the slots dont go into the negative
  function incrementSpellSlot(
    spellLevelIndex: number,
    numSlots: number,
    decrement: boolean = false,
  ): void {
    if (decrement)
      cd.deltas[spellLevelIndex] > -numSlots ? cd.deltas[spellLevelIndex]-- : 0;
    else {
      cd.deltas[spellLevelIndex] += 1;
    }

    save();
  }

  function incrementSp(decrement: boolean = false): void {
    cd.sps += decrement ? -1 : 1;
    cd.sps = Math.max(cd.sps, 0);
    save();
  }

  function upDateSpellLevel(e: Event) {
    const v = e.target.value;
    cd.deltas = Array(spellTable[v ? v - 1 : 1].length)
      .fill(0)
      .map((_, i) => (i < cd.deltas.length ? cd.deltas[i] : 0));
    cd.level = v ? v : 1;
    save();
  }

  function save() {
    localStorage.setItem("characterData", JSON.stringify(cd));
  }
</script>

<main>
  <h1>Spell Slots</h1>
  <!--level selector-->
  <section class="flex">
    <input
      bind:this={levelPicker}
      class="box field m0a"
      type="number"
      min="1"
      max={spellTable.length}
      on:input={(e) => upDateSpellLevel(e)}
    />
  </section>

  <!-- spell slots -->
  <section>
    <div>
      {#each spellTable[cd.level - 1] as numSlots, spellLevelIndex}
        <div class="flex">
          <h2>{spellLevelIndex + 1}</h2>
          <button
            on:click={() => incrementSpellSlot(spellLevelIndex, numSlots, true)}
            >-</button
          >
          <!-- calculates white boxes -->
          <div class="flex wrap">
            {#each Array(numSlots + Math.max(0, cd.deltas[spellLevelIndex])) as _, slotLevelIndex}
              <div
                class={calculateBoxColor(
                  numSlots,
                  spellLevelIndex,
                  slotLevelIndex,
                  cd.deltas,
                )}
              ></div>
            {/each}
          </div>
          <button on:click={() => incrementSpellSlot(spellLevelIndex, numSlots)}
            >+</button
          >
        </div>
      {/each}
    </div>
  </section>

  <!-- sorcery points -->
  <section>
    <div class="flex">
      <h2 class="sp-offset">SP</h2>
      <button on:click={() => incrementSp(true)}>-</button>
      <!-- calculates white boxes -->
      <div class="flex wrap">
        {#each Array(cd.sps).fill(0) as _}
          <div class="box white"></div>
        {/each}
      </div>
      <button on:click={() => incrementSp()}>+</button>
    </div>
  </section>
</main>

<!-- once per days -->
<section>
  <div class="m0a">
    {#each cd.onePerDays as spell}
      <div class="flex">
        <input
          class="box field"
          type="text"
          bind:value={spell.name}
          on:blur={() => {
            cd.onePerDays = cd.onePerDays.filter(val => val.name != "");
            save();
          }}
        />
        <button
          class={spell.state ? "box white" : "box"}
          on:click={() => {
            spell.state = !spell.state;
            save();
          }}
        ></button>
      </div>
    {/each}
  </div>
  <button
    class="m0a"
    on:click={() => {
      cd.onePerDays.push({ name: "Spell", state: true });
      cd.onePerDays = cd.onePerDays;
      save();
    }}>Add a once-per-day</button
  >
</section>

<style>
  h2 {
    width: 20px;
  }
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
    min-width: 200px;
    text-decoration: none;
    padding: 4px;
    padding-left: 12px;
    padding-right: 8px;
    border: none;
    font-size: 1em;
    box-shadow: none;
    outline: none;
    border-radius: 8px;
  }
  .field:focus {
    box-shadow: none;
    text-decoration: none;
  }
  .white {
    background-color: white;
  }
  .green {
    background-color: #40c9a2;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  section {
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
    min-width: 338.08px;
  }
  .ml59 {
    margin-left: 59px;
  }
  section {
    max-width: 100vw;
  }
  .wrap {
    flex-wrap: wrap;
    max-width: 180px;
  }
  .sp-offset {
    position: relative;
    transform: translateX(-20px);
  }
  .m0a {
    display: block;
    margin: 0 auto;
  }
</style>
