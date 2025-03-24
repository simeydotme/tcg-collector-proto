<script>
  import "../app.css";
  import "../tcg.css";
  import "../tcg-card.css";
  import { setContext } from "svelte";

  let { children } = $props();
  let zenMode = $state({ active: false });
  const toggleZen = () => {
    zenMode.active = !zenMode.active;
  };
  setContext("zenMode", zenMode);
</script>

<header>
  <nav class="bg-[#333] min-h-[56px] fixed inset-0 bottom-auto z-10"></nav>

  <section class="min-h-32 bg-slate-100">
    <div id="floating-action-buttons">
      <button
        class="floating-action-button button button-primary button-with-icon-only button-round w-auto px-3"
        onclick={() => {
          toggleZen();
        }}>Zen Mode ({zenMode.active ? "on" : "off"})</button
      >
    </div>
  </section>
</header>
<main>
  {@render children()}
</main>

<style>
  @layer components {
    * {
      box-sizing: border-box;
    }
    main {
      font-family:
        Titillium Web,
        sans-serif;
      color: #24292e;
    }
  }
</style>
