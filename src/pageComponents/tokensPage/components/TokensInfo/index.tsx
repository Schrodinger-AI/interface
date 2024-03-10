import clsx from 'clsx';
import { Flex } from 'antd';
import { Ellipsis } from 'antd-mobile';
import SkeletonImage from 'components/SkeletonImage';
import { ReactComponent as ArrowSVG } from 'assets/img/arrow.svg';
import useResponsive from 'hooks/useResponsive';
import styles from './styles.module.css';

function EllipsisController({ isCollapseController = false }: { isCollapseController?: boolean }) {
  return (
    <Flex className="inline-flex ml-1 text-brandDefault" gap={4} align="center">
      <span className="font-medium">Show {isCollapseController ? 'Less' : 'More'}</span>
      <ArrowSVG className={clsx('size-3', { ['common-revert-180']: isCollapseController })} />
    </Flex>
  );
}

function Description() {
  return (
    <Ellipsis
      className={styles.description}
      rows={2}
      direction="end"
      expandText={<EllipsisController />}
      collapseText={<EllipsisController isCollapseController />}
      content="Shows the project information… Wrapped Punks are ERC721 Tokens, each one backed 1:1 byan original Cryptopunk
  by Larvalabs. Buy an original Cryptopunk at https://larvalabs.com/cryptopuinks
  https://larvalabs.com/cryptopuinks https://larvalabs.com/cryptopuinksWrapped Punks are ERC721 Tokens, each one
  backed 1:1 byan original Cryptopunk by Larvalabs. Buy an original Cryptopunk at https://larvalabs.com/cryptopuinks
  https://larvalabs.com/cryptopuinks https://larvalabs.com/cryptopuinksWrapped Punks are ERC721 Tokens, each one
  backed 1:1 byan original Cryptopunk by Larvalabs. Buy an original Cryptopunk at https://larvalabs.com/cryptopuinks
  https://larvalabs.com/cryptopuinks https://larvalabs.com/cryptopuinksWrapped Punks are ERC721 Tokens, each one
  backed 1:1 byan original Cryptopunk by Larvalabs."
    />
  );
}

export default function TokensInfo() {
  const { isLG } = useResponsive();
  return (
    <Flex className={styles.tokensInfo} vertical gap={12}>
      <Flex gap={16}>
        <SkeletonImage className={styles.schrodingerImg} img={require('assets/img/schrodinger.png').default.src} />
        <Flex vertical justify={isLG ? 'center' : 'flex-start'}>
          <span className={styles.title}>Schrödinger</span>
          {!isLG && <Description />}
        </Flex>
      </Flex>
      {isLG && <Description />}
    </Flex>
  );
}
