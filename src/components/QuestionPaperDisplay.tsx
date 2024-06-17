import React from 'react';
import { ImagePreview } from '../ExamModel';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface QuestionPaperDisplayProps {
    QuestionPapers: ImagePreview[];
}

const QuestionPaperDisplay: React.FC<QuestionPaperDisplayProps> = ({ QuestionPapers }) => {
    console.log(QuestionPapers);

    return (
        <div className='flex flex-col w-full space-y-5 h-50'>
            {QuestionPapers.map((obj: ImagePreview, index) => (
                <Zoom key={index}>
                    <img src={obj.preview} alt="question image" className='w-full' />
                </Zoom>
            ))}
        </div>
    );
}

export default QuestionPaperDisplay;
