// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Checkbox from 'react-custom-checkbox';
import { defaultThemes } from 'theme/default';
import { useTheme } from 'styled-components';
import { SelectWrapper } from 'library/ListItem/Wrappers';
import { useList } from '../../List/context';
import { SelectProps } from '../types';

export const Select = (props: SelectProps) => {
  const { item } = props;

  const { mode }: any = useTheme();
  const { addToSelected, removeFromSelected, selected } = useList();

  return (
    <SelectWrapper>
      <Checkbox
        onChange={() => {
          if (selected.includes(item)) {
            removeFromSelected([item]);
          } else {
            addToSelected(item);
          }
        }}
        icon={
          <FontAwesomeIcon
            icon={faCheck as IconProp}
            transform="shrink-2"
            color={defaultThemes.text.secondary[mode]}
          />
        }
        borderColor="rgba(0,0,0,0)"
        style={{
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        size={18}
      />
    </SelectWrapper>
  );
};

export default Select;
