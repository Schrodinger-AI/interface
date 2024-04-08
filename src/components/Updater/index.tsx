'use client';
import { useInitData } from 'hooks/useInitData';
import { useRedirect } from 'hooks/useRedirect';
import { useIsAddressValidProbability } from 'hooks/useIsAddressValidProbability';

const Updater = () => {
  useInitData();
  useRedirect();
  useIsAddressValidProbability();
  return null;
};

export default Updater;
