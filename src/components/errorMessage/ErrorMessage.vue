<template>
  <v-card>
    <v-card-title
      class="headline grey lighten-2"
      primary-title
    >
      {{ $t('Lack-of-necessary-information') }}
    </v-card-title>

    <v-card-text>
      <div
        v-for="(e,index) in errorMessage.message"
        :key="index"
      >
        {{ e }}
      </div>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="primary"
        flat
        @click="hideErrorMessage"
      >
        i see
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    errorMessage: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    hideErrorMessage() {
      this.$emit('hideErrorMessage', false);
    },
  },
};
</script>
