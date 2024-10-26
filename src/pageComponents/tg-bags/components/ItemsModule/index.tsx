/* eslint-disable @next/next/no-img-element */
import { Flex, List } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import { useModal } from '@ebay/nice-modal-react';
import ItemModal from '../ItemModal';

type Item = {
  src: string;
  amount: number;
};
type Props = {
  data: Item[];
  onFinished: () => void;
};

function ItemsModule({ data, onFinished }: Props) {
  const noticeModal = useModal(ItemModal);

  const onConfirm = () => {
    noticeModal.hide();
    onFinished();
  };

  return (
    <List
      grid={{
        gutter: 15,
        xs: 2,
        sm: 2,
        md: 2,
      }}
      dataSource={data || []}
      renderItem={(item) => (
        <List.Item>
          <Flex
            className="rounded-[8px] overflow-hidden cursor-pointer"
            onClick={() => item.amount > 0 && noticeModal.show({ amount: item.amount, onConfirm, onClose: onConfirm })}
            vertical>
            <SkeletonImage
              img={item.src}
              imageSizeType="contain"
              className="!rounded-none"
              imageClassName="!rounded-none"
            />
            <Flex
              align="center"
              justify="space-between"
              className="p-[12px] bg-pixelsDashPurple text-white shadow-tickShadow">
              <span className="dark-btn-font text-[14px] leading-[22px] font-black">S-CAT Voucher</span>
              <span className="font-black text-[12px] leading-[20px] text-pixelsWhiteBg">x{item.amount}</span>
            </Flex>
          </Flex>
        </List.Item>
      )}
    />
  );
}

export default ItemsModule;
