import React from 'react'
import { ImagePreview } from '../ExamModel';

interface QuestionPaperDisplayProps{
    QuestionPapers:ImagePreview[];
}

const QuestionPaperDisplay:React.FC<QuestionPaperDisplayProps> = ({QuestionPapers}) => {
    console.log(QuestionPapers);
    
  return (
    <div className='flex flex-col w-full space-y-5 '>
      {QuestionPapers.map((obj:ImagePreview,index)=>(
        <img src={obj.preview} alt="question image" key={index} className='w-full'/>
      ))}
    </div>
  )
}

export default QuestionPaperDisplay
