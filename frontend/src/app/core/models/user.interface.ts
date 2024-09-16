export interface UserStudent {
  id: number;
  rut: string;
  name: string;
  type: string;
  mail?: string;
  phoneNumber?: number;
  student: Student;
}

export interface UserAssitant {
  id: number;
  rut: string;
  name: string;
  type: string;
  mail?: string;
  phoneNumber?: number;
  assitant: Assistant;
}

export interface UserTeacher {
  id: number;
  rut: string;
  name: string;
  type: string;
  mail?: string;
  phoneNumber?: number;
  teacher: Teacher;
}

export interface UserRegister {
  rut: string;
  name: string;
  type: string;
  mail?: string;
  phoneNumber?: number;
  degree?: string;
  role?: string;
}

export interface Student {
  id: number;
  codeDegree: string;
}

export interface Assistant {
  id: number;
  role: string;
}

export interface Teacher {
  id: number;
}
