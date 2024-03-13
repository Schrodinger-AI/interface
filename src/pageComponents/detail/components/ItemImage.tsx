import { TSGRToken } from 'types/tokens';
import SkeletonImage from 'components/SkeletonImage';

export default function ItemImage({ detail }: { detail: TSGRToken }) {
  return (
    <div className="relative aspect-square w-full lg:mr-[16px] mr-0 lg:max-w-[660px] lg:min-w-[452] flex items-center justify-center mt-[16px] lg:mt-[0px] rounded-2xl	border-solid border border-[#E1E1E1] bg-[#F5FEF7CC]">
      <SkeletonImage img={require('assets/img/logo.png').default.src} width={187} height={314} />
      <div className="absolute top-[12px] left-[12px] bg-[#00000099] text-white px-[6px] py-[2px] text-xs font-medium rounded-lg">
        GEN {detail.generation}
      </div>
    </div>
  );
}
