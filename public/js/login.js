import axios from 'axios';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      console.log('success');
      window.setTimeout(() => {
        location.assign('/');
      }, 5000);
    }
  } catch (err) {
    console.log(`fail ----- ${err}`);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'api/v1/users/logout',
    });
    if (res.data.status === 'success') location.reload(true);
  } catch {}
};
