// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import {
  faHashtag,
  faServer,
  faStar,
  faUsers,
  faComment,
  faChartSimple,
  faBraille,
  faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';
import Overview from 'pages/Overview';
import Nominate from 'pages/Nominate';
import Pools from 'pages/Pools';
import Browse from 'pages/Validators';
import Favourites from 'pages/Favourites';
import Payouts from 'pages/Payouts';
import Community from 'pages/Community';
import Feedback from 'pages/Feedback';
import { URI_PREFIX } from 'consts';
import { PageCategories, PagesConfig } from 'types';

export const PAGE_CATEGORIES: PageCategories = [
  {
    _id: 1,
    title: 'default',
  },
  {
    _id: 2,
    title: 'nominate',
  },
  {
    _id: 3,
    title: 'Validators',
  },
  {
    _id: 4,
    title: 'Feedback',
  },
];

export const PAGES_CONFIG: PagesConfig = [
  {
    category: 1,
    title: 'Overview',
    uri: `${URI_PREFIX}/`,
    hash: '/overview',
    Entry: Overview,
    icon: faBraille,
  },
  {
    category: 1,
    title: 'Payouts',
    uri: `${URI_PREFIX}/payouts`,
    hash: '/payouts',
    Entry: Payouts,
    icon: faChartSimple,
  },
  {
    category: 2,
    title: 'Pools',
    uri: `${URI_PREFIX}/pools`,
    hash: '/pools',
    Entry: Pools,
    icon: faUsers,
  },
  {
    category: 2,
    title: 'Nominate',
    uri: `${URI_PREFIX}/nominate`,
    hash: '/nominate',
    Entry: Nominate,
    icon: faProjectDiagram,
  },
  {
    category: 3,
    title: 'Validators',
    uri: `${URI_PREFIX}/validators`,
    hash: '/validators',
    Entry: Browse,
    icon: faServer,
  },
  {
    category: 3,
    title: 'Community',
    uri: `${URI_PREFIX}/community`,
    hash: '/community',
    Entry: Community,
    icon: faHashtag,
  },
  {
    category: 3,
    title: 'Favourites',
    uri: `${URI_PREFIX}/favourites`,
    hash: '/favourites',
    Entry: Favourites,
    icon: faStar,
  },
  {
    category: 4,
    title: 'Feedback',
    uri: `${URI_PREFIX}/feedback`,
    hash: '/feedback',
    Entry: Feedback,
    icon: faComment,
  },
];

export default PAGES_CONFIG;
