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
      content="An AI-powered ACS-404 inscription allowing you to adopt cats and enjoy the fun of dynamic gameplay and unpredictable transformation. Evolving your cats to higher levels equips them with more randomly AI-generated traits. More traits, more rare, it's gacha-style fun!"
    />
  );
}

export default function TokensInfo() {
  const { isLG } = useResponsive();
  return (
    <Flex className={styles.tokensInfo} vertical gap={12}>
      <Flex gap={16}>
        <SkeletonImage className={styles.schrodingerImg} img={require('assets/img/schrodinger.jpeg').default.src} />
        <Flex vertical justify={isLG ? 'center' : 'flex-start'}>
          <span className={styles.title}>Schrödinger</span>
          {!isLG && <Description />}
        </Flex>
      </Flex>
      {isLG && <Description />}
    </Flex>
  );
}
