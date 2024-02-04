import axios from 'axios';
import { showAlert } from './alerts';

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
      showAlert('success', 'You successfully logged in', 2.5);
      window.setTimeout(() => {
        location.assign('/');
      }, 3000);
    }
  } catch (err) {
    showAlert('error', err.message, 10);
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
