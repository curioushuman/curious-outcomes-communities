<template>
  <q-header
    elevated
    class="text-white"
    style="background: black"
    height-hint="61.59"
  >
    <q-toolbar class="q-py-sm q-px-md">
      <a-logo />

      <q-toolbar-title> Pok-E-Dentifier </q-toolbar-title>

      <q-space />

      <div
        v-if="isLoggedIn"
        class="q-pl-sm q-gutter-sm row items-center no-wrap"
      >
        <m-nav-account />
      </div>
      <div
        v-else
        class="GL__toolbar-link q-ml-xs q-gutter-md text-body2 text-weight-bold row no-wrap"
      >
        <m-nav-access />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ALogo from 'components/atoms/ALogo.vue';
import MNavAccess from 'components/molecules/MNavAccess.vue';
import MNavAccount from 'components/molecules/MNavAccount.vue';

/**
 * Toolbar
 *
 */
export default defineComponent({
  name: 'OToolbar',
  components: { ALogo, MNavAccess, MNavAccount },
  setup() {
    return { isLoggedIn: false };
  },
});
</script>

<style lang="sass">
.GL

  &__toolbar-link
    a
      color: white
      text-decoration: none
      &:hover
        opacity: 0.7
</style>
