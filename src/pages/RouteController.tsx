import { FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './home/HomePage';
import styles from './styles.module.css';
import { QuestionPage } from './question/QuestionPage';
import { ProtectedRoute } from '../components/Protected-route';
import { NoPage } from './NoPage';
import { SelectionPage } from './selection/SelectionPage';
import { SummaryPage } from './summary/SummaryPage';
import config from './config';

export const RouteController: FC = () => {
  return (
    <div className={styles["route-container"]}>
      <Routes>
        <Route index path={config.base} element={<HomePage />}/>
        <Route path={config.route.question} element={<ProtectedRoute><QuestionPage /></ProtectedRoute>}/>
        <Route path={config.route.select} element={<ProtectedRoute><SelectionPage /></ProtectedRoute>}/>
        <Route path={config.route.summary} element={<ProtectedRoute><SummaryPage /></ProtectedRoute>}/>
        <Route path='*' element={<NoPage />}/>
      </Routes>
    </div>
  );
}