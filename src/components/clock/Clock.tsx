import { FC, ReactNode, useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
import { QuizReducerEvents } from '../../reducers/quiz.reducer';

type ClockProps = {
  children?: ReactNode;
  event: QuizReducerEvents;
  counterTime: number;
  onEnd?: () => void;
  onTimeOut?: () => void;
}

export const Clock: FC<ClockProps> = ({ counterTime, onEnd, onTimeOut, event }) => {
  const [time, setTime] = useState<number>(counterTime)
  const [tick, setTick] = useState(false);
  const timer = useRef<{ timer: any; timeout: any }>({ timer: undefined, timeout: undefined });

  useEffect(() => {
    clearInterval(timer.current.timer);
    clearTimeout(timer.current.timeout);

    if (event === 'start' || event === 'next') {
      timer.current.timer = undefined;
      setTime(counterTime);
      timer.current.timeout = setTimeout(() => {
        setTick((pre) => !pre);
      }, 20);
    } else if (event === 'correct' || event === 'wrong') {
      // clearInterval(timer.current.timer);
      // clearTimeout(timer.current.timeout);
      setTick((pre) => !pre);
      timer.current.timer = null;
    } else if (event === 'end') {
      // clearInterval(timer.current.timer);
      setTick((pre) => !pre);
      timer.current.timer = undefined;
      onEnd?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, counterTime]);

  useEffect(() => {
    if (timer.current.timer === undefined && event !== 'end') {
      timer.current.timer = setInterval(() => setTime((pre) => pre - 1), 1000);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearInterval(timer.current.timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  useEffect(() => {
    if (time <= -1) {
      clearInterval(timer.current.timer);
      timer.current.timer = undefined; 
      setTime(0);
      onTimeOut?.();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    const timerObj = timer.current;

    return () => {
      clearInterval(timerObj.timer);
      clearTimeout(timerObj.timeout);
      
    }
  }, [])

  console.log('render Clock')

  return (
    <div className={`${styles["clock-container"]} másik`}>
      <div className={styles["clock-face"]}>
        <div className={`quarter ${styles["clock-quarter"]} ${styles["first-quarter"]}`} style={rotatingAnimation(counterTime / 4, 0, timer.current.timer)}></div>
        <div className={`quarter ${styles["clock-quarter"]} ${styles["second-quarter"]}`} style={rotatingAnimation(counterTime / 4, counterTime / 4, timer.current.timer)}></div>
        <div className={`quarter ${styles["clock-quarter"]} ${styles["third-quarter"]}`} style={rotatingAnimation(counterTime / 4, counterTime / 2, timer.current.timer)}></div>
        <div className={`quarter ${styles["clock-quarter"]} ${styles["forth-quarter"]}`} style={rotatingAnimation(counterTime / 4, counterTime * 3 / 4, timer.current.timer)}></div>
        <div className={`slidequarter ${styles["clock-quarter"]} ${styles["secret-quarter"]}`} style={slideAnimation(2, counterTime / 2, timer.current.timer)}></div>
      </div>
      {event === 'init' ? '' : time + ' s'}
    </div>
  );
}

const rotatingAnimation = (time: number, delay: number, timer?: any) => {
  if (timer === undefined) {
    return {};
  }

  return {
    animationName: 'tick-tack',
    animationDuration: `${time}s`,
    animationDelay: `${delay}s`,
    animationDirection: '',
    animationIterationCount: 1,
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    animationPlayState: timer === null ? 'paused' : 'running'
  }
}

const slideAnimation = (time: number, delay: number, timer?: any) => {
  if (timer === undefined) {
    return {};
  }

  return {
    animationName: 'slide-to-hide',
    animationDuration: `${time}s`,
    animationDelay: `${delay}s`,
    animationDirection: '',
    animationIterationCount: 1,
    animationTimingFunction: 'linear',
    animationFillMode: 'both',
    animationPlayState: timer === null ? 'paused' : 'running'
  }
}