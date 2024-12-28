<script lang="ts">
  import spellTable from "./lib/spellTable.json";

  let cd : {
    "level" : number,
    "deltas" : Array<number>,
    "onePerDays" : Array<{ name: String, state: boolean}>
    "sps": number,
  } 

  const savedData = localStorage.getItem("characterData")

  if (savedData == null)
    cd = {
      "level" : 1,
      "deltas" : [0],
      "onePerDays" : [],
      "sps" : 0,
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

  function incrementSp(decrement:boolean = false) : void {
    cd.sps += decrement ? -1 : 1;
    cd.sps = Math.max(cd.sps, 0);
    console.log(cd.sps);
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
  <section class="flex">
    <input
      class="box field m0a"
      type="number"
      min="1"
      max={spellTable.length}
      on:input= { e => {
          const v = e.target.value
          console.log(cd.level)
          cd.deltas = Array(spellTable[v ? v - 1 : 1].length).fill(0);
          cd.level = v ? v : 1
        }
      }
    />
  </section>

  <!-- spell slots -->
  <section>
    <div>
    {#each spellTable[cd.level - 1] as numSlots, spellLevelIndex}
      <div class="flex">
        <h2>{spellLevelIndex + 1}</h2>
        <button
          on:click={() =>incrementSlot(spellLevelIndex, numSlots, true)}>-</button>
          <!-- calculates white boxes -->
          <div class="flex wrap">
        {#each Array(numSlots + Math.max(0, cd.deltas[spellLevelIndex])) as _, slotLevelIndex}
          <div
            class={calculateBoxColor(numSlots, spellLevelIndex, slotLevelIndex, cd.deltas)}
          ></div>
        {/each}
      </div>
        <button on:click={() => incrementSlot(spellLevelIndex, numSlots)}>+</button>
      </div>
    {/each}
    </div>
  </section>

  <!-- once per days -->
  <section>
    <div>
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
    </div>
    <button
      class="m0a"
      on:click={() => {
        cd.onePerDays.push({ name: "Spell", state: true });
        cd.onePerDays = cd.onePerDays;
        save()
      }}>Add a once-per-day</button
    >
  </section>

  <section>
      <div class="flex">
        <h2 class="sp-offset">SP</h2>
        <button
          on:click={() => incrementSp(true)}>-</button>
          <!-- calculates white boxes -->
        <div class="flex wrap">
        {#each Array(cd.sps).fill(0) as _ }
          <div
            class="box white"
          ></div>
        {/each}
        </div>
        <button on:click={() => incrementSp()}>+</button>
      </div>
  </section>
</main>

<style>
  h2{
    width: 20px;}
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
    margin-bottom: 30px;
    min-width: 338.08px;
  }
  .ml59{
    margin-left: 59px;
  }
  section{
    max-width: 100vw;
  }
  .wrap{
    flex-wrap: wrap;
    max-width: 180px;
  }
  .sp-offset{
    position: relative;
    transform: translateX(-20px);
  }
  .m0a{
    display: block;
    margin: 0 auto;
  }
</style>
