declare module '@lucky-canvas/react' {
  export interface ILuckyWheelPrizes {
    background: string;
    imgs: {
      src: string;
      width: string;
      top: string;
    }[];
    name: string;
  }

  export interface ILuckyWheelProps {
    width?: string | number;
    height?: string | number;
    prizes: ILuckyWheelPrizes[];
    [key: string]: any;
  }

  export const LuckyWheel: React.FC<ILuckyWheelProps>;
}
