<template>
  <q-page class="q-px-md">
    <div class="q-pa-none">
      <h1 class="text-overline">Find a Pokemon</h1>
      <div class="q-pa-none">
        <q-select
          standout
          stack-label
          use-input
          hide-selected
          filled
          label="Try typing their name..."
        >
          <template v-slot:after>
            <q-btn round color="primary" icon="search" />
          </template>
        </q-select>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-md-6">
        <m-pokemon-highlight />
      </div>
      <div class="col-xs-12 col-md-6">
        <m-pokemon-details />
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MPokemonDetails from 'components/molecules/MPokemonDetails.vue';
import MPokemonHighlight from 'components/molecules/MPokemonHighlight.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { MPokemonDetails, MPokemonHighlight },
  setup() {
    const welcomeMessage = 'For those embarrassing Pokemon moments...';
    return { welcomeMessage };
  },
});
</script>
