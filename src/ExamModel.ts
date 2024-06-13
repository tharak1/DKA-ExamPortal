interface options{
    value?:string;
    image?:string;
}

interface ImagePreview {
    file?: File;
    preview?: string;
  }

interface Questions{
    questionFormat?:string;
    questionType: string;
    question: string;
    options: options[];
    correctAnswer: number[];
    points: number;
    visited?: boolean;
    answered?: boolean;
    optionsSelected?: number[];
}

interface QuestionPaper{
    uploaded?:boolean;
    editing?:boolean;
    id?:string, 
    examType?:string;
    uploadedPdfURL?:string,
    course:string,
    for:string,
    startDate:string,
    startTime:string,
    endDate:string,
    endTime:string,
    duration:string,
    totalMarks:number,
    questions : Questions[];
    questionsImages? : ImagePreview[];
    noOfQuestions?:number
}

export type {options,QuestionPaper,Questions,ImagePreview}