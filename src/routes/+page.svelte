<script>
  import cardsJson from "$lib/cards.json";
  import Card from "$lib/Components/Card.svelte";
  import { getContext } from "svelte";
  let zenMode = getContext("zenMode");

  let cards = $state(cardsJson);

  const set = $state({
    name: "Prismatic Evolutions",
    abbr: "PRE",
    symbol:
      "https://static.tcgcollector.com/content/images/bd/e7/28/bde7281c776b1372236703d0b8060d6b6f4e7f3c1d553c3a8bd7e9deeff27f52.webp",
    count: 131,
  });
</script>

<section class="px-3">
  <div
    id=""
    class="flex gap-2 items-center min-h-10 border-b border-b-slate-200"
  >
    <img
      src={set.symbol}
      alt={set.name}
      loading="eager"
      width="25"
      height="13"
      id="card-search-result-title-set-symbol"
      class="set-symbol"
    />

    <span
      id="card-search-result-title-text"
      class="flex gap-1 items-baseline font-semibold"
    >
      <span id="card-search-result-title-set-like-name font-bold"
        >{set.name}</span
      ><span id="card-search-result-title-set-code">{set.abbr}</span>
    </span>
  </div>

  <!-- 
      🟡 special grid-mode when in zen-mode. This is auto-fill grid and mobile-first
        gives enough space for the variant pickers
    -->

  <section
    id="card-image-grid"
    class={zenMode.active
      ? "mx-auto grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(380px,480px))] justify-center pb-20"
      : ""}
  >
    {#each cards as card}
      <Card {card} {set} />
    {/each}
  </section>
</section>
