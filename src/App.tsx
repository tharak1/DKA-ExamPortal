import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import WriteExamScreen from './WriteExamScreen';
import ResultsScreen from './ResultsScreen';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/write_exam' element={<WriteExamScreen/>}/>
          <Route path='/results' element={<ResultsScreen/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
