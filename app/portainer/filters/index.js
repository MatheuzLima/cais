import angular from 'angular';
import _ from 'lodash-es';

import { ownershipIcon } from '@/react/docker/components/datatable/createOwnershipColumn';
import { stripProtocol } from '@/react/common/string-utils';
import i18n from '@/i18n';
import { arrayToStr, endpointTypeName, getPairKey, getPairValue, humanize, ipAddress, isoDate, isoDateFromTimestamp, labelsToStr, truncate, truncateLeftRight } from './filters';

angular
  .module('portainer.app')
  .filter('truncate', () => truncate)
  .filter('truncatelr', () => truncateLeftRight)
  .filter('capitalize', () => _.capitalize)
  .filter('stripprotocol', () => stripProtocol)
  .filter('humansize', () => humanize)
  .filter('getisodatefromtimestamp', () => isoDateFromTimestamp)
  .filter('getisodate', () => isoDate)
  .filter('key', () => getPairKey)
  .filter('value', () => getPairValue)
  .filter('emptyobject', () => _.isEmpty)
  .filter('ipaddress', () => ipAddress)
  .filter('arraytostr', () => arrayToStr)
  .filter('labelsToStr', () => labelsToStr)
  .filter('endpointtypename', () => endpointTypeName)
  .filter('ownershipicon', () => ownershipIcon)
  // usage: {{ 'Log in to your account' | translate }}
  // placeholders use __name__ because {{name}} would end the surrounding AngularJS expression:
  //   {{ 'At least __count__ characters' | translate: { count: n } }}
  // language changes reload the page, so the filter can stay stateless
  .filter('translate', () => (key, options) => i18n.t(key, { ...options, interpolation: { prefix: '__', suffix: '__' } }));
