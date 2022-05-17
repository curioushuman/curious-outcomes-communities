<template>
  <q-page class="q-px-md">
    <div class="q-pa-none">
      <h1 class="text-overline">Find something...</h1>
      <q-btn-group spread>
        <q-btn color="primary" label="Cool" />
        <q-btn color="primary" label="Rare" />
        <q-btn color="primary" label="Funny" />
        <q-btn color="primary" label="Odd" />
      </q-btn-group>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-6">
        <h2>Tiny tim</h2>
        <q-img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png"
          alt="An embarrassed Psyduck"
        />
      </div>
      <div class="col-xs-12 col-md-6"></div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const welcomeMessage = 'For those embarrassing Pokemon moments...';
    return { welcomeMessage };
  },
});
</script>
