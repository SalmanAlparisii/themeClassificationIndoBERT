import { redirect } from "next/navigation";

// Halaman /classify sudah dipindah jadi section "Try Model" di halaman utama
// (lihat components/classifySection.tsx, dipasang di app/page.tsx dengan
// id="try-model"). Route ini dipertahankan sebagai redirect saja supaya
// link/bookmark lama ke /classify tidak rusak.
export default function ClassifyRedirect() {
  redirect("/#try-model");
}
