import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3001/api' });

export const searchStudents   = (q)   => API.get(`/students/search?q=${encodeURIComponent(q)}`);
export const getStudent       = (reg) => API.get(`/students/${reg}`);
export const getPersonal      = (reg) => API.get(`/students/${reg}/personal`);
export const getParents       = (reg) => API.get(`/students/${reg}/parents`);
export const getAcademic      = (reg) => API.get(`/students/${reg}/academic`);
export const getArrears       = (reg) => API.get(`/students/${reg}/arrears`);
export const getAchievements  = (reg) => API.get(`/students/${reg}/achievements`);
export const getProjects      = (reg) => API.get(`/students/${reg}/projects`);