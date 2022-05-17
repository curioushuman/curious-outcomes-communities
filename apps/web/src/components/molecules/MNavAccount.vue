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
      <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
    </q-avatar>

    <q-menu auto-close>
      <q-list dense>
        <q-item class="GL__menu-link-signed-in">
          <q-item-section>
            <div>Signed in as <strong>Mary</strong></div>
          </q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable class="GL__menu-link">
          <q-item-section>Sign out</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Account options
 *
 */
export default defineComponent({
  name: 'MNavAccess',
});
</script>

<style lang="sass">
.GL

  &__menu-link:hover
    background: #0366d6
    color: white

  &__menu-link-signed-in,
  &__menu-link-status
    &:hover
      & > div
        background: white !important

  &__menu-link-status
    color: $blue-grey-6
    &:hover
      color: $light-blue-9

  &__toolbar-select.q-field--focused
    width: 450px !important
    .q-field__append
      display: none
</style>
