# SkywardSDK

SDK TypeScript untuk berbagai fungsi utilitas.

## Instalasi

```bash
npm install skywardsdk
```

## Penggunaan

### 📦 Import Methods

#### 1. Named Imports (Recommended - Tree-shaking friendly)

```typescript
import { hitungLuasPersegi, formatRupiah } from "skywardsdk";

const luas = hitungLuasPersegi(5);
const harga = formatRupiah(50000);
```

#### 2. Namespace Imports (Untuk grouping)

```typescript
import { Math, Utils } from "skywardsdk";

const luas = Math.hitungLuasPersegi(5);
const harga = Utils.formatRupiah(50000);
```

#### 3. Specific Module Imports (Untuk bundle size optimal)

```typescript
import { hitungLuasPersegi } from "skywardsdk/dist/math";
import { formatRupiah } from "skywardsdk/dist/utils";
```

## 📚 API Reference

### Math Module

#### Geometry Functions

```typescript
import { hitungLuasPersegi, hitungKelilingPersegi, hitungLuasPersegiPanjang } from "skywardsdk";

// Luas persegi
const luas = hitungLuasPersegi(5); // 25

// Keliling persegi
const keliling = hitungKelilingPersegi(5); // 20

// Luas persegi panjang
const luasPersegiPanjang = hitungLuasPersegiPanjang(5, 10); // 50
```

### Utils Module

#### Converter Functions

```typescript
import { celsiusToFahrenheit, fahrenheitToCelsius } from "skywardsdk";

const fahrenheit = celsiusToFahrenheit(100); // 212
const celsius = fahrenheitToCelsius(32); // 0
```

#### Formatter Functions

```typescript
import { formatRupiah, formatTanggal } from "skywardsdk";

const harga = formatRupiah(50000); // "Rp50.000"
const tanggal = formatTanggal(new Date()); // "29 Oktober 2025"
```

## 🏗️ Struktur Project

```
src/
├── math/
│   ├── geometry.ts      # Fungsi geometri
│   └── index.ts         # Barrel export
├── utils/
│   ├── converter.ts     # Fungsi konversi
│   ├── formatter.ts     # Fungsi format
│   └── index.ts         # Barrel export
└── index.ts             # Main entry point
```

## 🚀 Development

### Build

```bash
npm run build
```

### Tambah Module Baru

1. Buat file di folder yang sesuai (math/utils/etc)
2. Export functions dari file tersebut
3. Update `index.ts` di folder untuk barrel export
4. Main `src/index.ts` akan auto-export

Contoh:

```typescript
// src/math/trigonometry.ts
export function sin(angle: number): number {
  return Math.sin(angle);
}

// src/math/index.ts
export * from "./geometry";
export * from "./trigonometry"; // ← tambah ini

// User bisa langsung pakai:
import { sin } from "skywardsdk";
```

## 📝 Best Practices

- ✅ Gunakan named imports untuk tree-shaking optimal
- ✅ Group related functions dalam satu module
- ✅ Selalu tambahkan JSDoc untuk autocomplete
- ✅ Build sebelum publish: `npm run build`

## Lisensi

ISC
