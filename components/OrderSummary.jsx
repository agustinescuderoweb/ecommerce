'use client'
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";

const OrderSummary = () => {
  const { cartItems, products } = useAppContext();
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    // Armamos los ítems para enviar a Mercado Pago
    const items = Object.keys(cartItems).map((id) => {
      const product = products.find((p) => p._id === id);
      return {
        title: product?.name || "Producto",
        unit_price: product?.offerPrice || 0,
        quantity: cartItems[id],
      };
    });

    try {
      const res = await fetch("/api/createPreference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, buyer }),
      });

     const data = await res.json();
        if (res.ok && data.init_point) {
         window.location.href = data.init_point;
      } else {
        console.error("Error backend:", data.error);
         alert("No se pudo iniciar el pago.");
      }
    } catch (err) {
      console.error(err);
      alert("Error al generar el link de pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Resumen de compra</h2>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white w-full py-2 rounded hover:bg-orange-700"
        >
          Comprar
        </button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheckout();
          }}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            placeholder="Nombre"
            value={buyer.name}
            onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={buyer.email}
            onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {loading ? "Redirigiendo..." : "Ir a pagar con Mercado Pago"}
          </button>
        </form>
      )}
    </div>
  );
};

export default OrderSummary;
