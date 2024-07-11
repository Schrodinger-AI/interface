export enum RouterItemType {
  Out = 'out',
  Inner = 'link',
  MarketModal = 'marketModal',
  EventList = 'eventList',
  ExternalLink = 'externalLink',
}

export interface ICompassProps {
  show?: boolean;
  title?: string;
  schema?: string;
  schemaAfterLogin?: string;
  type?: RouterItemType; // default is inner
  icon?: string;
  items?: Array<ICompassProps>;
}
