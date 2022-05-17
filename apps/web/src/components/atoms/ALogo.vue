<template>
  <q-btn
    round
    dense
    flat
    :ripple="false"
    size="19px"
    color="white"
    class="q-mr-sm"
    no-caps
  >
    <q-avatar round size="28px">
      <!-- TODO: move app name to central location -->
      <img src="/img/poke-logo.png" alt="Pok-E-Dentifier Logo" />
    </q-avatar>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ALogo',
});
</script>
