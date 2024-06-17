import { MyCourseModal } from "./CourseModel";

interface UserModel{
    id:string;
    name: string;
    fatherName: string;
    motherName: string;
    dob: string;
    gender: string;
    address: string;
    contactNo: string;
    schoolName: string;
    class: string;
    hearAbout: string;
    password: string;
    imageUrl:string;
    registeredCourses:MyCourseModal[];
    email:string;
    country:string;
}

interface GuardianModel{
    GuardianId:string;
    registeredID:string[];
}

export type {UserModel,GuardianModel}