import BaseService from '@/common/baseService';
import { API_URL } from '@/config';

const source =`${API_URL}/admin/db`;

const dbName = () => BaseService.fetch(`${source}/dbname`);

const migrate = (model) => BaseService.post(`${source}/migrate`, model);

const importing = (model) => BaseService.post(`${source}/import`, model);

const exporting = (model) => BaseService.post(`${source}/export`, model);

const backup = (model) => BaseService.post(`${source}/backup`, model);

export default { dbName, migrate, importing, exporting, backup };