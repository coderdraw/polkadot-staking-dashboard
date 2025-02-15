// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useState } from 'react';
import { useModal } from 'contexts/Modal';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { planckBnToUnit, rmCommas } from 'Utils';
import {
  NotesWrapper,
  PaddingWrapper,
  Separator,
  FooterWrapper,
} from 'modals/Wrappers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp, faMinus } from '@fortawesome/free-solid-svg-icons';
import { Warning } from 'library/Form/Warning';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { ContentWrapper } from 'modals/UpdateBond/Wrappers';
import { useNetworkMetrics } from 'contexts/Network';
import { useStaking } from 'contexts/Staking';
import { usePoolMembers } from 'contexts/Pools/PoolMembers';
import { EstimatedTxFee } from 'library/EstimatedTxFee';
import { useTxFees } from 'contexts/TxFees';
import { Title } from 'library/Modal/Title';

export const WithdrawPoolMember = () => {
  const { api, network } = useApi();
  const { activeAccount, accountHasSigner } = useConnect();
  const { staking } = useStaking();
  const { setStatus: setModalStatus, config } = useModal();
  const { metrics } = useNetworkMetrics();
  const { removePoolMember } = usePoolMembers();
  const { txFeesValid } = useTxFees();

  const { activeEra } = metrics;
  const { member, who } = config;
  const { historyDepth } = staking;
  const { unbondingEras, points } = member;

  // calculate total for withdraw
  let totalWithdrawBase: BN = new BN(0);

  Object.entries(unbondingEras).forEach((entry: any) => {
    const [era, amount] = entry;
    if (activeEra.index > era) {
      totalWithdrawBase = totalWithdrawBase.add(new BN(rmCommas(amount)));
    }
  });

  const bonded = planckBnToUnit(new BN(rmCommas(points)), network.units);

  const totalWithdraw = planckBnToUnit(
    new BN(totalWithdrawBase),
    network.units
  );

  // valid to submit transaction
  const [valid] = useState<boolean>(totalWithdraw > 0 ?? false);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!valid || !api) {
      return _tx;
    }
    _tx = api.tx.nominationPools.withdrawUnbonded(who, historyDepth);
    return _tx;
  };
  const { submitTx, submitting } = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: valid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {
      // remove the pool member from context if no more funds bonded
      if (bonded === 0) {
        removePoolMember(who);
      }
    },
  });

  return (
    <>
      <Title title="Withdraw Member Funds" icon={faMinus} />
      <PaddingWrapper verticalOnly />
      <ContentWrapper>
        <div>
          <div>
            {!accountHasSigner(activeAccount) && (
              <Warning text="Your account is read only, and cannot sign transactions." />
            )}
            <h2>
              Withdraw {totalWithdraw} {network.unit}
            </h2>

            <Separator />
            <NotesWrapper>
              <EstimatedTxFee />
            </NotesWrapper>
          </div>
          <FooterWrapper>
            <div>
              <button
                type="button"
                className="submit"
                onClick={() => submitTx()}
                disabled={
                  !valid ||
                  submitting ||
                  !accountHasSigner(activeAccount) ||
                  !txFeesValid
                }
              >
                <FontAwesomeIcon
                  transform="grow-2"
                  icon={faArrowAltCircleUp as IconProp}
                />
                Submit
              </button>
            </div>
          </FooterWrapper>
        </div>
      </ContentWrapper>
    </>
  );
};
