import { MercadoPagoConfig, Preference } from 'mercadopago';
import { db } from '@/firebase'; // tu configuración Firebase
import { collection, addDoc } from 'firebase/firestore';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método no permitido' });

  try {
    const { items, buyer } = req.body;

    if (!items || !buyer || !buyer.email) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    // Guardar comprador en Firestore
    await addDoc(collection(db, "buyers"), buyer);

    // Crear preferencia Mercado Pago
    const preference = await new Preference(mercadopago).create({
      body: {
        items,
        payer: {
          name: buyer.name,
          email: buyer.email,
        },
        back_urls: {
          success: 'https://tusitio.com/success',
          failure: 'https://tusitio.com/failure',
          pending: 'https://tusitio.com/pending',
        },
        auto_return: 'approved',
      }
    });

    return res.status(200).json({ init_point: preference.init_point });
  } catch (error) {
    console.error('Error en createPreference:', error);
    return res.status(500).json({ message: 'Error creando preferencia' });
  }
}
