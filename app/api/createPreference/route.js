import { MercadoPagoConfig, Preference } from 'mercadopago';

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("Items recibidos:", body.items);
    console.log("Buyer recibido:", body.buyer);

    const preference = await new Preference(mercadopago).create({
      body: {
            items: body.items,
        payer: {
          name: body.buyer.name,
          email: body.buyer.email,
        },
        back_urls: {
          success: 'https://tusitio.com/success',
          failure: 'https://tusitio.com/failure',
          pending: 'https://tusitio.com/pending',
        },
        auto_return: 'approved',
      }
  });

    return new Response(JSON.stringify({ init_point: preference.init_point }), {
      status: 200,
    });

  } catch (error) {
    console.error('Mercado Pago Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
