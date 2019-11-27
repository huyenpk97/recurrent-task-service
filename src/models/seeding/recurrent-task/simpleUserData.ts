import fetch from 'node-fetch';
import CONFIG from '../../../constants/config';

const fetchUserData = async () => {
  try {
    const response = await fetch(CONFIG.API_URL.GET_USERS);
    const json = await response.json();
    const simpleUsersData = json.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email
    }));
    return simpleUsersData;
  } catch (err) {
    const simpleUsersData = [
      {
        id: 1,
        name: 'Mai Gia Bao Anh',
        email: 'baoanh@default.com'
      },
      {
        id: 2,
        name: 'Ta Quoc Huy',
        email: 'quochuy@default.com'
      },
      {
        id: 3,
        name: 'Phi Khanh Huyen',
        email: 'khanhhuyen@default.com'
      },
      {
        id: 4,
        name: 'Nguyen Thi Hoai',
        email: 'hoainguyen@default.com'
      },
      {
        id: 5,
        name: 'Nguyen Van Tin',
        email: 'tinvan@default.com'
      }
    ];
    return simpleUsersData;
  }
};

export default fetchUserData;
