import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import WriteExamScreen from './WriteExamScreen';
import ResultsScreen from './ResultsScreen';
import UploadAnsScreen from './UploadAnsScreen';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/write_exam' element={<WriteExamScreen/>}/>
          <Route path='/results' element={<ResultsScreen/>}/>
          <Route path='/upload_answers_screen' element={<UploadAnsScreen/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
