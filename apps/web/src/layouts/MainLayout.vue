<template>
  <q-layout class="bg-grey-1">
    <o-toolbar />

    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      :width="200"
      :breakpoint="500"
      bordered
      class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/main">
            <q-item-section avatar>
              <q-icon name="search" />
            </q-item-section>

            <q-item-section> Find a Pokemon </q-item-section>
          </q-item>

          <q-item active clickable v-ripple to="/main/new">
            <q-item-section avatar>
              <q-icon name="cruelty_free" />
            </q-item-section>

            <q-item-section> Find something... </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import OToolbar from 'components/organisms/OToolbar.vue';

export default {
  name: 'MarketingLayout',
  components: { OToolbar },
};
</script>
