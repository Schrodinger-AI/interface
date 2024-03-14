export enum RouterItemType {
  OUT = 'out',
  INNER = 'inner',
  MODAL = 'modal',
}

export interface ICompassProps {
  title?: string;
  schema?: string;
  type?: RouterItemType; // default is inner
  items?: Array<ICompassProps>;
}
