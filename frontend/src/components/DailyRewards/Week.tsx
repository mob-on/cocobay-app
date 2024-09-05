import Card from "../shared/Card";
import styles from "src/styles/components/dailyRewards/week.module.scss";

const Week: React.FC<{ week: number; isActive: boolean }> = ({ week, isActive }) => {
    return (
      <Card className={styles.week} disabled={!isActive} key={week}>
        <>
          <p>Week</p>
          <h2>{week}</h2>
        </>
      </Card>
    );
  };

  export default Week;