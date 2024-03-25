import React from 'react';

interface IListInfo {
  title: string;
  value: string;
}

interface IProps {
  items?: IListInfo[];
  className?: string;
}

function SGRInfoList({ items, className }: IProps) {
  return <div className={`${className}`}>SGRInfoList</div>;
}

export default React.memo(SGRInfoList);
