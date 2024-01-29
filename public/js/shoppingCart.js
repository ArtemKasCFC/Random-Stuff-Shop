import axios from 'axios';
import Stripe from 'stripe';
const stripe = window.Stripe(
  'pk_test_51OdVUAItca3s9RirOQpdAhOMiBTN84tTo9ceJToSC3SyYf49ibUw5E1jjk8sOgqFEnBYTeOdVHHelzpftB4kSrUu00ULMEZ8oR'
);

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
    const session = await axios({ method: 'POST', url: '/cart' });

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    if (session.data.status === 'success') console.log(res.data.status);
  } catch (err) {
    console.log(`error---------------------------${err}`);
  }
};
