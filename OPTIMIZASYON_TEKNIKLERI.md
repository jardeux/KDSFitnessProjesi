# Optimizasyon Teknikleri - AHP + TOPSIS

Bu projede **iki optimizasyon tekniği** birlikte kullanılmaktadır:

## 1. AHP (Analytic Hierarchy Process) - Kriter Ağırlıklandırma

### Nerede Kullanılıyor?
- **Dosya**: `src/utils/ahpLogic.js` ve `src/services/exerciseService.js`
- **Fonksiyon**: `calculateAHPWeights()` (exerciseService.js içinde)
- **UI**: `src/components/forms/UserProfileForm.jsx` - Kullanıcı slider'lardan kriter önceliklerini belirler

### Nasıl Çalışıyor?

1. **Kullanıcı Girdisi**: Kullanıcı 5 kriter için 1-9 arası öncelik değerleri verir:
   - `tension` (Mekanik Gerilim)
   - `stability` (Stabilizasyon)
   - `isolation` (Kas İzolasyonu)
   - `resistanceCurve` (Direnç Eğrisi)
   - `jointSafety` (Eklem Güvenliği)

2. **Pairwise Comparison Matrix**: AHP algoritması bu değerleri kullanarak ikili karşılaştırma matrisi oluşturur:
   ```
   a_ij = rating_i / rating_j
   ```
   Bu matris, her kriterin diğer kriterlere göre önemini gösterir.

3. **Priority Vector (Öncelik Vektörü)**: 
   - Matris normalize edilir (sütun normalizasyonu)
   - Her satırın ortalaması alınarak öncelik vektörü hesaplanır
   - Bu vektör, her kriterin nihai ağırlığını verir (toplamı 1.0)

4. **Consistency Ratio (Tutarlılık Oranı)**:
   - AHP, kullanıcının verdiği değerlerin tutarlı olup olmadığını kontrol eder
   - CR < 0.1 (veya %10) kabul edilebilir seviye kabul edilir
   - Yüksek CR değeri, kullanıcının tercihlerinde tutarsızlık olduğunu gösterir

### Kod Akışı:
```javascript
// 1. Kullanıcı rating'lerini al
const ratings = [5, 4, 4, 3, 4]; // tension, stability, isolation, resistanceCurve, jointSafety

// 2. AHP ile ağırlıkları hesapla
const { weights, consistencyRatio } = deriveWeightsFromRatings(ratings);
// weights = { tension: 0.28, stability: 0.22, ... }

// 3. Bu ağırlıklar TOPSIS'e aktarılır
```

---

## 2. TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) - Alternatif Sıralama

### Nerede Kullanılıyor?
- **Dosya**: `src/services/exerciseService.js`
- **Fonksiyon**: `optimizeHypertrophyTOPSIS()`
- **Kullanım**: Egzersizleri en iyiden en kötüye sıralamak için

### Nasıl Çalışıyor?

1. **Kriter Matrisi Oluşturma**:
   - Her egzersiz için 5 kriterde puanlama yapılır
   - Ekipman tipine göre bilimsel puanlar atanır:
     - `barbell`: Yüksek tension, orta stability
     - `dumbbell`: Yüksek stability, orta isolation
     - `cable`: Yüksek isolation ve resistanceCurve
     - `machine`: Yüksek isolation ve jointSafety
     - vb.

2. **Normalizasyon**:
   - Her kriter sütunu için vektör normu hesaplanır
   - Matris normalize edilir (her değer norm'a bölünür)

3. **Ağırlıklı Normalizasyon**:
   - AHP'den gelen ağırlıklar uygulanır
   - Her değer ilgili kriter ağırlığı ile çarpılır

4. **İdeal ve Negatif İdeal Çözümler**:
   - **İdeal Çözüm**: Her kriter için en yüksek değer
   - **Negatif İdeal Çözüm**: Her kriter için en düşük değer

5. **Uzaklık Hesaplama**:
   - Her egzersiz için ideal çözüme uzaklık (d+)
   - Her egzersiz için negatif ideal çözüme uzaklık (d-)
   - **TOPSIS Skoru** = d- / (d+ + d-)
   - Yüksek skor = İdeal çözüme yakın, negatif ideale uzak = **DAHA İYİ**

6. **Sıralama**:
   - Egzersizler TOPSIS skoruna göre sıralanır (yüksek → düşük)

### Kod Akışı:
```javascript
// 1. AHP ağırlıklarını al (veya varsayılan ağırlıkları kullan)
const weights = calculateAHPWeights(profile).weights;

// 2. Her egzersiz için kriter puanlarını hesapla
const matrix = exercises.map(ex => ({
  tension: equipmentScores[ex.equipment].tension,
  stability: equipmentScores[ex.equipment].stability,
  // ...
}));

// 3. Normalize et
const normalized = normalizeMatrix(matrix);

// 4. Ağırlıklı normalize et
const weighted = applyWeights(normalized, weights);

// 5. İdeal ve negatif ideal çözümleri bul
const ideal = findIdealSolution(weighted);
const nadir = findNadirSolution(weighted);

// 6. Her egzersiz için TOPSIS skoru hesapla
const scores = weighted.map(row => {
  const dPlus = distance(row, ideal);
  const dMinus = distance(row, nadir);
  return dMinus / (dPlus + dMinus);
});

// 7. Skora göre sırala
return exercises.sort((a, b) => b.score - a.score);
```

---

## İki Tekniğin Birlikte Kullanımı

### Akış Diyagramı:

```
1. Kullanıcı Formu Doldurur
   ↓
2. AHP Rating'leri Alınır (slider'lardan)
   ↓
3. AHP Algoritması Çalışır
   ├─ Pairwise Matrix Oluşturulur
   ├─ Priority Vector Hesaplanır
   └─ Consistency Ratio Kontrol Edilir
   ↓
4. AHP Ağırlıkları TOPSIS'e Aktarılır
   ↓
5. TOPSIS Algoritması Çalışır
   ├─ Egzersiz Kriter Matrisi Oluşturulur
   ├─ Normalizasyon Yapılır
   ├─ AHP Ağırlıkları Uygulanır
   ├─ İdeal/Negatif İdeal Çözümler Bulunur
   └─ TOPSIS Skorları Hesaplanır
   ↓
6. Egzersizler Sıralanır (TOPSIS skoruna göre)
   ↓
7. Program Oluşturulur (günlere dağıtım)
```

### Örnek Senaryo:

**Kullanıcı Girdileri:**
- tension: 7/9 (Yüksek öncelik)
- stability: 5/9 (Orta öncelik)
- isolation: 6/9 (Orta-yüksek öncelik)
- resistanceCurve: 4/9 (Düşük-orta öncelik)
- jointSafety: 8/9 (Çok yüksek öncelik)

**AHP Sonucu:**
- tension: %28 ağırlık
- stability: %18 ağırlık
- isolation: %22 ağırlık
- resistanceCurve: %14 ağırlık
- jointSafety: %18 ağırlık
- Consistency Ratio: %8.5 (Kabul edilebilir)

**TOPSIS Sonucu:**
- Egzersizler, AHP ağırlıklarına göre sıralanır
- Yüksek `jointSafety` ve `tension` puanı olan egzersizler öncelik kazanır
- Örnek: Cable fly (yüksek isolation + jointSafety) → Yüksek skor
- Örnek: Barbell bench press (yüksek tension) → Yüksek skor

---

## Avantajlar

### AHP'nin Avantajları:
- ✅ Kullanıcının tercihlerini matematiksel olarak modelleme
- ✅ Tutarlılık kontrolü (kullanıcı tutarsız tercihler yaparsa uyarı)
- ✅ Şeffaf ve açıklanabilir ağırlıklandırma

### TOPSIS'in Avantajları:
- ✅ Çok kriterli karar verme için ideal
- ✅ İdeal çözüme yakınlık ölçümü
- ✅ Alternatifleri objektif şekilde sıralama
- ✅ AHP ağırlıklarını doğrudan kullanabilme

### Birlikte Kullanımın Avantajları:
- ✅ **Kişiselleştirme**: Her kullanıcı için özel ağırlıklar
- ✅ **Bilimsel Temel**: Her iki teknik de akademik olarak kanıtlanmış
- ✅ **Esneklik**: Kullanıcı tercihleri değiştiğinde sonuçlar otomatik güncellenir
- ✅ **Doğruluk**: AHP ile doğru ağırlıklar, TOPSIS ile doğru sıralama

---

## Dosya Yapısı

```
src/
├── utils/
│   └── ahpLogic.js              # AHP algoritması (pairwise matrix, priority vector, CR)
├── services/
│   └── exerciseService.js       # TOPSIS algoritması + AHP entegrasyonu
└── components/
    └── forms/
        └── UserProfileForm.jsx  # AHP rating slider'ları (UI)
```

---

## Teknik Detaylar

### AHP Consistency Ratio Hesaplama:
```
CR = CI / RI
CI = (λ_max - n) / (n - 1)
```
- `λ_max`: Maksimum özdeğer
- `n`: Kriter sayısı
- `RI`: Random Index (Saaty tablosundan)

### TOPSIS Uzaklık Formülü:
```
d+ = √Σ(w_i * (x_i - ideal_i)²)  // İdeal çözüme uzaklık
d- = √Σ(w_i * (x_i - nadir_i)²)  // Negatif ideale uzaklık
Score = d- / (d+ + d-)
```

---

## Sonuç

Bu proje, **AHP** ile kullanıcı tercihlerini matematiksel ağırlıklara dönüştürür ve **TOPSIS** ile bu ağırlıkları kullanarak egzersizleri optimal şekilde sıralar. Bu iki teknik birlikte, kişiselleştirilmiş ve bilimsel temelli antrenman programları oluşturmayı sağlar.

