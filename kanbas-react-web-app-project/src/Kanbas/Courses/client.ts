import axios from "axios";
const API_BASE = process.env.REACT_APP_API_BASE;
export const fetchAllCourses = async () => { 
    const response = await axios.get(`${API_BASE}/api/courses`);
    return response.data;
};

export const fetchCourseById = async (id: string) => {
    const response = await axios.get(`${API_BASE}/api/courses/${id}`);
    return response.data;
}

export const createCourse = async (course: any) => {
    const response = await axios.post(`${API_BASE}/api/courses`, course);
    return response.data;
};

export const deleteCourse = async (id: string) => {
    const response = await axios.delete(`${API_BASE}/api/courses/${id}`);
    return response.data;
};

export const updateCourse = async (course: any, id: string) => {
    const response = await axios.put(`${API_BASE}/api/courses/${id}`, course);     
    return response.data;
} 