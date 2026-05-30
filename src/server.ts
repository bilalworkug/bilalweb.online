import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join} from 'node:path';
import {existsSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import { initializeApp, getApps, getApp, deleteApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateEmail, updatePassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, Firestore } from 'firebase/firestore';

const browserDistFolder = join(import.meta.dirname, '../browser');
const INQUIRIES_FILE = join(import.meta.dirname, '../inquiries.json');
const SUBSCRIBERS_FILE = join(import.meta.dirname, '../subscribers.json');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

interface Subscriber {
  email: string;
  dateSubscribed: string;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

let db: Firestore | null = null;
let isInitializingAuth = false;

async function ensureFirebaseAuth(fbApp: any, forceAwait = false) {
  if (isInitializingAuth) {
    if (forceAwait) {
      while (isInitializingAuth) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    return;
  }
  const auth = getAuth(fbApp);
  if (auth.currentUser) return;

  isInitializingAuth = true;
  try {
    const credPath = join(process.cwd(), 'admin-credentials.json');
    if (existsSync(credPath)) {
      try {
        const creds = JSON.parse(readFileSync(credPath, 'utf8'));
        if (creds.email && creds.password) {
          await signInWithEmailAndPassword(auth, creds.email, creds.password);
          console.log('✅ [Firebase Auth] Auto-authenticated successfully as:', creds.email);
        }
      } catch (e) {
        console.warn('Failed to read local credentials file');
      }
    }
  } catch (err) {
    console.error('⚠️ [Firebase Auth] Auto-authentication failed:', err);
  } finally {
    isInitializingAuth = false;
  }
}

function getFirebaseDB() {
  if (db) return db;
  const configPath = join(import.meta.dirname, '../firebase-applet-config.json');
  const rootConfigPath = join(process.cwd(), 'firebase-applet-config.json');
  let configPathToUse = null;

  if (existsSync(configPath)) {
    configPathToUse = configPath;
  } else if (existsSync(rootConfigPath)) {
    configPathToUse = rootConfigPath;
  }

  if (configPathToUse) {
    try {
      const configText = readFileSync(configPathToUse, 'utf8');
      const firebaseConfig = JSON.parse(configText);
      const fbApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      db = getFirestore(fbApp);
      console.log('✅ [Firebase Backend] Connected to Cloud Firestore using:', configPathToUse);
      
      // Trigger background sign-in to satisfy firestore security rules
      ensureFirebaseAuth(fbApp);

      return db;
    } catch (err) {
      console.error('❌ [Firebase Backend] Failed to load/initialize Firebase client:', err);
    }
  }
  return null;
}

function loadSubscribers(): Subscriber[] {
  try {
    if (existsSync(SUBSCRIBERS_FILE)) {
      const data = readFileSync(SUBSCRIBERS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read subscribers file:', e);
  }
  return [];
}

function saveSubscribers(subs: Subscriber[]) {
  try {
    writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write subscribers file:', e);
  }
}

const subscribers: Subscriber[] = loadSubscribers();

// Backend Storage for client inquiries
interface Inquiry {
  id: string;
  name: string;
  businessName: string;
  contactInfo: string;
  message: string;
  timestamp: string;
}

function loadInquiries(): Inquiry[] {
  try {
    if (existsSync(INQUIRIES_FILE)) {
      const data = readFileSync(INQUIRIES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.warn('Could not read inquiries file:', e);
  }
  return [];
}

function saveInquiries(inqs: Inquiry[]) {
  try {
    writeFileSync(INQUIRIES_FILE, JSON.stringify(inqs, null, 2), 'utf8');
  } catch (e) {
    console.warn('Could not write inquiries file:', e);
  }
}

const inquiries: Inquiry[] = loadInquiries();

/**
 * Handle contact form inquiry submissions
 */
app.post('/api/contact', async (req, res) => {
  const { name, businessName, contactInfo, message } = req.body;
  if (!name || !contactInfo || !message) {
    res.status(400).json({ success: false, error: 'Name, Contact Info, and Message are required' });
    return;
  }

  const itemId = Math.random().toString(36).substring(2, 9);
  const newInquiry: Inquiry = {
    id: itemId,
    name,
    businessName: businessName || 'N/A',
    contactInfo,
    message,
    timestamp: new Date().toISOString()
  };

  const firestoreDb = getFirebaseDB();
  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'inquiries', itemId), newInquiry);
      console.log('🔔 [Bilal Web] Saved Inquiry to Firebase Firestore:', newInquiry);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `inquiries/${itemId}`);
    }
  } else {
    inquiries.push(newInquiry);
    saveInquiries(inquiries);
    console.log('🔔 [Bilal Web] Saved Inquiry to Local JSON storage:', newInquiry);
  }

  // Pre-fill WhatsApp URL for quick touch-to-send from device
  const waMsgTemplate = `Hi Bilal, my name is ${name}${businessName && businessName !== 'N/A' ? ` (from ${businessName})` : ''}. I'm interested in building a website with Bilal Web. Here is my request: \n\n"${message}"\n\nContact: ${contactInfo}. Let's make it work!`;
  const whatsappUrl = `https://wa.me/256749445501?text=${encodeURIComponent(waMsgTemplate)}`;

  res.status(200).json({
    success: true,
    message: 'Inquiry registered successfully!',
    whatsappUrl
  });
});

/**
 * Endpoint to retrieve all client inquiries
 */
app.get('/api/inquiries', async (req, res) => {
  const firestoreDb = getFirebaseDB();
  if (firestoreDb) {
    try {
      const colRef = collection(firestoreDb, 'inquiries');
      const snapshot = await getDocs(colRef);
      const list: Inquiry[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Inquiry);
      });
      // Sort inqs descending by timestamp (farthest first or newest first depending on order)
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      res.status(200).json({ success: true, inquiries: list });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'inquiries');
    }
  } else {
    res.status(200).json({ success: true, inquiries });
  }
});

/**
 * Endpoint to delete an inquiry by ID
 */
app.delete('/api/inquiries/:id', async (req, res) => {
  const { id } = req.params;
  const firestoreDb = getFirebaseDB();
  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'inquiries', id));
      console.log(`🔔 [Bilal Web] Deleted Inquiry ID from Firestore: ${id}`);
      res.status(200).json({ success: true, message: 'Inquiry deleted' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `inquiries/${id}`);
    }
  } else {
    const index = inquiries.findIndex(item => item.id === id);
    if (index !== -1) {
      inquiries.splice(index, 1);
      saveInquiries(inquiries);
      console.log(`🔔 [Bilal Web] Deleted Inquiry ID from Local Storage: ${id}`);
      res.status(200).json({ success: true, message: 'Inquiry deleted' });
    } else {
      res.status(404).json({ success: false, error: 'Inquiry not found' });
    }
  }
});

/**
 * Endpoint to add a newsletter subscriber
 */
app.post('/api/subscribers', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    res.status(400).json({ success: false, error: 'Email is required' });
    return;
  }
  const normalized = email.trim().toLowerCase();
  
  const firestoreDb = getFirebaseDB();
  const newSub: Subscriber = {
    email: normalized,
    dateSubscribed: new Date().toISOString()
  };

  if (firestoreDb) {
    try {
      const subId = normalized.replace(/[^a-zA-Z0-9]/g, '_');
      await setDoc(doc(firestoreDb, 'subscribers', subId), newSub);
      console.log(`🔔 [Bilal Web] New Subscriber registered on Firebase: ${normalized}`);
      res.status(200).json({ success: true, message: 'Successfully subscribed to Weekly Blueprints newsletter!' });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `subscribers/${normalized}`);
    }
  } else {
    if (subscribers.some(s => s.email === normalized)) {
      res.status(400).json({ success: false, error: 'Email already subscribed' });
      return;
    }
    subscribers.push(newSub);
    saveSubscribers(subscribers);
    console.log(`🔔 [Bilal Web] New Subscriber registered on Local Storage: ${normalized}`);
    res.status(200).json({ success: true, message: 'Successfully subscribed to Weekly Blueprints newsletter!' });
  }
});

/**
 * Endpoint to get all newsletter subscribers
 */
app.get('/api/subscribers', async (req, res) => {
  const firestoreDb = getFirebaseDB();
  if (firestoreDb) {
    try {
      const colRef = collection(firestoreDb, 'subscribers');
      const snapshot = await getDocs(colRef);
      const list: Subscriber[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Subscriber);
      });
      list.sort((a, b) => new Date(b.dateSubscribed).getTime() - new Date(a.dateSubscribed).getTime());
      res.status(200).json({ success: true, subscribers: list });
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'subscribers');
    }
  } else {
    res.status(200).json({ success: true, subscribers });
  }
});

/**
 * Endpoint to delete a newsletter subscriber by email
 */
app.delete('/api/subscribers/:email', async (req, res) => {
  const { email } = req.params;
  const normalized = email.trim().toLowerCase();
  const firestoreDb = getFirebaseDB();

  if (firestoreDb) {
    try {
      const subId = normalized.replace(/[^a-zA-Z0-9]/g, '_');
      await deleteDoc(doc(firestoreDb, 'subscribers', subId));
      console.log(`🔔 [Bilal Web] Removed subscriber email from Firestore: ${normalized}`);
      res.status(200).json({ success: true, message: 'Subscriber deleted' });
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `subscribers/${normalized}`);
    }
  } else {
    const index = subscribers.findIndex(s => s.email === normalized);
    if (index !== -1) {
      subscribers.splice(index, 1);
      saveSubscribers(subscribers);
      console.log(`🔔 [Bilal Web] Removed subscriber email from Local Storage: ${normalized}`);
      res.status(200).json({ success: true, message: 'Subscriber deleted' });
    } else {
      res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
  }
});

/**
 * GET /api/firebase-config
 * Retrieve the active configuration status and masked details
 */
app.get('/api/firebase-config', (req, res) => {
  const configPath = join(import.meta.dirname, '../firebase-applet-config.json');
  const rootConfigPath = join(process.cwd(), 'firebase-applet-config.json');
  let configPathToUse = null;

  if (existsSync(configPath)) {
    configPathToUse = configPath;
  } else if (existsSync(rootConfigPath)) {
    configPathToUse = rootConfigPath;
  }

  if (configPathToUse) {
    try {
      const configText = readFileSync(configPathToUse, 'utf8');
      const firebaseConfig = JSON.parse(configText);
      res.status(200).json({
        success: true,
        active: true,
        config: {
          projectId: firebaseConfig.projectId || '',
          appId: firebaseConfig.appId || '',
          authDomain: firebaseConfig.authDomain || '',
          storageBucket: firebaseConfig.storageBucket || '',
          messagingSenderId: firebaseConfig.messagingSenderId || '',
          firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || '',
          apiKey: '••••••••••••••••••••••••••••••••••••'
        }
      });
      return;
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to read existing Firebase config' });
      return;
    }
  }

  res.status(200).json({
    success: true,
    active: false,
    config: null
  });
});

/**
 * POST /api/firebase-config
 * Upload and apply new Firebase configuration JSON.
 * Re-initializes connections dynamically and verifies connectivity.
 */
app.post('/api/firebase-config', async (req, res) => {
  const firebaseConfig = req.body;
  
  if (!firebaseConfig || !firebaseConfig.projectId || !firebaseConfig.apiKey || !firebaseConfig.appId) {
    res.status(400).json({ success: false, error: 'Invalid configuration. apiKey, projectId, and appId are required.' });
    return;
  }

  const rootConfigPath = join(process.cwd(), 'firebase-applet-config.json');
  const legacyConfigPath = join(import.meta.dirname, '../firebase-applet-config.json');

  // Keep backup of old config if any
  let oldConfigText = null;
  if (existsSync(rootConfigPath)) {
    oldConfigText = readFileSync(rootConfigPath, 'utf8');
  } else if (existsSync(legacyConfigPath)) {
    oldConfigText = readFileSync(legacyConfigPath, 'utf8');
  }

  // Backup current in-memory status
  const originalDb = db;

  try {
    // Delete stale legacy config if any to prevent priority overlap
    if (existsSync(legacyConfigPath)) {
      unlinkSync(legacyConfigPath);
    }

    // Write new config to process root
    writeFileSync(rootConfigPath, JSON.stringify(firebaseConfig, null, 2), 'utf8');

    // Reset firebase state
    db = null;
    const apps = getApps();
    for (const appInstance of apps) {
      await deleteApp(appInstance);
    }

    // Attempt to initialize and connect
    const newDb = getFirebaseDB();
    if (!newDb) {
      throw new Error('Firebase app initialization failed');
    }

    // Await background auth initialization so the test query succeeds!
    const currentApps = getApps();
    if (currentApps.length > 0) {
      await ensureFirebaseAuth(currentApps[0], true);
    }

    // Try a test query to verify Firestore connectivity
    const colRef = collection(newDb, 'inquiries');
    await getDocs(colRef);

    // If query succeeds, connection is verified!
    res.status(200).json({
      success: true,
      message: 'Firebase connection successfully established and verified!'
    });
  } catch (err: any) {
    console.error('❌ Failed to verify new Firebase config:', err);

    // Revert file changes
    if (oldConfigText) {
      writeFileSync(rootConfigPath, oldConfigText, 'utf8');
    } else {
      if (existsSync(rootConfigPath)) {
        unlinkSync(rootConfigPath);
      }
    }

    // Re-initialize original firebase apps
    db = originalDb;
    const apps = getApps();
    for (const appInstance of apps) {
      try {
        await deleteApp(appInstance);
      } catch (e) {}
    }
    if (oldConfigText) {
      const parsedOld = JSON.parse(oldConfigText);
      initializeApp(parsedOld);
    }

    res.status(400).json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

/**
 * DELETE /api/firebase-config
 * Remove Firebase backend config and revert to local JSON files
 */
app.delete('/api/firebase-config', async (req, res) => {
  const configPath = join(import.meta.dirname, '../firebase-applet-config.json');
  const rootConfigPath = join(process.cwd(), 'firebase-applet-config.json');

  try {
    if (existsSync(configPath)) {
      unlinkSync(configPath);
    }
    if (existsSync(rootConfigPath)) {
      unlinkSync(rootConfigPath);
    }

    // Terminate current instances
    db = null;
    const apps = getApps();
    for (const appInstance of apps) {
      await deleteApp(appInstance);
    }

    res.status(200).json({
      success: true,
      message: 'Firebase configuration removed. Reverted to local JSON storage.'
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : String(err)
    });
  }
});

/**
 * POST /api/login
 * Verify admin credentials. Logs into Firebase Auth if Firebase is active.
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }

  const firestoreDb = getFirebaseDB();
  if (firestoreDb) {
    try {
      const apps = getApps();
      if (apps.length === 0) {
        throw new Error('Firebase app is not initialized');
      }
      const auth = getAuth(apps[0]);
      
      // Sign in the user in Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ [Firebase Auth] Signed in successfully as:', email);
      
      // Save credentials locally on the server as active credentials
      const credPath = join(process.cwd(), 'admin-credentials.json');
      writeFileSync(credPath, JSON.stringify({ email, password }, null, 2), 'utf8');

      res.status(200).json({
        success: true,
        message: 'Firebase authentication successful',
        user: {
          email: userCredential.user.email,
          uid: userCredential.user.uid
        }
      });
    } catch (err: any) {
      console.error('❌ [Firebase Auth] Login failed:', err);
      res.status(401).json({
        success: false,
        error: err.message || 'Firebase authentication failed'
      });
    }
  } else {
    // Local fallback check
    const credPath = join(process.cwd(), 'admin-credentials.json');
    let localEmail = 'bilal@bilalweb.online';
    let localPassword = 'Bilal2025!';

    if (existsSync(credPath)) {
      try {
        const creds = JSON.parse(readFileSync(credPath, 'utf8'));
        if (creds.email) localEmail = creds.email;
        if (creds.password) localPassword = creds.password;
      } catch (e) {
        console.warn('Failed to read local credentials file');
      }
    }

    if (email === localEmail && password === localPassword) {
      res.status(200).json({
        success: true,
        message: 'Local authentication successful',
        user: {
          email: localEmail,
          uid: 'local-admin'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid local credentials'
      });
    }
  }
});

/**
 * POST /api/update-credentials
 * Updates admin email and password. Also updates Firebase Auth if active.
 */
app.post('/api/update-credentials', async (req, res) => {
  const { currentPassword, newEmail, newPassword } = req.body;
  
  if (!currentPassword || !newEmail || !newPassword) {
    res.status(400).json({ success: false, error: 'Current password, new email, and new password are required' });
    return;
  }

  // Load current server credentials
  const credPath = join(process.cwd(), 'admin-credentials.json');
  let currentEmail = 'bilal@bilalweb.online';
  let currentPass = 'Bilal2025!';

  if (existsSync(credPath)) {
    try {
      const creds = JSON.parse(readFileSync(credPath, 'utf8'));
      if (creds.email) currentEmail = creds.email;
      if (creds.password) currentPass = creds.password;
    } catch (e) {}
  }

  if (currentPassword !== currentPass) {
    res.status(401).json({ success: false, error: 'Incorrect current password confirmation' });
    return;
  }

  const firestoreDb = getFirebaseDB();
  if (firestoreDb) {
    try {
      const apps = getApps();
      if (apps.length === 0) {
        throw new Error('Firebase app is not initialized');
      }
      const auth = getAuth(apps[0]);
      
      // Re-authenticate user to permit security profile changes
      const userCredential = await signInWithEmailAndPassword(auth, currentEmail, currentPassword);
      const user = userCredential.user;
      
      if (newEmail !== currentEmail) {
        await updateEmail(user, newEmail);
      }
      if (newPassword !== currentPassword) {
        await updatePassword(user, newPassword);
      }

      console.log('✅ [Firebase Auth] Administrative security parameters updated successfully');
    } catch (err: any) {
      console.error('❌ [Firebase Auth] Failed to update authentication parameters:', err);
      res.status(500).json({ success: false, error: err.message || 'Firebase Auth update failed' });
      return;
    }
  }

  // Save new credentials locally on the server
  try {
    writeFileSync(credPath, JSON.stringify({ email: newEmail, password: newPassword }, null, 2), 'utf8');
    res.status(200).json({ success: true, message: 'Administrative security parameters successfully updated!' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'Failed to write updated credentials on server: ' + err.message });
  }
});

const angularApp = new AngularNodeAppEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
