import AccountModal from './components/AccountModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@ebay/nice-modal-react';
import { useCallback, useState } from 'react';
import { AcceptReferral } from 'contract/schrodinger';
import { useCheckJoined } from 'hooks/useJoin';

export default function useAccountModal() {
  const modal = useModal(AccountModal);
  const { toJoin } = useCheckJoined();
  // const { showLoading, closeLoading } = useLoading();
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const newUser = useCallback(() => {
    modal.show({
      title: 'Accept Invitation',
      content: 'Accept the invitation and join Schrödinger now to earn Flux Points for your interactions.',
      btnText: 'Accept',
      onOk: async () => {
        console.log('referrer', urlSearchParams.get('referrer'));
        const isJoined = await toJoin();
        if (isJoined) {
          await AcceptReferral({
            referrer: urlSearchParams.get('referrer') || '',
          });
          modal.hide();
          router.push('/');
        }
      },
    });
  }, [modal, router, toJoin, urlSearchParams]);

  const oldUser = useCallback(() => {
    modal.show({
      title: 'Explore Inscriptions',
      content:
        'Your account has already joined Schrödinger and is ineligible to accept additional invitations. Simply click the button below to explore the enchanting realm of AI-powered ACS-404 inscriptions.',
      btnText: 'View My Inscriptions',
      onOk: () => {
        modal.hide();
        router.push('/');
      },
    });
  }, [modal, router]);

  return { newUser, oldUser, modal };
}
