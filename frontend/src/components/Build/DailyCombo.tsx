import styles from 'src/styles/components/build/dailyCombo.module.scss';
import hero from 'public/media/coco/coco-pink-swag.svg';
import Image from 'next/image';

const SingleCombo: React.FC<{src: string}> = ({ src }) => {
  return (
    <div className={styles.singleCombo}>
      <Image className={styles.singleComboImage} src={src} alt="hero" width={96} height={96} />
    </div>
  )
}

const DailyCombo: React.FC<{onClick: () => void}> = ({ onClick }) => {
  return (
    <div className={styles.dailyCombo}>
      <h3>Daily Combo</h3>
      <div className={styles.combos} onClick={onClick}>
        <Image className={styles.hero} src={hero} alt="hero" width={96} height={96} />
        <SingleCombo src={hero} />
        <SingleCombo src={hero} />
        <SingleCombo src={hero} />
      </div>
    </div>
  )
};

export default DailyCombo;
