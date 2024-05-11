import React from 'react';
import { ReactComponent as ArchiveSVG } from 'assets/img/archive.svg';

interface ITableEmpty {
  title?: string;
  description?: string;
}

function TableEmpty({ description, title }: ITableEmpty) {
  return (
    <div className="flex justify-center items-center flex-col p-[60px]">
      <ArchiveSVG className="w-[56px] mb-[16px]" />
      {title && <span className="text-base text-neutralPrimary mb-[4px]">{title}</span>}
      {description && <span className="text-base text-neutralSecondary">{description}</span>}
    </div>
  );
}

export default React.memo(TableEmpty);
