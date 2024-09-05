import Card from "../shared/Card";
import styles from "src/styles/components/dailyRewards/week.module.scss";

const Week: React.FC<{
  week: number;
  isActive: boolean;
  isFinished: boolean;
}> = ({ week, isActive, isFinished }) => {
  return (
    <Card
      className={styles.week + " " + (isActive ? styles.active : "")}
      disabled={!isFinished}
      key={week}
    >
      <>
        <p>Week</p>
        <h2>{week}</h2>
      </>
    </Card>
  );
};

export default Week;
