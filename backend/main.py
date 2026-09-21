"""
Backend API untuk klasifikasi tema lirik lagu.

CATATAN PENTING (baca dulu):
Untuk sekarang, kode pemanggilan model IndoBERT (transformers + torch)
SENGAJA DIHAPUS dulu karena masih menyebabkan error saat load model.
Endpoint di bawah ini hanya mengembalikan skor RANDOM (bukan hasil model
sungguhan) supaya alur end-to-end (frontend <-> backend) tetap bisa
dicoba tanpa terganggu error loading model.

Saat ini fokus analisis teks sebenarnya dipindah ke FRONTEND (lihat
frontend/app/classify/page.tsx), jadi backend ini TIDAK WAJIB dijalankan
untuk demo randomize. File ini disimpan sebagai kerangka untuk nanti,
saat model IndoBERT hasil fine-tuning sudah siap dipakai kembali.

Rencana ke depan (kalau mau pasang model asli lagi):
  1. Tambahkan lagi dependency "transformers" dan "torch" di requirements.txt
  2. Load tokenizer & model dari folder checkpoint hasil training
  3. Ganti isi fungsi classify() di bawah supaya menghitung skor dari model,
     bukan random.

Cara jalanin (opsional, untuk sekarang tidak diperlukan oleh frontend):
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload --port 8000
"""

import random

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

LABELS = ["cinta", "keadilan sosial", "refleksi diri"]

app = FastAPI(title="LikeTheme - Lyric Theme Classifier (random demo)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo saja; persempit ke domain frontend di production
    allow_methods=["*"],
    allow_headers=["*"],
)


class LyricsIn(BaseModel):
    lyrics: str = Field(..., min_length=1, description="Lirik lagu yang mau diklasifikasi")


class ClassifyOut(BaseModel):
    label: str
    label_id: int
    confidence: float
    scores: dict[str, float]


@app.get("/")
def root():
    return {"status": "ok", "message": "LikeTheme classifier API (random demo, belum pakai IndoBERT)"}


@app.post("/api/classify", response_model=ClassifyOut)
def classify(payload: LyricsIn):
    # Random untuk sekarang — tidak menganalisis isi lyrics sama sekali.
    # "keadilan sosial" sengaja dikasih bobot dasar lebih kecil karena
    # lirik demo yang dipakai memang tidak menyentuh tema itu, jadi wajar
    # kalau skornya konsisten lebih rendah. "cinta" dan "refleksi diri"
    # tetap saling berdekatan.
    base_weights = {
        "cinta": 0.38,
        "keadilan sosial": 0.24,
        "refleksi diri": 0.38,
    }
    noise_spread = 0.05
    half = noise_spread / 2

    raw = [
        base_weights[label] + (random.random() * noise_spread - half)
        for label in LABELS
    ]
    total = sum(raw)
    probs = [r / total for r in raw]

    scores = {label: round(p, 4) for label, p in zip(LABELS, probs)}
    best_idx = max(range(len(LABELS)), key=lambda i: probs[i])

    return ClassifyOut(
        label=LABELS[best_idx],
        label_id=best_idx,
        confidence=round(probs[best_idx], 4),
        scores=scores,
    )
