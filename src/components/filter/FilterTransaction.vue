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
  <div>
    <v-layout
      style="overflow:hidden"
      pa3
    >
      <v-flex
        sm
      >
        <v-layout
          v-if="filterType != PropertyType.AllowTransaction"
          row
        >
          <v-flex>
            <v-btn
              dark
              :color="isAdd?'primary':'red'"
              @click="isAdd=!isAdd"
            >
              {{ isAdd?'Add':'Remove' }}
              <v-icon
                dark
                right
              >
                {{ isAdd?'add_circle_outline':'remove_circle_outline' }}
              </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs7>
            <v-text-field
              v-model="hexId"
              :placeholder="filterType == PropertyType.AllowAddress
                ? $t('input-address-hex'): $t('input-mosaic-id')"
              solo
            />
          </v-flex>

          <v-flex xs2>
            <v-btn
              :disabled="hexId === ''"
              color="primary"
              @click="addFilter"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

        <v-layout
          v-else
          row
        >
          <v-flex>
            <v-btn
              dark
              :color="isAdd ? 'primary' : 'red'"
              @click="isAdd = !isAdd"
            >
              {{ isAdd ? $t('Add') : $t('Remove') }}
              <v-icon
                dark
                right
              >
                {{ isAdd ? 'add_circle_outline' : 'remove_circle_outline' }}
              </v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs4>
            <v-select
              v-model="additionalModification.hexEntityType"
              :items="entityTypes"
              item-text="label"
              item-value="hexEntityType"
              :label="$t('Optional-Select-From')"
              solo
            />
          </v-flex>

          <v-flex xs2>
            <v-text-field
              v-model="additionalModification.hexEntityType"
              class="ma-0 pa-0"
              solo
              required
            />
          </v-flex>

          <v-flex xs3>
            <v-btn
              :disabled="hexId === '' && additionalModification.hexEntityType === ''"
              color="primary"
              @click="addFilter"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
        <template v-for="(filter, index) in filterList">
          <v-list
            :key="index"
            two-line
          >
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>style</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-subheader>
                  {{ filter.propertyModificationType == 0
                    ? $t('add') : $t('remove') }}
                </v-subheader>
                {{ filterType == PropertyType.AllowTransaction
                  ? `${$t('Entity-Type')}:` : '' }}
                {{ filterType == PropertyType.AllowMosaic
                  ? `${$t('Mosaic-Id')}:` : '' }}
                {{ filterType == PropertyType.AllowAddress
                  ? `${$t('Address-Hex')}:` : '' }}
                {{ filter.hexId }}
              </v-list-tile-content>
              <v-btn
                fab
                small
                color="error"
                @click="removeFilter(index)"
              >
                <v-icon>remove</v-icon>
              </v-btn>
            </v-list-tile>
          </v-list>
        </template>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-card-actions
        row
        justify-end
        align-center
      >
        <v-spacer />
        <v-btn
          color="primary mx-0"
          :disabled="disabledSendTransaction"
          @click="showDialog"
        >
          {{ $t('Send') }}
        </v-btn>
      </v-card-actions>

      <Confirmation
        v-model="isDialogShow"
        :transactions="transactions"
        :generation-hash="generationHash"
        @sent="txSent"
        @error="txError"
      >
        <v-list>
          <v-list-tile
            v-for="detail in dialogDetails"
            :key="detail.key"
          >
            <v-list-tile-action>
              <v-icon>{{ detail.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ detail.key }}: {{ detail.value }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile
            v-for="(detail,index) in filterList"
            :key="index"
          >
            <v-list-tile-action>
              <v-icon />
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ detail.propertyModificationType == 0 ? 'add':'remove' }}:{{ detail.hexId }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </Confirmation>
    </v-layout>

    <v-layout column>
      <SendConfirmation
        :tx-send-data="txSendResults"
        :generation-hash="generationHash"
      />
    </v-layout>


    <v-dialog
      v-model="isShowErrorMessage"
      width="500"
    >
      <ErrorMessageComponent
        :error-message="errorMessage"
        @hideErrorMessage="hideErrorMessage"
      />
    </v-dialog>
  </div>
</template>

<script>
import {
  PropertyModificationType,
  PropertyType,
  NetworkType,
  Deadline,
  UInt64,
  AccountPropertyTransaction,
  Address,
  TransactionType,
  MosaicId,
  AccountPropertyModification,
} from 'nem2-sdk';
import Confirmation from '../signature/Confirmation.vue';
import SendConfirmation from '../signature/SendConfirmation.vue';
import ErrorMessageComponent from '../errorMessage/ErrorMessage.vue';
import ErrorMessage from '../../infrastructure/errorMessage/error-message';

function checkMosaic(pointer, errorMessage) {
  const { filterList } = pointer;
  filterList.every((item) => {
    const filter = item.hexId;
    if (!filter || filter.trim() === '') {
      errorMessage.message.push(ErrorMessage.MOSAIC_NULL);
      return false;
    }
    if (filter.length < 16) {
      errorMessage.message.push(ErrorMessage.MOSAIC_ERROR);
      return false;
    }
    return true;
  });
  return errorMessage;
}

function checkAddress(pointer, errorMessage) {
  const { filterList } = pointer;
  filterList.every((item) => {
    const filter = item.hexId;
    if (!filter || filter.trim() === '') {
      errorMessage.message.push(ErrorMessage.ADDRESS_NULL);
      return false;
    }
    if (filter.length < 40) {
      errorMessage.message.push(ErrorMessage.ADDRESS_ERROR);
      return false;
    }
    return true;
  });
  return errorMessage;
}

function checkCommon(pointer, errorMessage) {
  const { maxFee, generationHash, filterList } = pointer;
  if (maxFee < 0) {
    errorMessage.message.push(ErrorMessage.MAX_FEE_ERROR);
    return errorMessage;
  }
  if (!generationHash || generationHash.trim() === '') {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_NULL);
    return errorMessage;
  }
  if (generationHash.length !== 64) {
    errorMessage.message.push(ErrorMessage.GENERATION_HASH_ERROR);
    return errorMessage;
  }
  if (filterList.length <= 0) {
    errorMessage.message.push(ErrorMessage.FILTER_LIST_NULL);
    return errorMessage;
  }
  return errorMessage;
}

const filterValidator = (pointer) => {
  const { filterType } = pointer;
  let errorMessage = {
    message: [],
    disabled: true,
  };
  errorMessage = checkCommon(pointer, errorMessage);
  if (errorMessage.length !== 0) {
    return errorMessage;
  }
  switch (filterType) {
  case PropertyType.AllowAddress:
    errorMessage = checkAddress(pointer, errorMessage);
    break;
  case PropertyType.AllowMosaic:
    errorMessage = checkMosaic(pointer, errorMessage);
    break;
  default: errorMessage = [];
  }
  errorMessage.disabled = false;
  return errorMessage;
};

export default {
  name: 'FilterTransaction',
  components: {
    Confirmation,
    SendConfirmation,
    ErrorMessageComponent,
  },
  // eslint-disable-next-line vue/require-prop-types
  props: ['actionType', 'filterType', 'maxFee', 'generationHash'],
  data() {
    return {
      isShowErrorMessage: false,
      PropertyType,
      filterList: [],
      isAdd: true,
      hexId: '',
      disabledSendTransaction: false,
      isDialogShow: false,
      dialogDetails: [],
      transactions: [],
      txSendResults: [],
      entityType: {},
      entityTypes: [
        { label: this.$t('Transfer'), entityType: TransactionType.TRANSFER },
        { label: this.$t('Namespace'), entityType: TransactionType.REGISTER_NAMESPACE },
        { label: this.$t('Mosaic-Supply-Change'), entityType: TransactionType.MOSAIC_SUPPLY_CHANGE },
        { label: this.$t('Modify-multisig'), entityType: TransactionType.MODIFY_MULTISIG_ACCOUNT },
        { label: this.$t('Aggregate-Complete'), entityType: TransactionType.AGGREGATE_COMPLETE },
        { label: this.$t('Aggregate-Bonded'), entityType: TransactionType.AGGREGATE_BONDED },
        { label: this.$t('Lock-Funds'), entityType: TransactionType.LOCK },
        { label: this.$t('Secret-Lock'), entityType: TransactionType.SECRET_LOCK },
        { label: this.$t('Secret-Proof'), entityType: TransactionType.SECRET_PROOF },
        { label: this.$t('Address-Alias'), entityType: TransactionType.ADDRESS_ALIAS },
        { label: this.$t('Mosaic-Alias'), entityType: TransactionType.MOSAIC_ALIAS },
        { label: this.$t('Account-Property-Address'), entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS },
        { label: this.$t('Account-Property-Mosaic'), entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC },
        { label: this.$t('Account-Property-Entity-Type'), entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE },
      ].map(x => ({
        label: x.label,
        entityType: x.entityType,
        hexEntityType: x.entityType.toString(16).toUpperCase(),
      })),
      additionalModification: {
        isAdd: true,
        hexEntityType: '4152',
      },
      currentEntityTypeId: 1,
      errorMessage: {},
    };
  },
  watch: {
    filterType() {
      this.filterList = [];
      this.hexId = '';
    },
  },
  methods: {
    addFilter() {
      let filter;
      if (this.filterType !== PropertyType.AllowTransaction) {
        filter = {
          hexId: this.hexId,
          propertyModificationType: this.isAdd
            ? PropertyModificationType.Add : PropertyModificationType.Remove,
        };
      } else {
        filter = {
          hexId: this.additionalModification.hexEntityType,
          propertyModificationType: this.isAdd
            ? PropertyModificationType.Add : PropertyModificationType.Remove,
        };
      }
      this.filterList.push(filter);
    },
    removeFilter(index) {
      this.filterList.splice(index, 1);
    },
    showDialog() {
      this.errorMessage = filterValidator(this);
      if (this.errorMessage.disabled) {
        this.isShowErrorMessage = true;
        return;
      }
      if (this.filterType === PropertyType.AllowAddress) {
        this.generateAddressTransaction();
      } else if (this.filterType === PropertyType.AllowMosaic) {
        this.generateMosaicTransaction();
      } else if (this.filterType === PropertyType.AllowTransaction) {
        this.generateEntityTypeTransaction();
      }
      this.dialogDetails = [
        {
          icon: 'add',
          key: this.$t('Filter-Type'),
          value: 'Address',
        },
        {
          icon: 'add',
          key: this.$t('Action-type'),
          value: this.actionType === 0 ? this.$t('allow') : this.$t('block'),
        },
        {
          icon: 'add',
          key: this.$t('Max-Fee'),
          value: this.maxFee,
        },
        {
          icon: 'add',
          key: this.$t('List'),
          value: '',
        },
      ];
      this.isDialogShow = true;
    },
    generateAddressTransaction() {
      const {
        maxFee, actionType, filterType, filterList,
      } = this;
      const propertyType = actionType + filterType;

      const modifyAddress = AccountPropertyTransaction.createAddressPropertyModificationTransaction(
        Deadline.create(),
        propertyType,
        filterList.map(modification => AccountPropertyModification.createForAddress(
          modification.propertyModificationType,
          Address.createFromRawAddress(modification.hexId),
        )),
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(maxFee),
      );
      this.transactions = [modifyAddress];
    },
    generateMosaicTransaction() {
      const {
        maxFee, actionType, filterType, filterList,
      } = this;
      const propertyType = actionType + filterType;

      const modifyMosaic = AccountPropertyTransaction.createMosaicPropertyModificationTransaction(
        Deadline.create(),
        propertyType,
        filterList.map(modification => AccountPropertyModification.createForMosaic(
          modification.propertyModificationType,
          new MosaicId(modification.hexId),
        )),
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(maxFee),
      );
      this.transactions = [modifyMosaic];
    },

    generateEntityTypeTransaction() {
      const {
        maxFee, actionType, filterType, filterList,
      } = this;
      const propertyType = actionType + filterType;
      // eslint-disable-next-line max-len
      const modifyEntity = AccountPropertyTransaction.createEntityTypePropertyModificationTransaction(
        Deadline.create(),
        propertyType,
        filterList.map(modification => AccountPropertyModification.createForEntityType(
          modification.propertyModificationType,
          Number('0x'.concat(modification.hexId)),
        )),
        NetworkType.MIJIN_TEST,
        UInt64.fromUint(maxFee),
      );
      this.transactions = [modifyEntity];
    },
    hideErrorMessage() {
      this.isShowErrorMessage = false;
    },
    txSent(result) {
      this.txSendResults.push(result);
    },
    txError(error) {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  },
};
</script>
