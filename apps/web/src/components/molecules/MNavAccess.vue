<template>
  <a-button label="Join us" button-type="toolbar" to="/main" />
  <a href="javascript:void(0)" class="text-white" to="/main"> Sign in </a>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AButton from 'components/atoms/AButton.vue';

/**
 * Signup / login
 *
 */
export default defineComponent({
  name: 'MNavAccess',
  components: { AButton },
});
</script>
