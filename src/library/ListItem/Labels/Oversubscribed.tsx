// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useApi } from 'contexts/Api';
import { useValidators } from 'contexts/Validators';
import { useTooltip } from 'contexts/Tooltip';
import {
  TooltipPosition,
  TooltipTrigger,
  OverSubscribedWrapper,
} from 'library/ListItem/Wrappers';
import { OversubscribedProps } from '../types';

export const Oversubscribed = (props: OversubscribedProps) => {
  const { consts, network } = useApi();
  const { meta } = useValidators();
  const { setTooltipPosition, setTooltipMeta, open } = useTooltip();

  const { batchIndex, batchKey } = props;

  const identities = meta[batchKey]?.identities ?? [];
  const supers = meta[batchKey]?.supers ?? [];
  const stake = meta[batchKey]?.stake ?? [];

  // aggregate synced status
  const identitiesSynced = identities.length > 0 ?? false;
  const supersSynced = supers.length > 0 ?? false;

  const synced = {
    identities: identitiesSynced && supersSynced,
    stake: stake.length > 0 ?? false,
  };

  const eraStakers = stake[batchIndex];

  const total_nominations = eraStakers?.total_nominations ?? 0;
  const lowestReward = eraStakers?.lowestReward ?? 0;

  const displayOversubscribed =
    synced.stake &&
    total_nominations >= consts.maxNominatorRewardedPerValidator;

  const posRef = useRef(null);

  const tooltipText = `Over subscribed: Minimum reward bond is ${lowestReward} ${network.unit}`;

  const toggleTooltip = () => {
    if (!open) {
      setTooltipMeta(tooltipText);
      setTooltipPosition(posRef);
    }
  };

  return (
    <>
      {displayOversubscribed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1 }}
        >
          <div className="label warning">
            <TooltipTrigger
              className="tooltip-trigger-element"
              data-tooltip-text={tooltipText}
              onMouseMove={() => toggleTooltip()}
            />
            <TooltipPosition ref={posRef} />
            <OverSubscribedWrapper>
              <span className="warning">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  transform="shrink-2"
                  className="warning"
                />
              </span>
              {lowestReward} {network.unit}
            </OverSubscribedWrapper>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Oversubscribed;
