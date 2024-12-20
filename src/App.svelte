<script lang="ts">
  import spellTable from "./lib/spellTable.json";

  let cd : {
    "level" : number,
    "deltas" : Array<number>,
    "onePerDays" : Array<{ name: String, state: boolean}>
  } 

  const savedData = localStorage.getItem("characterData")

  if (savedData == null)
    cd = {
      "level" : 1,
      "deltas" : [0],
      "onePerDays" : []
    }
  else
    cd = JSON.parse(savedData)

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

  function incrementSlot(
    spellLevelIndex: number,
    numSlots: number,
    decrement: boolean = false,
  ) : void {
    console.log("incrementing")
    if(decrement)
      cd.deltas[spellLevelIndex] >= -numSlots ? cd.deltas[spellLevelIndex]-- : 0
    else{
      cd.deltas[spellLevelIndex] += 1
      console.log("adding")
    }
    save()
  }

  function save(){
    localStorage.setItem(
      "characterData", 
      JSON.stringify(cd)
    )
  }
</script>

<main>
  <h1>Spell Slots</h1>
  <!--level selector-->
  <div class="flex">
    <input
      class="box field ml59"
      type="number"
      min="1"
      max={spellTable.length}
      on:input={e=>{
        const v = e.target.value
        console.log(cd.level)
        cd.deltas = Array(spellTable[v ? v - 1 : 0].length).fill(0);
        cd.level = v
      }
      }
    />
  </div>

  <!-- spell slots -->
  <section>
    {#each spellTable[cd.level - 1] as numSlots, spellLevelIndex}
      <div class="flex">
        <h2>{spellLevelIndex + 1}</h2>
        <button
          on:click={() =>incrementSlot(spellLevelIndex, numSlots, true)}>-</button>
          <!-- calculates white boxes -->
        {#each Array(numSlots + Math.max(0, cd.deltas[spellLevelIndex])) as _, slotLevelIndex}
          <div
            class={calculateBoxColor(numSlots, spellLevelIndex, slotLevelIndex, cd.deltas)}
          ></div>
        {/each}
        <button on:click={() => incrementSlot(spellLevelIndex, numSlots)}>+</button>
      </div>
    {/each}
  </section>

  <!-- once per days -->
  <section>
    {#each cd.onePerDays as spell}
      <div class="flex">
        <input
          class="box field"
          type="text"
          bind:value={spell.name}
          on:blur={() => {
              cd.onePerDays = cd.onePerDays.filter((val, _) => val.name != ""
            ); save();
          }}
        />
        <button
          class={spell.state ? "box white" : "box"}
          on:click={() => {spell.state = !spell.state; save()}}
        ></button>
      </div>
    {/each}
    <button
      class="ml59"
      on:click={() => {
        cd.onePerDays.push({ name: "Spell", state: true });
        cd.onePerDays = cd.onePerDays;
        save()
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
    margin: 30px 0px;
  }
  .ml59{
    margin-left: 59px;
  }
</style>
