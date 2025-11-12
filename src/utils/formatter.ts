import Joi from "joi";

/**
 * Format angka ke currency IDR
 * @param amount - Jumlah angka
 * @returns String dalam format Rupiah
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format tanggal ke format Indonesia
 * @param date - Tanggal
 * @returns String tanggal dalam format Indonesia
 */
export function formatTanggal(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function validationJoi(data: any): string {
  let result = "Validasi gagal";

  const idSchema = Joi.object({
    id: Joi.string().alphanum().min(3).max(30).required(),
  });

  const { error } = idSchema.validate(data);
  if (error) {
    result = error.message;
  } else {
    result = "Validasi berhasil";
  }

  return result;
}
