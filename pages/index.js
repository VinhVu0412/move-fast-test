import React from 'react';

import Box from '../components/Box';
import styles from './index.module.css'

function shuffleArray(array) {
  // Fisher–Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = newArray[i];
      newArray[i] = newArray[j];
      newArray[j] = temp;
  }
  return newArray;
}

const COLORS = ['#2572D0', '#C72E49', '#76684D', '#9B4F50', '#5E00B6', '#1EA18E', '#1C6755', '#523AF3', '#3B4959'];

const Home = () => {
  const [colors, setColors] = React.useState(COLORS);

  const shuffleColors = React.useCallback(() => {
    setColors(shuffleArray);
  }, [setColors]);

  const boxes = React.useMemo(() => {
  return colors.map((color, idx) => <Box key={idx} color={color} onClick={shuffleColors}>{idx + 1}</Box>);
  }, [colors, shuffleColors])

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <div className={styles.topHalf}>
          {boxes[0]}
          <div className={styles.layout234}>
            {boxes[1]}
            <div className={styles.layout34}>
              {boxes[2]}
              {boxes[3]}
            </div>
          </div>
        </div>
        <div className={styles.bottomHalf}>
          {
            boxes[6] // display on on desktop
          } 
          <div className={styles.layout5689}>
            <div className={styles.layout56}>
              {boxes[4]}
              {boxes[5]}
            </div>
            {
              boxes[6] // display on on mobile
            }
            <div className={styles.layout89}>
              {boxes[7]}
              {boxes[8]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
