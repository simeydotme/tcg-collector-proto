<script>
  let {
    id,
    hasQuantity,
    variant = $bindable({
      name: "Normal",
      quantity: 0,
    }),
  } = $props();

  const vibrate = (ms) => {
    if (navigator?.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const plus = () => {
    variant.quantity += 1;
    vibrate(40);
  };

  const minus = () => {
    if (variant.quantity - 1 <= 0) {
      variant.quantity = 0;
      return;
    }
    variant.quantity -= 1;
    vibrate(40);
  };

  // 🟢 make sure quantity cant be below 0, and isnt a float

  const check = (e) => {
    if (
      typeof variant.quantity === "undefined" ||
      variant.quantity === null ||
      isNaN(e.target.valueAsNumber) ||
      variant.quantity === "" ||
      variant.quantity < 0
    ) {
      variant.quantity = 0;
    }
    variant.quantity = parseInt(Math.round(variant.quantity));
  };

  let pressTimer = null;
  let accumulationTimer = null;
  let isLongPressing = false;

  // 🟢 allow user to hold finger on button to keep incrementing

  function startLongPress(ev, value) {
    pressTimer = window.setTimeout(() => {
      isLongPressing = true;
      ev.preventDefault();
      ev.stopPropagation();
      startAccumulation(value);
    }, 200);
  }

  function startAccumulation(value) {
    accumulationTimer = window.setInterval(() => {
      if (variant.quantity + value < 0) {
        clearTimers();
        return;
      }
      variant.quantity += value;
      vibrate(20);
    }, 66);
  }

  function clearTimers() {
    if (pressTimer) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
    if (accumulationTimer) {
      clearInterval(accumulationTimer);
      accumulationTimer = null;
    }
    isLongPressing = false;
  }

  function handlePlusDown(ev) {
    startLongPress(ev, 1);
  }

  function handlePlusUp() {
    clearTimers();
    if (!isLongPressing) {
      plus();
    }
  }

  function handleMinusDown(ev) {
    startLongPress(ev, -1);
  }

  function handleMinusUp() {
    clearTimers();
    if (!isLongPressing) {
      minus();
    }
  }
</script>

<!-- 🟢 select-none prevents any accidental copy/paste occurring -->

<div
  class="@max-sm:text-sm ml-2 pl-3 p-1 w-[calc(100%-1rem)] min-h-8 col-[1/-1] flex items-center gap-2 rounded-xl select-none [&>*]:select-none shadow-lg shadow-slate-700/25 backdrop-blur-xl backdrop-brightness-125 border-1 border-t-white/90 border-slate-800/5 border-b-slate-600/15 transition-all transform-gpu bg-clip-padding bg-gradient-to-r to-transparent to-40% {hasQuantity
    ? 'bg-slate-100/50'
    : 'bg-slate-200/30'}"
  class:from-[#fa703588]={variant.type === "normal" && variant.quantity > 0}
  class:from-[#5bc0de88]={variant.type === "parallel" && variant.quantity > 0}
  class:from-[#e663ca88]={variant.type === "other" && variant.quantity > 0}
  title="{variant.name}: {variant.quantity}"
>
  <!-- 
    🟡 filter effects (blur/brightness/saturation/shadow) are to try and help the UI 'pop' from the card
    no matter what color the card is. Applied gpu tranform to negate most performance penalties.
  -->

  <span
    aria-hidden="true"
    class:active={variant.quantity > 0}
    class:card-collection-card-indicator-standard-set={variant.type ===
      "normal"}
    class:card-collection-card-indicator-parallel-set={variant.type ===
      "parallel"}
    class:card-collection-card-indicator-other-variants={variant.type ===
      "other"}
    class="card-collection-card-indicator card-collection-card-indicator-with-dot shrink-0 transition-colors"
  >
  </span>
  <label
    for="variant-{id}-{variant.name}"
    class="m-0 w-full h-full leading-3.5 drop-shadow-[0_0_2px_white,0_0_9px_white] line-clamp-3 overflow-visible"
  >
    {variant.name}
  </label>
  <input
    id="variant-{id}-{variant.name}"
    type="number"
    min="0"
    step="1"
    bind:value={variant.quantity}
    oninput={check}
    onchange={check}
    onfocus={(event) => {
      if (variant.quantity === 0) event.target.select();
    }}
    class="ml-auto !h-9 max-w-16 @max-sm:max-w-12 text-right rounded-md bg-gray-50 border-none outline-none ring-1 ring-slate-500/20 focus-visible:ring-violet-400 focus-visible:ring-2 transition-all inset-shadow-xs"
  />
  <!-- 
    🟢 input auto-selects the '0' value to make new entry easier
    🟠 but we dont select when it's non-0 so the user doesnt accidentally wipe their value
  -->
  <button
    tabindex="-1"
    onpointerdown={handleMinusDown}
    onpointerup={handleMinusUp}
    onpointercancel={clearTimers}
    onpointerleave={clearTimers}
    class="size-9 bg-transparent rounded-lg border-none shrink-0 before:-inset-3 before:-right-1 before:absolute hover:before:bg-red-300/20 focus:ring-violet-400 transition-all focus:ring-2 active:ring-violet-400 active:ring-2"
    ><span aria-hidden="true" class="fa-solid fa-minus"></span></button
  >
  <!--
    🟡 I put in a red debug-box to show the ':before' extends past the button edges to increase tap-size,
    this makes using the buttons more forgiving
  -->
  <button
    tabindex="-1"
    onpointerdown={handlePlusDown}
    onpointerup={handlePlusUp}
    onpointercancel={clearTimers}
    onpointerleave={clearTimers}
    class="size-9 bg-transparent rounded-lg border-none shrink-0 before:-inset-3 before:-left-1 before:absolute hover:before:bg-red-300/20 focus:ring-violet-400 transition-all focus:ring-2 active:ring-violet-400 active:ring-2"
    ><span aria-hidden="true" class="fa-solid fa-plus"></span></button
  >
</div>

<style>
  input[type="number"] {
    -moz-appearance: textfield;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
</style>
