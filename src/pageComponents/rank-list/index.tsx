import { getRankList } from 'api/request';
import { useCallback, useMemo, useState } from 'react';
import { useEffectOnce } from 'react-use';
import useLoading from 'hooks/useLoading';
import { IRankList } from 'redux/types/reducerTypes';
import { addPrefixSuffix } from 'utils/addressFormatting';
import { Table } from 'aelf-design';
import TableEmpty from 'components/TableEmpty';
import { TableColumnsType } from 'antd';
import RulesList from './components/RulesList';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import { useRouter } from 'next/navigation';
import { useCmsInfo } from 'redux/hooks';
import { formatTokenPrice } from 'utils/format';

export default function PointsPage() {
  const { showLoading, closeLoading, visible } = useLoading();

  const [list, setList] = useState<IRankList[]>([]);
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string[]>();
  const [rulesTitle, setRulesTitle] = useState<string>();
  const [rulesList, setRulesList] = useState<string[]>();
  const router = useRouter();

  const rankList = useCallback(async () => {
    showLoading();
    const { data } = await getRankList();
    closeLoading();
    setList(data.lp.list);
    setDescription(data.lp.description);
    setTitle(data.lp.title);
    setRulesTitle(data.lp.rules?.title);
    setRulesList(data.lp.rules?.rulesList);
  }, [closeLoading, showLoading]);
  const cmsInfo = useCmsInfo();

  const renderCell = (value: string) => {
    return <span className="text-neutralTitle font-medium">{value}</span>;
  };

  const columns: TableColumnsType<IRankList> = useMemo(() => {
    return [
      {
        title: 'Top 40',
        dataIndex: 'index',
        key: 'index',
        render: (_, _record, index) => {
          return renderCell(`${index + 1}`);
        },
      },
      {
        title: 'address',
        dataIndex: 'address',
        key: 'address',
        render: (address) => {
          return renderCell(addPrefixSuffix(address));
        },
      },
      {
        title: 'scores',
        dataIndex: 'scores',
        key: 'scores',
        render: (scores) => {
          return renderCell(formatTokenPrice(scores));
        },
      },
    ];
  }, []);

  useEffectOnce(() => {
    rankList();
  });

  if (visible) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-[1360px]">
        <h1 className="pt-[24px] flex items-center pb-[8px] font-semibold text-2xl">
          <ArrowSVG
            className="w-[24px] mr-[8px] rotate-90  cursor-pointer"
            onClick={() => {
              router.back();
            }}
          />
          {cmsInfo?.rankListEntrance?.title}
        </h1>
        {rulesTitle || rulesList?.length ? (
          <div className="flex flex-col mt-[24px]">
            {rulesTitle ? <span className="text-xl font-semibold">{rulesTitle}</span> : null}
            <RulesList />
          </div>
        ) : null}

        <div className="mt-[32px]">
          <div className="flex flex-col mt-[24px] mb-[24px]">
            {title ? <span className="text-xl font-semibold">{title}</span> : null}
            {description?.length ? (
              <span className="flex flex-col">
                {description.map((item, index) => {
                  return (
                    <span key={index} className="text-base font-medium text-neutralSecondary mt-[8px]">
                      {item}
                    </span>
                  );
                })}
              </span>
            ) : null}
          </div>
          <Table
            dataSource={list}
            columns={columns}
            loading={visible}
            pagination={null}
            locale={{
              emptyText: <TableEmpty description="No data yet." />,
            }}
            scroll={{
              x: 'max-content',
            }}
          />
        </div>
      </div>
    </div>
  );
}
