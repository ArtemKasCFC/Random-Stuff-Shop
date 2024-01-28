import axios from 'axios';

export const changeQuantity = async (productName, quantity) => {
  try {
    const res = await axios({ method: 'PATCH', url: '/cart', data: { productName, quantity } });
    if (res.data.status === 'success') console.log(res.data.status);
  } catch (err) {
    console.log(`error---------------------${err}`);
  }
};

export const checkOut = async () => {
  try {
    const res = await axios({ method: 'POST', url: '/cart' });
    if (res.data.status === 'success') console.log(res.data.status);
  } catch (err) {
    console.log(`error---------------------------${err}`);
  }
};
