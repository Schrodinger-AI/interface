'use client';
import { useInitData } from 'hooks/useInitData';
import { useRedirect } from 'hooks/useRedirect';
import useNavigationGuard from 'provider/useNavigationGuard';

const Updater = () => {
  useInitData();
  useRedirect();
  useNavigationGuard();
  return null;
};

export default Updater;
