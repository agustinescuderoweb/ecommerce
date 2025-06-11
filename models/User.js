// user.js
import { db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function saveUser({ id, name, email }) {
  if (!id || !name || !email) return;

  try {
    await setDoc(doc(db, "users", id), {
      name,
      email
    });
    console.log("✅ Usuario guardado/actualizado en Firestore");
  } catch (error) {
    console.error("❌ Error al guardar el usuario:", error);
  }
}
