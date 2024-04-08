'use client';
import { useInitData } from 'hooks/useInitData';
import { useRedirect } from 'hooks/useRedirect';

const Updater = () => {
  useInitData();
  useRedirect();
  return null;
};

export default Updater;
