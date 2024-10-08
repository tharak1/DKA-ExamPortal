import React, { useState, useEffect } from 'react';
import { Questions } from '../ExamModel';

interface QuestionDisplayProps {
  questionIndex: number;
  question: Questions;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionIndex, question }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [numericAnswer, setNumericAnswer] = useState<string | null>(null);

  useEffect(() => {
    if (question.optionsSelected && question.optionsSelected.length > 0) {
      setSelectedOptions(question.optionsSelected);
      question.visited = true;
    }
    if (question.correctAnswer && question.correctAnswer.length > 0 && question.questionType === 'numerical') {
      setNumericAnswer(question.optionsSelected?.length!==0 ? question.optionsSelected![0].toString() : ""); 
    }
  }, [question]);

  const handleOptionChange = (index: number) => {
    if (question.questionType.includes('multi')) {
      const newSelectedOptions = selectedOptions.includes(index)
        ? selectedOptions.filter((i) => i !== index)
        : [...selectedOptions, index];
      setSelectedOptions(newSelectedOptions);
      question.optionsSelected = newSelectedOptions;
    } else {
      setSelectedOptions([index]);
      question.optionsSelected = [index];
    }

    question.answered = true;
  };

  const handleNumericChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumericAnswer(event.target.value);
    question.optionsSelected = [parseFloat(event.target.value)];
    question.answered = true;
  };

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold mr-3">{`Question ${questionIndex + 1}`}</h2>
          <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            {question.questionType}
          </span>
        </div>
        <span className="w-full border-t-2 mb-2"></span>
      </div>
      <div>
        {question.questionFormat === 'image' ? (
          <>
            <img src={question.question} alt="question" className="mb-2" />
            <h2 className="mb-3">Select the correct option below</h2>
          </>
        ) : (
          <p className="text-lg mb-4">{question.question}</p>
        )}

        {question.questionType === 'numerical' ? (
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-900">Your Answer:</label>
            <input
              type="number"
              value={numericAnswer || ''}
              onChange={handleNumericChange}
              className="form-input mt-1 block w-full rounded-md border-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
        ) : (
          <form className="space-y-3">
            {question.options.map((option, index) => (
              <div key={`option${questionIndex}${index}`}>
                <label className="flex items-center space-x-3">
                  <input
                    type={question.questionType.includes('multi') ? 'checkbox' : 'radio'}
                    name={`Question ${questionIndex + 1}`}
                    id={`option${questionIndex}${index}`}
                    value={question.questionType.includes('image') ? option.image : option.value}
                    className={question.questionType.includes('multi') ? 'form-checkbox h-4 w-4 text-blue-600' : 'form-radio h-4 w-4 text-blue-600'}
                    checked={selectedOptions.includes(index)}
                    onChange={() => handleOptionChange(index)}
                  />
                  {question.questionType.includes('image') ? (
                    <img src={option.image} alt="" />
                  ) : (
                    <span>{option.value}</span>
                  )}
                </label>
              </div>
            ))}
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;
