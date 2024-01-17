import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/data`;

const storeSubjectQuestions = (model) => BaseService.post(`${source}/subject-questions`, model);

const storeYearRecruits = (model) => BaseService.post(`${source}/year-recruits`, model);

const storeNoteCategories = (model) => BaseService.post(`${source}/note-categories`, model);

const storeTermNotes = (model) => BaseService.post(`${source}/term-notes`, model);

export default { storeSubjectQuestions, storeYearRecruits, storeNoteCategories, storeTermNotes };