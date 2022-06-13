// Copyright 2022 @paritytech/polkadot-staking-dashboard authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { useModal } from 'contexts/Modal';
import { useBalances } from 'contexts/Balances';
import { useApi } from 'contexts/Api';
import { useConnect } from 'contexts/Connect';
import { BondInputWithFeedback } from 'library/Form/BondInputWithFeedback';
import { useSubmitExtrinsic } from 'library/Hooks/useSubmitExtrinsic';
import { APIContextInterface } from 'types/api';
import { ConnectContextInterface } from 'types/connect';
import { useActivePool } from 'contexts/Pools/ActivePool';
import { ActivePoolContextState } from 'types/pools';
import { planckBnToUnit, unitToPlanckBn } from 'Utils';
import { BondOptionsInterface } from 'types/balances';
import { NotesWrapper } from '../../Wrappers';
import { FormFooter } from './FormFooter';

export const BondSome = (props: any) => {
  const { setSection } = props;

  const { api, network } = useApi() as APIContextInterface;
  const { units } = network;
  const { setStatus: setModalStatus, setResize, config }: any = useModal();
  const { activeAccount } = useConnect() as ConnectContextInterface;
  const { getBondOptions }: any = useBalances();
  const { getPoolBondOptions } = useActivePool() as ActivePoolContextState;
  const { target } = config;

  const stakeBondOptions: BondOptionsInterface = getBondOptions(activeAccount);
  const poolBondOptions = getPoolBondOptions(activeAccount);
  const isStaking = target === 'stake';
  const isPooling = target === 'pool';

  const { freeToBond: freeToBondBn } = isPooling
    ? poolBondOptions
    : stakeBondOptions;
  const freeToBond = planckBnToUnit(freeToBondBn, units);

  // local bond value
  const [bond, setBond] = useState({ bond: freeToBond });

  // bond valid
  const [bondValid, setBondValid]: any = useState(false);

  // update bond value on task change
  useEffect(() => {
    const _bond = freeToBond;
    setBond({ bond: _bond });
  }, [freeToBond]);

  // modal resize on form update
  useEffect(() => {
    setResize();
  }, [bond]);

  // tx to submit
  const tx = () => {
    let _tx = null;
    if (!bondValid || !api || !activeAccount) {
      return _tx;
    }

    // remove decimal errors
    const bondToSubmit = unitToPlanckBn(bond.bond, units);

    // determine _tx
    if (isPooling) {
      _tx = api.tx.nominationPools.bondExtra({ FreeBalance: bondToSubmit });
    } else if (isStaking) {
      _tx = api.tx.staking.bondExtra(bondToSubmit);
    }
    return _tx;
  };

  const { submitTx, estimatedFee, submitting }: any = useSubmitExtrinsic({
    tx: tx(),
    from: activeAccount,
    shouldSubmit: bondValid,
    callbackSubmit: () => {
      setModalStatus(0);
    },
    callbackInBlock: () => {},
  });

  const TxFee = (
    <p>Estimated Tx Fee: {estimatedFee === null ? '...' : `${estimatedFee}`}</p>
  );
  return (
    <>
      <div className="items">
        <>
          <BondInputWithFeedback
            target={target}
            unbond={false}
            listenIsValid={setBondValid}
            defaultBond={freeToBond}
            setters={[
              {
                set: setBond,
                current: bond,
              },
            ]}
          />
          <NotesWrapper>{TxFee}</NotesWrapper>
        </>
      </div>
      <FormFooter
        setSection={setSection}
        submitTx={submitTx}
        submitting={submitting}
        isValid={bondValid}
      />
    </>
  );
};