import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from './components/Timer';
import QuestionDisplay from './components/QuestionDisplay';
import LoadingScreen from './components/LoadingScreen';
import Modal from './components/Modal';
import { QuestionPaper, Questions } from './ExamModel';
import QuestionPaperDisplay from './components/QuestionPaperDisplay';
import { IoArrowForward } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase_config';
import { UserModel } from './UserModel';
import AnotherModal from './components/AnotherModal';

const WriteExamScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [finalObj, setFinalObj] = useState<QuestionPaper | null>(null);
  const [notVisited, setNotVisited] = useState<number>(0);
  const [notAnswered, setNotAnswered] = useState<number>(0);
  const [processedQuestions, setProcessedQuestions] = useState<Questions[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answered, setAnswered] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);
  const [user,setUser] = useState<UserModel>();
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    getQP();
  }, [location.search]);

  const getQP = async() =>{
    const queryParams = new URLSearchParams(location.search);  
    const encodedUserData = queryParams.get('user');
    const decodedUserData = decodeURIComponent(encodedUserData!);
    const userDataObject = JSON.parse(decodedUserData) as UserModel;
    setUser(userDataObject);

    const id = queryParams.get('id');
    const x = await getDoc(doc(db,"Question-Paper",id!));
    setFinalObj(x.data() as QuestionPaper);
  }


  useEffect(() => {
    if (finalObj) {
      preProcessing();
    }
  }, [finalObj]);

  const preProcessing = () => {
    const newQuestions: Questions[] = finalObj!.questions.map((question: Questions) => ({
      ...question,
      visited: false,
      answered: false,
      optionsSelected: [],
    }));

    if (newQuestions.length > 0) {
      newQuestions[0].visited = true;
    }

    setProcessedQuestions(newQuestions);
    setNotVisited(newQuestions.length - 1);
    setNotAnswered(newQuestions.length);
    setLoading(false);
  };

  const handleNextQuestion = () => {
    if (questionIndex < processedQuestions.length - 1) {
      updateVisitStatus(questionIndex + 1);
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      updateVisitStatus(questionIndex - 1);
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleOntapSideBar = (index: number) => {
    updateVisitStatus(index);
    setQuestionIndex(index);
  };

  const handleSaveAndNextQuestion = () => {
    const isAnswered = (processedQuestions![questionIndex]!.optionsSelected!.length)>0 ?true:false;

    const updatedQuestions = [...processedQuestions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      visited: true,
      answered: isAnswered,
      optionsSelected: isAnswered ? processedQuestions[questionIndex].optionsSelected : [],
    };

    setProcessedQuestions(updatedQuestions);
    setAnswered(answered<processedQuestions.length?answered + (isAnswered ? 1 : 0):answered);
    setNotAnswered(answered<processedQuestions.length?notAnswered - (isAnswered ? 1 : 0):notAnswered );
    handleNextQuestion();
  };

  const updateVisitStatus = (index: number) => {
    if (!processedQuestions[index].visited) {
      const updatedQuestions = [...processedQuestions];
      updatedQuestions[index].visited = true;
      setProcessedQuestions(updatedQuestions);
      setNotVisited(notVisited - 1);
    }
  };

  const handleTimerFinish = () => {
    if(finalObj?.examType==='upload question Paper'){
      navigate('/upload_answers_screen', { state: {QpId:finalObj?.id,User: user}, replace: true })
    }else{
      navigate('/results', { state: { answers: processedQuestions,QpId:finalObj?.id,User: user}, replace: true });
    }
  }

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <div className="grid grid-cols-4 grid-rows-8 h-screen">
          {/* Navbar */}
          <div className="col-span-4 row-span-1 max-sm:row-span-1 max-sm:flex-col bg-slate-50 shadow-md shadow-slate-200 z-10 flex items-center justify-between p-4">
            <h1 className='max-sm:hidden'>{finalObj?.course}</h1>
            <div className="flex justify-around items-center"> 
              <h1 className="m-5">Duration: {finalObj?.duration} min</h1>
              <div className="mr-5">
              <Timer duration={parseInt(finalObj?.duration || '0') * 60}  onTimerFinish={handleTimerFinish}/>
              </div>
              <div className="flex flex-col items-end mr-3 max-sm:text-right">
                <h1>{user?.name}</h1>
                <p>id: {user?.id}</p>
              </div>
              {
              finalObj?.examType==='upload question Paper' &&(

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={openModal}>
                  Submit
                </button>
              
              )
            }
              <div className='flex justify-center items-center'>
                
              </div>
            </div>

          </div>
          {/* Navbar */}


          {
            finalObj?.examType==='upload question Paper' ?(
              <>
              <div className="p-8 w-full col-span-4 row-start-2 row-span-7 overflow-auto bg-white">
                <QuestionPaperDisplay QuestionPapers={finalObj.questionsImages!}/>
              </div>
              </>
            ):(
              <>
                    {/* Question Display */}
                    <div className="p-8 w-full col-span-3 max-sm:col-span-4 row-start-2 row-span-6  overflow-auto bg-white">
                      {processedQuestions.length > 0 && (
                        <QuestionDisplay question={processedQuestions[questionIndex]} questionIndex={questionIndex} key={questionIndex} />
                      )}
                    </div>
                    {/* Question Display */}

                    {/* Bottom Navigation */}
                    <div className="col-span-3 max-sm:col-span-4 row-span-1 row-start-8  bg-slate-100 flex justify-between p-6 items-center">
                      <div className='flex'>
                        <button
                          onClick={handlePrevQuestion}
                          className=" flex items-center bg-slate-50 hover:bg-indigo-500 text-black font-bold py-2 px-4 rounded-l-lg border-t-2 border-b-2 border-l-2 border-indigo-500"
                        >
                          < IoArrowBack /> Prev
                        </button>
                        <button
                          onClick={handleNextQuestion}
                          className="flex items-center bg-slate-50 hover:bg-indigo-500 text-black font-bold py-2 px-4 rounded-r-lg border-t-2 border-b-2 border-r-2 border-indigo-500"
                        >
                          Next < IoArrowForward/>
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={handleSaveAndNextQuestion}
                        >
                          Save & Next
                        </button>
                      </div>
                    </div>
                    {/* Bottom Navigation */}

                    {/* Side Navigation */}
                    <div className="col-span-1 row-span-6 bg-slate-50 row-start-2 row-end-8 overflow-auto p-6 max-sm:hidden">
                      <label className="block mb-4 text-sm font-medium text-gray-900">Questions Status</label>
                      <div className="grid grid-cols-2 grid-rows-2 gap-y-4">
                        <div>
                          <div className="flex justify-center items-center h-7 w-7 bg-gray-200 rounded-md">{notVisited}</div>
                          <p>Not visited</p>
                        </div>
                        <div>
                          <div className="flex justify-center items-center h-7 w-7 rounded-md bg-red-400">{notAnswered}</div>
                          <p>Not Answered</p>
                        </div>
                        <div>
                          <div className="flex justify-center items-center h-7 w-7 rounded-md bg-green-400">{answered}</div>
                          <p>Answered</p>
                        </div>
                      </div>
                      <label className="block mt-6 mb-4 text-sm font-medium text-gray-900">Choose A Question</label>
                      <div className="grid grid-cols-7 grid-rows-auto">
                        {processedQuestions.map((_question, index) => (
                          <div
                            key={index}
                            className={`flex justify-center items-center h-8 w-8 ${_question.answered ? "bg-green-300": _question.visited ? "bg-red-400" : "bg-gray-200"} rounded-md cursor-pointer`}
                            onClick={() => {
                              handleOntapSideBar(index);
                            }}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Side Navigation */}

                    {/* Submit Button */}
                    <div className="bg-slate-50 col-span-1 row-span-1 row-start-8 flex justify-center items-center w-full max-sm:hidden">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={openModal}>
                        Submit
                      </button>
                    </div>
                    {/* Submit Button */}
              </>
            )
          }
          {
            finalObj?.examType==='upload question Paper' ?(
              <AnotherModal isOpen={modal} onClose={closeModal} user={user!} QpId={finalObj?.id!} courseName = {finalObj?.course}/>
            ):
            (
              <Modal isOpen={modal} onClose={closeModal} totalQuestions={processedQuestions.length} answeredQuestions={answered} answers={processedQuestions} user={user!} QpId={finalObj?.id!}/>
            )
          }

        </div>
      )}
    </>
  );
};

export default WriteExamScreen;
