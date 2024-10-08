import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import { Questions } from './ExamModel';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase_config';
import { UserModel } from './UserModel';

interface ResultsScreenProps {
    answers: Questions[];
    QpId: string;
    User: UserModel;
}

const ResultsScreen: React.FC = () => {
    const location = useLocation();
    const { answers, QpId, User } = location.state as ResultsScreenProps;

    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [incorrectAnswers, setIncorrectAnswers] = useState<number>(0);
    const [unanswered, setUnanswered] = useState<number>(0);

    useEffect(() => {
        calculateMarks();
    }, [answers]);

    useEffect(() => {
        if (!loading) {
            setMarks();
        }
    }, [totalMarks, correctAnswers, incorrectAnswers, unanswered, loading]);

    const setMarks = async () => {
        const obj = {
            marksObtained: totalMarks,
            studentName: User.name,
            studentId: User.id,
            correctAnswers,
            incorrectAnswers,
            unanswered
        };

        await updateDoc(doc(db, "Online-exam-results", QpId),{students:arrayUnion(obj)});
    };

    const Homeonclick = () => {
        // window.location.replace("http://localhost:5173/exams");
        window.location.replace("https://dka-client.vercel.app/exams");
    }

    const calculateMarks = () => {
        setLoading(true);
        let marks = 0;
        let correct = 0;
        let incorrect = 0;
        let notAnswered = 0;

        answers.forEach(question => {
            if (question.answered && question.optionsSelected) {
                if (JSON.stringify(question.optionsSelected.sort()) === JSON.stringify(question.correctAnswer.sort())) {
                    marks += question.points;
                    correct += 1;
                } else {
                    incorrect += 1;
                }
            } else {
                notAnswered += 1;
            }
        });

        setTotalMarks(marks);
        setCorrectAnswers(correct);
        setIncorrectAnswers(incorrect);
        setUnanswered(notAnswered);
        setLoading(false);
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Results</h1>
            <div className="mb-4">
                <h2 className="text-xl">Total Marks: {totalMarks}</h2>
                <h2 className="text-xl">Correct Answers: {correctAnswers}</h2>
                <h2 className="text-xl">Incorrect Answers: {incorrectAnswers}</h2>
                <h2 className="text-xl">Unanswered Questions: {unanswered}</h2>
            </div>
            <div>
                {answers.map((question, index) => (
                    <div key={index} className="mb-6">
                        {question.questionFormat === 'image' ? (
                            <img src={question.question} alt="question" className="mb-2" />
                        ) : (
                            <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        )}
                        <div>
                            {question.options.map((option, idx) => (
                                <div key={idx} className="flex items-center mb-1">
                                    <input
                                        type="checkbox"
                                        checked={question.optionsSelected?.includes(idx)}
                                        readOnly
                                        className="mr-2"
                                    />
                                    {answers[index].questionType.includes("image") ? (
                                        <img src={option.image} alt="" />
                                    ) : (
                                        <label className="text-gray-700">{option.value}</label>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Correct Answer(s): {question.correctAnswer.map(ans => answers[index].questionType === "numerical" ? ans : ans + 1).join(', ')}
                            </p>
                        </div>
                        <div className="mt-2">
                            {answers[index].optionsSelected?.length === 0 ? (
                                <p>Unanswered</p>
                            ) : (
                                <p className={`text-sm ${JSON.stringify(question.optionsSelected?.sort()) === JSON.stringify(question.correctAnswer.sort()) ? 'text-green-500' : 'text-red-500'}`}>
                                    {JSON.stringify(question.optionsSelected?.sort()) === JSON.stringify(question.correctAnswer.sort()) ? 'Correct' : 'Incorrect'}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className='w-full flex justify-center items-center'>
                
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={Homeonclick}>Home</button>

            </div>
        </div>
    );
};

export default ResultsScreen;
