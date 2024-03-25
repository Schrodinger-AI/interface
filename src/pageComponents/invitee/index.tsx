import { Button } from 'aelf-design';
import { Flex } from 'antd';
import AccountModal from './components/AccountModal';
import { useModal } from '@ebay/nice-modal-react';

export default function Invitee() {
  const modal = useModal(AccountModal);

  const onClick = () => {
    modal.show({
      title: 'Accept Invitation',
      content: 'Accept the invitation and join Schrödinger now to earn Flux Points for your interactions.',
      btnText: 'Accept',
      onOk: () => {
        console.log('ok');
      },
    });
  };

  return (
    <div>
      <Button type="primary" onClick={onClick}>
        Log in
      </Button>
    </div>
  );
}
