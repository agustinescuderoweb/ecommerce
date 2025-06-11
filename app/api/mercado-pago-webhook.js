import { db } from '@/firebase'; // tu archivo firebase.js
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;

      // Consultar los datos del pago desde Mercado Pago
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`, // usa tu access_token de producción
        },
      });

      const paymentData = await response.json();

      if (paymentData.status === 'approved') {
        // Guardar en Firestore
        await setDoc(doc(db, 'compras', paymentId.toString()), {
          paymentId,
          nombre: paymentData.payer?.first_name,
          email: paymentData.payer?.email,
          estado: paymentData.status,
          total: paymentData.transaction_amount,
          productos: paymentData.additional_info?.items || [],
          fecha: new Date().toISOString(),
        });
      }
    }

    res.status(200).end(); // importante devolver 200 para que Mercado Pago no reintente
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
