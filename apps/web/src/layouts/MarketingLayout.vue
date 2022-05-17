<template>
  <q-layout class="bg-grey-1">
    <o-toolbar />
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
