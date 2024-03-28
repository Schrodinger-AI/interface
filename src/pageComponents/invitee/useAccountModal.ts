import AccountModal from './components/AccountModal';
import { useRouter, useSearchParams } from 'next/navigation';
import { useModal } from '@ebay/nice-modal-react';
import { useCallback } from 'react';
import { AcceptReferral } from 'contract/schrodinger';
import useLoading from 'hooks/useLoading';
import { singleMessage } from '@portkey/did-ui-react';
import { IContractError } from 'types';

export default function useAccountModal() {
  const modal = useModal(AccountModal);
  const { showLoading, closeLoading } = useLoading();
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const newUser = useCallback(() => {
    modal.show({
      title: 'Accept Invitation',
      content: 'Accept the invitation and join Schrödinger now to earn Flux Points for your interactions.',
      btnText: 'Accept',
      onOk: async () => {
        try {
          const referrerAddress = urlSearchParams.get('referrer') || '';
          console.log('referrer', referrerAddress);
          showLoading();
          await AcceptReferral({
            referrer: referrerAddress,
          });
          closeLoading();
          modal.hide();
          router.push('/');
        } catch (error) {
          closeLoading();
          singleMessage.error((error as IContractError).errorMessage?.message);
        }
      },
    });
  }, [closeLoading, modal, router, showLoading, urlSearchParams]);

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
