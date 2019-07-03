// Copyright (C) 2019 Contributors as noted in the AUTHORS file
//
// This file is part of nem2-wallet-browserextension.
//
// nem2-wallet-browserextension is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// nem2-wallet-browserextension is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with nem2-wallet-browserextension.  If not, see http://www.gnu.org/licenses/.

<template>
  <v-layout column>
    <h1 class="headline pt-3">
      {{ $t('About-nem2-wallet-browserextension') }}
    </h1>

    <h2 class="sub-headline pt-3">
      {{ $t('For-users') }}
    </h2>
    <p>
      {{ $t('This-wallet-is-under-development-if-you-find-any-issue') }} <a
        :href="LINKS.repoIssues"
        target="_new"
      >{{ $t('please-report-them-on-Github') }}</a>
    </p>
    <p>
      {{ $t('The-wallet') }} <a
        :href="LINKS.repoReleases"
        target="_new"
      >{{ $t('is-available-as-a-Mozilla-Firefox-extension') }}</a>
    </p>
    <p>
      {{ $t('It-is-also') }} <a
        :href="LINKS.webWallet"
        target="_new"
      >{{ $t('deployed-as-a-web-version') }}</a>
      {{ $t('Please-note-that-URI-transaction-handling-can-only-be-done-with-the-web-extension') }}
    </p>
    <v-layout column>
      <v-flex>
        <h2 class="sub-headline pt-3">
          {{ $t('For-developers') }}
        </h2>

        <v-layout class="align-center ml-0 mb-1">
          <b>{{ $t('Source-code-repository') }}: </b>
          <a
            :href="LINKS.repo"
            class="mx-1"
          >{{ LINKS.repo }}</a> {{ $t('licenced-under') }}
          <img
            :src="LINKS.licenceImage"
            class="ml-1"
          >
        </v-layout>

        <ul class="mt-3 faq">
          <li>{{ $t('How-can-I-contribute?') }}</li>
        </ul>
        <p>
          {{ $t('Please') }} <a
            :href="LINKS.repo"
            class="mx-1"
          >{{ $t('refer-to-the-readme-for-guidance') }}</a>,
          {{ $t('and-make-sure-to-join-the') }} <a
            :href="LINKS.nem2Slack"
            class="mx-1"
          >{{ $t('sig-client-Slack-channel') }}</a> {{ $t('to-get-in-touch-with-the-devs!') }}
        </p>
        <ul class="mt-3 faq">
          <li>{{ $t('How-can-I-integrate-a-web-application-with-this-wallet?') }}</li>
        </ul>
        <p>
          {{ $t('There-are-no-guides-available-yet.-Feel-free-to') }} <a
            :href="LINKS.nem2Slack"
            class="mx-1"
          >{{ $t('ask-questions-in-the') }} {{ $t('sig-client-Slack-channel') }}!</a>
        </p>
      </v-flex>
    </v-layout>
  </v-layout>
</template>
<script>
import { LINKS } from '../constants';

export default {
  data() {
    return {
      LINKS,
    };
  },
};
</script>
<style scoped>
.sub-headline {
  font-size: 20px;
  font-weight: 400;
}
.faq {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 0.5em;
}
</style>
