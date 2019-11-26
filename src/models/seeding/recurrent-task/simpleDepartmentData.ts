import fetch from 'node-fetch';
import { API_URL } from '../../../constants/common';

const fetchDepartmentData = async () => {
  try {
    const response = await fetch(API_URL.GET_DEPARTMENTS);
    const json = await response.json();
    const simpleDepartmentsData = json.map(department => ({
      id: department.id,
      name: department.organizationName
    }))
    return simpleDepartmentsData;
  } catch (err) {
    const simpleDepartmentsData = [
      {
        id: 1,
        name: 'Accounting'
      },
      {
        id: 2,
        name: 'Planning and Investment'
      },
      {
        id: 3,
        name: 'Technical'
      }
    ];
    return simpleDepartmentsData;
  }
}

export default fetchDepartmentData;
