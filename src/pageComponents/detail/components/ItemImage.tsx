import { ISGRDetailRes } from '../types';
import Image from 'next/image';

export default function ItemImage({ detail }: { detail: ISGRDetailRes }) {
  return (
    <div className="relative aspect-square w-full lg:w-[660px] flex items-center justify-center mt-[16px] lg:mt-[0px] rounded-2xl	border-solid border border-[#E1E1E1] bg-[#F5FEF7CC]">
      <Image src={require('assets/img/website-logo.svg').default} alt="logo" width={187} height={314} />
      <div className="absolute top-[12px] left-[12px] bg-[#00000099] text-white px-[6px] py-[2px] text-xs font-medium rounded-lg">
        GEN {detail.generation}
      </div>
    </div>
  );
}
