import mockData from '../mock.json';
import Image from 'next/image';

export default function ItemImage() {
  return (
    <div className="relative h-[660px] w-[660px] flex items-center justify-center">
      <Image src={require('assets/img/website-logo.svg').default} alt="logo" width={187} height={314} />
      <div className="absolute top-[12px] left-[12px] bg-[#00000099] text-white px-[6px] py-[2px] text-xs font-medium rounded-lg">
        GEN {mockData.generation}
      </div>
    </div>
  );
}
