import axios from 'axios';

export const addToCart = async (productName, quantity = 1) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/',
      data: {
        productName,
        quantity,
      },
    });

    if (res.data.status === 'success') {
      console.log('added to cart');
    }
  } catch (err) {
    console.log(`error-----------------${err}`);
  }
};
