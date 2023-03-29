import './App.css';
import { RouteController } from './pages/RouteController';
import { Header } from './pages/Header';
import { QuizProvider } from './providers/quiz.provider';

function App() {
  return (
    <>
      <QuizProvider>
        <div className="App">
          <Header />
          <RouteController />
        </div>
      </QuizProvider>
      <div id="snackbar"></div>
    </>
  );
}

export default App;
