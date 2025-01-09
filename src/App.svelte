<script lang="ts">
  // the spells each level caster gets as a json file
  import spellTable from "./lib/spellTable.json";
  import spConversionTable from "./lib/spConversionTable.json";
  import { onMount } from "svelte";
  import "drag-drop-touch";

  let hoverTarget: number = $state(-1);

  // character data stored as an object
  let cd: {
    level: number;
    deltas: Array<number>;
    onePerDays: Array<{ name: String; state: boolean }>;
    sps: number;
  } = $state({
    level: 1,
    deltas: [0],
    onePerDays: [],
    sps: 0,
  });

  // if the user has used this site before, grab the data
  const savedData = localStorage.getItem("characterData");

  // if the user has local data, parse it to cd. otherwise, make a new player.
  if (savedData != null) cd = JSON.parse(savedData);

  var levelPicker: HTMLInputElement;
  onMount(() => {
    levelPicker.value = cd.level.toString();
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
  function incrementSpellSlot(spellLevelIndex: number, ammt: number = 1, s: boolean=true): void {
    let numSlots = spellTable[cd.level-1][spellLevelIndex];
    cd.deltas[spellLevelIndex] += ammt;

    if (cd.deltas[spellLevelIndex] + numSlots < 0)
      cd.deltas[spellLevelIndex] = -numSlots;

    if(s) save();
  }

  function incrementSp(ammt: number, s: boolean=true): void {
    cd.sps += ammt;
    cd.sps = Math.max(cd.sps, 0);
    if(s) save();
  }

  function upDateSpellLevel(e: any): void {
    const v = e.target.value;
    cd.deltas = Array(spellTable[v ? v - 1 : 1].length)
      .fill(0)
      .map((_, i) => (i < cd.deltas.length ? cd.deltas[i] : 0));
    cd.level = v ? v : 1;
    save();
  }

  function draggable(node: HTMLElement, level: number=-1) {
    node.draggable = true;
    node.style.cursor = "grab";

    function handleGrab(e: any) {
      e.dataTransfer.setData("text/plain", level);
    }
    function handleGrabEnd(e: any) {
      hoverTarget = -1;
    }
    $effect(() => {
      node.addEventListener("dragstart", handleGrab);
      node.addEventListener("dragend", handleGrabEnd);

      return () => {
        node.removeEventListener("dragstart", handleGrab);
        node.addEventListener("dragend", handleGrabEnd);
      };
    });
  }

  function dropzone(node: HTMLElement, dropLevel: number = -1) {
    function handleDrop(e: any) {

      const dragLevel = Number(e.dataTransfer.getData("text/plain", dropLevel));

      // check if the spell is under 6th level
      if(dragLevel > 4 || dropLevel > 4) return;

      if (dropLevel == -1 && dragLevel > -1) {
        if(spellTable[cd.level-1][dragLevel] + cd.deltas[dragLevel] < 1) return;
        incrementSpellSlot(dragLevel, -1);
        incrementSp(spConversionTable[dragLevel]);

      } else if(dropLevel > -1 && dragLevel == -1){
        if(cd.sps < spConversionTable[dropLevel]) return;
        incrementSp(-spConversionTable[dropLevel])
        incrementSpellSlot(dropLevel, 1);

      }
    }
    function handleDragEnter(e: any) {
      hoverTarget = dropLevel + 1;
    }
    function handleDragOver(e:any) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    }
    $effect(() => {
      node.addEventListener("dragstart", handleDrop);
      node.addEventListener("dragenter", handleDragEnter);
      node.addEventListener("drop", handleDrop);
      node.addEventListener("dragover", handleDragOver);

      return () => {
        node.removeEventListener("dragstart", handleDrop);
        node.removeEventListener("dragenter", handleDragEnter);
        node.removeEventListener("dragover", handleDragOver);
      };
    });
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
      oninput={(e) => upDateSpellLevel(e)}
    />
  </section>

  <!-- spell slots -->
  <section>
    <div>
      {#each spellTable[cd.level - 1] as numSlots, spellLevelIndex}
        <div
          class={"flex fade spellRow " +
            (hoverTarget === spellLevelIndex + 1 ? "droppable" : "dropping")}
          use:dropzone={spellLevelIndex}
        >
          <h2>{spellLevelIndex + 1}</h2>
          <button onclick={() => incrementSpellSlot(spellLevelIndex, -1)}
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
                use:draggable={spellLevelIndex}
              ></div>
            {/each}
          </div>
          <button onclick={() => incrementSpellSlot(spellLevelIndex)}>+</button>
        </div>
      {/each}
    </div>
  </section>

  <!-- sorcery points -->
  <section>
    <div
      class={"flex fade " + (hoverTarget === 0 ? "droppable" : "dropping")}
      use:dropzone
    >
      <h2 class="sp-offset">SP</h2>
      <button onclick={() => incrementSp(-1)}>-</button>
      <!-- calculates white boxes -->
      <div class="flex wrap">
        {#each Array(cd.sps).fill(0) as _}
          <div class="box white" use:draggable></div>
        {/each}
      </div>
      <button onclick={() => incrementSp(1)}>+</button>
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
          onblur={() => {
            cd.onePerDays = cd.onePerDays.filter((val) => val.name != "");
            save();
          }}
        />
        <button
          class={spell.state ? "box white" : "box"}
          onclick={() => {
            spell.state = !spell.state;
            save();
          }}
        ></button>
      </div>
    {/each}
  </div>
  <button
    class="m0a"
    onclick={() => {
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
    border-radius: 10px;
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
  *:global(.droppable *) {
    pointer-events: none;
  }
  .droppable {
    border: 0.2em solid #40c9a2;
  }
  .dropping {
    border: 0.2em solid #00000000;
  }
  .fade {
    border-radius: 10px;
    transition: 300ms;
    padding: 0 10px;
  }
</style>
