<template>
  <q-page class="row q-pa-xl q-col-gutter-lg items-center justify-center">
    <div class="col-xs-12 col-sm-6 col-md-6 text-center">
      <q-img src="/img/psyduck.png" alt="An embarrassed Psyduck" />
    </div>
    <div class="col-xs-12 col-md-6">
      <!-- TODO: This needs to be center-ed when lt medium -->
      <div class="text-center">
        <!-- TODO: This needs to be smaller when smaller -->
        <h1>{{ welcomeMessage }}</h1>
        <div class="q-pa-md">
          <p :class="classWelcome">
            Do your friends out-do you when it comes to vague stats and unique
            species? We've got your covered...
          </p>
        </div>

        <div class="q-pa-md q-gutter-md">
          <a-button label="Join us" to="/main" />
          <a-button
            label="Show me how it works"
            button-type="tertiary"
            to="/main"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useQuasar } from 'quasar';

import AButton from 'components/atoms/AButton.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { AButton },
  setup() {
    const $q = useQuasar();
    const classWelcome = computed(() => {
      return $q.screen.sm ? 'text-body1 q-px-xl' : 'text-body1 q-px-sm';
    });
    const welcomeMessage = 'For those embarrassing Pokemon moments...';
    return { welcomeMessage, classWelcome };
  },
});
</script>
