import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import WriteExamScreen from './WriteExamScreen';

function App() {
  

  return (
    <>
      <Router>
        <Routes>
          <Route path='/write_exam' element={<WriteExamScreen/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
