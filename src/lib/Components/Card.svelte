<script>
  import { getContext, hasContext } from "svelte";
  import Variant from "./Variant.svelte";
  import { observe } from "./observer.action";

  let zenMode = getContext("zenMode");

  let {
    card = $bindable({
      variants: [],
      name: "",
      number: 0,
    }),
    set = {
      count: 0,
      name: "",
      abbr: "",
    },
  } = $props();

  let tag = $derived(zenMode.active ? "div" : "a");
  let number = $derived((card.number + "").padStart(3, "0"));
  let quantity = $derived.by(() => {
    return card.variants.reduce((p, c, i) => (p ?? 0) + (c?.quantity ?? 0), 0);
  });

  let isInView = $state(false);
</script>

<!-- 
  🟢 intersection observer keeps non-visible elements 
  out of DOM render operations ~ good for performance
-->

<div
  class="@container card-image-grid-item card-search-result-item has-image"
  class:invisible={!isInView}
  use:observe={{ rootMargin: "100px" }}
  onenterview={() => (isInView = true)}
  onexitview={() => (isInView = false)}
>
  <!-- 🟢 when in zen mode, <a> tag is disabled so user doesnt click-thought by accident -->

  <svelte:element
    this={tag}
    href={zenMode.active ? null : card.url}
    title="{card.name} ({set.name} {number}/{set.count})"
    class="card-image-grid-item-link grid grid-cols-1 grid-rows-1"
  >
    <div class="card-image-grid-item-card-title hidden">
      {card.name} ({set.name}
      {number}/{set.count})
    </div>

    <!-- 🟢 when in zen mode, no pointer events on images (prevents dragging them when scrolling) -->

    <img
      src={card.image}
      loading="eager"
      alt="{card.name} ({set.name} {number}/{set.count})"
      width="320"
      height="447"
      sizes="(max-width: 320px) 100vw, 320px"
      class="card-image-grid-item-image row-[1/-1] col-[1/-1] transition-opacity"
      class:opacity-50={quantity < 1}
      class:pointer-events-none={zenMode.active}
    />

    <!-- 

      🟡 here we loop through card's possible variants, and user's owned quantity
      if there are _too many_ variants, the variants list will scroll

      But this is a 'zen entry mode', it shouldn't be used for finding obscure variants really,
      it's meant for entering a large # of cards from a specific set

    -->

    {#if zenMode.active}
      <div
        class="row-[1/-1] col-[1/-1] self-end max-w-full aspect-[4/3] flex flex-col justify-end transform-gpu pb-6 bg-gradient-to-b from-transparent to-80% to-slate-800/50 rounded-lg z-1"
      >
        <div class="variant-scroller py-4 overflow-auto h-full">
          <div class="flex flex-col justify-end gap-2 min-h-full">
            {#each card.variants as variant, i}
              <Variant
                id={card.id}
                bind:variant={card.variants[i]}
                hasQuantity={quantity > 0}
              />
            {/each}
          </div>
        </div>
      </div>
    {/if}

    <div class="card-image-grid-item-info-overlay-text">
      <span class="card-image-grid-item-info-overlay-text-part">
        {number}/{card.set.count}</span
      >
    </div>

    <div class="card-image-grid-item-info-overlay-expansion-symbol-container">
      <img
        src={card.set.symbol}
        loading="eager"
        alt={card.set.name}
        width="25"
        height="13"
        sizes="(max-width: 25px) 100vw, 25px"
        class="set-symbol"
      />
    </div>
  </svelte:element>

  <div class="card-image-controls">
    <div class="card-image-controls-item">
      <span class="card-image-controls-item-rarity">
        <img
          src={card.rarity.symbol}
          loading="eager"
          alt={card.rarity.name}
          width="13"
          height="13"
          sizes="(max-width: 13px) 100vw, 13px"
          title={card.rarity.name}
          class="card-rarity-symbol"
        />
      </span>

      <button
        type="button"
        tabindex={zenMode.active ? "-1" : undefined}
        title="View all prices"
        aria-label="View all prices"
        class="card-price-details-modal-show-button card-image-controls-item-price button button-link-like"
        data-card-id="47035"
        data-full-card-name-without-tcg-region="{card.name} ({set.name} {number}/{set.count})"
      >
        $0.05
      </button>

      <span
        class="card-collection-card-controls flex items-center mr-3"
        class:card-variants-completed-icon-shown={card.variants.every(
          (v) => v.quantity > 0
        )}
      >
        <span
          aria-label="My collection entries"
          class:hidden={!zenMode.active}
          class="card-collection-card-controls-indicators flex items-center pointer-events-none"
        >
          <span
            aria-hidden="true"
            class="card-collection-card-indicator card-collection-card-indicator-standard-set card-collection-card-indicator-with-dot"
            class:active={card.variants.filter(
              (v) => v.type === "normal" && v.quantity > 0
            ).length}
          >
          </span>
          {#if card.variants.filter((v) => v.type === "parallel").length}
            <span
              aria-hidden="true"
              class:active={card.variants.filter(
                (v) => v.type === "parallel" && v.quantity > 0
              ).length}
              class="card-collection-card-indicator card-collection-card-indicator-parallel-set"
            >
            </span>
          {/if}
          {#if card.variants.filter((v) => v.type === "other").length}
            <span
              aria-hidden="true"
              class:active={card.variants.filter(
                (v) => v.type === "other" && v.quantity > 0
              ).length}
              class="card-collection-card-indicator card-collection-card-indicator-other-variants"
            >
            </span>
          {/if}
        </span></span
      >

      <button
        type="button"
        tabindex={zenMode.active ? "-1" : undefined}
        title="Toggle card in wishlist"
        aria-label="Toggle card in wishlist"
        class="card-wishlist-toggle-button card-wishlist-toggle-button-with-icon-only"
        data-card-id="47035"
      >
        <span
          aria-hidden="true"
          class="card-wishlist-toggle-button-icon fa-solid fa-heart"
        >
        </span>
      </button>
    </div>

    {#if !zenMode.active}
      <div
        class="card-collection-card-controls card-image-controls-item"
        data-card-id="47035"
        data-full-card-name-without-tcg-region="{card.name} ({set.name} {number}/{set.count})"
      >
        <button
          type="button"
          title="View my collection entries"
          aria-label="View my collection entries"
          class="card-collection-card-controls-indicators"
        >
          <span
            aria-hidden="true"
            class="card-collection-card-indicator card-collection-card-indicator-standard-set card-collection-card-indicator-with-dot"
          >
          </span>

          <span
            aria-hidden="true"
            class="card-collection-card-indicator card-collection-card-indicator-parallel-set"
          >
          </span>
        </button>

        <div
          class="number-spinner card-collection-card-controls-number-spinner"
          data-min-range="0"
        >
          <button
            type="button"
            title="Decrement the number"
            aria-label="Decrement the number"
            class="number-spinner-button number-spinner-decrement-button"
          >
            <span aria-hidden="true" class="fa-solid fa-minus"></span>
          </button>

          <span class="number-spinner-value">0</span>

          <button
            type="button"
            title="Increment the number"
            aria-label="Increment the number"
            class="number-spinner-button number-spinner-increment-button"
          >
            <span aria-hidden="true" class="fa-solid fa-plus"></span>
          </button>
        </div>

        <button
          type="button"
          title="Show more options"
          aria-label="Show more options"
          class="card-collection-card-controls-dropdown-toggle dropdown-toggle"
        >
          <span aria-hidden="true" class="fa-solid fa-ellipsis-vertical"></span>
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  @layer components {
    .variant-scroller {
      scrollbar-width: thin;
    }
    @media screen and (max-width: 460px) {
      .variant-scroller {
        scrollbar-width: none;
      }
    }
  }
</style>
