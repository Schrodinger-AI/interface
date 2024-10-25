/* eslint-disable @next/next/no-img-element */
import { Flex, List } from 'antd';
import SkeletonImage from 'components/SkeletonImage';
import { useModal } from '@ebay/nice-modal-react';
import ItemModal from '../ItemModal';

type Props = {
  data: [{ src: string; amount: number }];
};

function ItemsModule({ data }: Props) {
  const noticeModal = useModal(ItemModal);

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
            onClick={() => item.amount > 0 && noticeModal.show({ quantity: '1' })}
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
