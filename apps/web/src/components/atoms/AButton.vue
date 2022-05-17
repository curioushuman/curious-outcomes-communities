<template>
  <q-btn
    v-if="isTertiary"
    flat
    :color="buttonColor"
    :size="buttonSize"
    :label="label"
    :to="to"
  />
  <q-btn
    v-else-if="isToolbar"
    unelevated
    rounded
    class="q-px-l q-py-xs"
    color="white"
    text-color="black"
    size="sm"
    :label="label"
    :to="to"
  />
  <q-btn
    v-else
    unelevated
    rounded
    class="q-px-xl q-py-xs"
    :color="buttonColor"
    :size="buttonSize"
    :label="label"
    :to="to"
  />
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { ResponsiveSize, ButtonType } from 'components/types/util.ts';

/**
 * A simple, consistent style for our buttons
 *
 * TODO: did we overstuff this by throwing in toolbar?
 */
export default defineComponent({
  name: 'AButton',
  props: {
    label: {
      type: String,
      default: '--missing--',
    },
    size: {
      type: String as PropType<ResponsiveSize>,
      default: ResponsiveSize.XL,
    },
    buttonType: {
      type: String as PropType<ButtonType>,
      default: ButtonType.PRIMARY,
    },
    // RouteRecordRaw.path is a string
    // https://router.vuejs.org/api/#path
    // TODO: can we check this against routes?
    to: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const buttonSize = computed(() => {
      return props.buttonType === ButtonType.TERTIARY
        ? ResponsiveSize.MD
        : props.size;
    });
    const buttonColor = computed(() => {
      return props.buttonType === ButtonType.TERTIARY
        ? 'secondary'
        : props.buttonType;
    });
    const isTertiary = computed(() => {
      return props.buttonType === ButtonType.TERTIARY;
    });
    const isToolbar = computed(() => {
      return props.buttonType === ButtonType.TOOLBAR;
    });
    return {
      buttonSize,
      buttonColor,
      isTertiary,
      isToolbar,
    };
  },
});
</script>
