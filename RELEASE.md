# Tivlo - Google Play Release Guide

## Előfeltételek

### 1. Keystore létrehozása (egyszeri)

```bash
keytool -genkey -v -keystore release-key.keystore -alias tivlo -keyalg RSA -keysize 2048 -validity 10000
```

**FONTOS:** A keystore fájlt és jelszavakat biztonságosan őrizd meg! Elvesztése esetén nem tudsz frissítéseket kiadni!

### 2. Signing konfiguráció beállítása

Hozz létre egy `android/keystore.properties` fájlt (ne commitold!):

```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=tivlo
storeFile=../release-key.keystore
```

Vagy add hozzá a `android/gradle.properties` fájlhoz:

```properties
TIVLO_RELEASE_STORE_FILE=../release-key.keystore
TIVLO_RELEASE_STORE_PASSWORD=your_store_password
TIVLO_RELEASE_KEY_ALIAS=tivlo
TIVLO_RELEASE_KEY_PASSWORD=your_key_password
```

### 3. Environment változók (opcionális)

Alternatívaként környezeti változóként is megadhatod:

```bash
export TIVLO_RELEASE_STORE_FILE=../release-key.keystore
export TIVLO_RELEASE_STORE_PASSWORD=your_store_password
export TIVLO_RELEASE_KEY_ALIAS=tivlo
export TIVLO_RELEASE_KEY_PASSWORD=your_key_password
```

## Build parancsok

### Development build

```bash
npm run dev
```

### Production build (web)

```bash
npm run build
```

### Android sync

```bash
npx cap sync android
```

### Debug APK

```bash
cd android && ./gradlew assembleDebug
```

Az APK helye: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release AAB (Google Play-hez)

```bash
cd android && ./gradlew bundleRelease
```

Az AAB helye: `android/app/build/outputs/bundle/release/app-release.aab`

### Release APK (direkt telepítéshez)

```bash
cd android && ./gradlew assembleRelease
```

## Google Play Console Checklist

### App Information
- [ ] App name: "Tivlo - Ne pazarold az életed"
- [ ] Short description (80 char max)
- [ ] Full description
- [ ] App category: Finance
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (min 2, max 8 per device type)
- [ ] Privacy policy URL

### Store Presence
- [ ] Phone screenshots (min 2)
- [ ] 7" tablet screenshots (optional)
- [ ] 10" tablet screenshots (optional)

### Content Rating
- [ ] Complete IARC questionnaire
- [ ] App should be rated "Everyone"

### Pricing & Distribution
- [ ] Free app
- [ ] Select countries (minimum: Hungary)
- [ ] Accept Developer Agreement

### App Content
- [ ] Privacy policy
- [ ] Ads declaration (No ads)
- [ ] Data safety section
- [ ] Target audience (Adults)

## Data Safety Declaration

A Google Play Console-ban meg kell adnod a következő információkat:

### Gyűjtött adatok
- **E-mail cím**: Fiók létrehozásához és kezeléséhez
- **Felhasználói beállítások**: App személyre szabásához

### Adatbiztonság
- Az adatok titkosítva kerülnek átvitelre (HTTPS)
- A felhasználók kérhetik adataik törlését

### Harmadik fél szolgáltatások
- Supabase: Backend és adatbázis
- Nincs hirdetési SDK
- Nincs analitika SDK

## Verziókezelés

A verziószámot a következő helyeken kell frissíteni:

1. `package.json` - `version` mező
2. `android/app/build.gradle`:
   - `versionCode` (növelni kell minden kiadásnál)
   - `versionName` (pl. "1.0.0", "1.1.0")

### Verzió formátum

- **versionCode**: Egész szám, minden kiadásnál növelni kell (1, 2, 3, ...)
- **versionName**: Szemantikus verzió (MAJOR.MINOR.PATCH)

## Hibaelhárítás

### Build error: "SDK location not found"

Hozz létre `android/local.properties` fájlt:

```properties
sdk.dir=/path/to/your/Android/sdk
```

### Signing error

Ellenőrizd, hogy a keystore fájl létezik és a jelszavak helyesek.

### Memory error

Add hozzá a `android/gradle.properties` fájlhoz:

```properties
org.gradle.jvmargs=-Xmx4096m
```

## Támogatás

- E-mail: support@tivlo.hu
- Weboldal: https://tivlo.hu
