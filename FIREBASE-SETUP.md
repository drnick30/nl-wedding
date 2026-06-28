# Firebase Setup for Guest Photo Gallery

## 1. Create a Firebase Project
- Go to [firebase.google.com](https://firebase.google.com)
- Click **"Go to console"** → **"Add project"**
- Name it **"nilo26-wedding"**
- Disable Google Analytics (not needed)
- Click **Create Project**

## 2. Enable Storage
- In your Firebase project, go to **Build > Storage**
- Click **"Get started"**
- Choose **"Start in test mode"** (we'll secure it later)
- Select the closest region (europe-west1 for UK)
- Click **Done**

## 3. Get Your Config
- Go to **Project Settings** (gear icon top-left)
- Scroll to **"Your apps"** → click the **web icon (</>)**
- Register app name: **"nilo26"**
- Copy the `firebaseConfig` object — it looks like:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "nilo26-wedding.firebaseapp.com",
  projectId: "nilo26-wedding",
  storageBucket: "nilo26-wedding.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123..."
};
```

## 4. Paste the config here and tell me
I'll add it to the website code.

## 5. Set Storage Rules (after testing)
Go to **Storage > Rules** and set:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /guest-photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```
This allows anyone to upload images under 10MB but only image files.
