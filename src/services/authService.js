import { auth as clientAuth, googleProvider, signInWithPopup, signInAnonymously, signOut as clientSignOut } from '../firebase/firebase';
import API_BASE_URL from '../api/globalbackendapi';

export const authService = {
  getCurrentUser() {
    try {
      const stored = localStorage.getItem('proven_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading user from localStorage:', e);
    }
    return null;
  },

  getToken() {
    return localStorage.getItem('proven_token') || null;
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  async checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2500) });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async loginInstantAccess() {
    const isBackendUp = await this.checkBackendHealth();
    if (!isBackendUp) {
      throw new Error(`Forensic Backend Offline: Cannot initialize session. Please ensure the backend service is running.`);
    }

    const userCredential = await signInAnonymously(clientAuth);
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/auth/guest-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idToken,
        uid: firebaseUser.uid
      })
    }).catch(() => {
      throw new Error(`Failed to connect to Forensic Backend service.`);
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Backend service returned error status ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.user) {
      throw new Error('Failed to initialize persistent user session from backend');
    }

    const guestUser = data.user;
    if (guestUser.checkedDocs && guestUser.checkedDocs.length > 0) {
      try {
        localStorage.setItem('proven_verified_records', JSON.stringify(guestUser.checkedDocs));
      } catch (e) {}
    }
    if (guestUser.threats && guestUser.threats.length > 0) {
      try {
        localStorage.setItem('proven_threat_records', JSON.stringify(guestUser.threats));
      } catch (e) {}
    }

    const jwtToken = data.token || idToken;

    localStorage.setItem('proven_token', jwtToken);
    localStorage.setItem('proven_user', JSON.stringify(guestUser));
    return { success: true, user: guestUser, token: jwtToken };
  },

  async loginWithGoogle() {
    const isBackendUp = await this.checkBackendHealth();
    if (!isBackendUp) {
      throw new Error(`Forensic Backend Offline: Cannot authenticate with Google because the Forensic Backend service is not running.`);
    }

    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    const userCredential = await signInWithPopup(clientAuth, googleProvider);
    const firebaseUser = userCredential.user;
    const idToken = await firebaseUser.getIdToken();

    const response = await fetch(`${API_BASE_URL}/api/auth/google-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ idToken })
    }).catch(() => {
      throw new Error(`Forensic Backend connection failed.`);
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Backend verification failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.success || !data.user) {
      throw new Error('Authentication succeeded but backend returned invalid user data');
    }

    const verifiedUser = {
      ...data.user,
      role: 'Reviewer'
    };

    if (verifiedUser.checkedDocs && verifiedUser.checkedDocs.length > 0) {
      try {
        localStorage.setItem('proven_verified_records', JSON.stringify(verifiedUser.checkedDocs));
      } catch (e) {}
    }
    if (verifiedUser.threats && verifiedUser.threats.length > 0) {
      try {
        localStorage.setItem('proven_threat_records', JSON.stringify(verifiedUser.threats));
      } catch (e) {}
    }

    const jwtToken = data.token || idToken;

    localStorage.setItem('proven_token', jwtToken);
    localStorage.setItem('proven_user', JSON.stringify(verifiedUser));
    return { success: true, user: verifiedUser, token: jwtToken };
  },

  async verifySession() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          if (data.token) {
            localStorage.setItem('proven_token', data.token);
          }
          localStorage.setItem('proven_user', JSON.stringify(data.user));
          if (data.user.checkedDocs && data.user.checkedDocs.length > 0) {
            try {
              localStorage.setItem('proven_verified_records', JSON.stringify(data.user.checkedDocs));
            } catch (e) {}
          }
          if (data.user.threats && data.user.threats.length > 0) {
            try {
              localStorage.setItem('proven_threat_records', JSON.stringify(data.user.threats));
            } catch (e) {}
          }
          return data.user;
        }
      } else {
        await this.logout();
        return null;
      }
    } catch (e) {
      console.warn('Backend offline during session verify:', e.message);
    }
    return this.getCurrentUser();
  },

  async saveScanRecord(record, threat) {
    const token = this.getToken();
    const user = this.getCurrentUser();
    if (!token || !user) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/save-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          uid: user.uid,
          record,
          threat
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          localStorage.setItem('proven_user', JSON.stringify(data.user));
        }
        return true;
      }
    } catch (e) {
      console.warn('Could not sync scan record to backend:', e);
    }
    return false;
  },

  async sendOtp(email, botProof) {
    const isBackendUp = await this.checkBackendHealth();
    if (!isBackendUp) {
      throw new Error(`Forensic Backend Offline: Cannot send OTP email.`);
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, botProof })
    }).catch(() => {
      throw new Error(`Failed to connect to Forensic Backend service.`);
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success) {
      throw new Error(data.error || `Failed to send OTP code.`);
    }

    return data;
  },

  async verifyOtp(email, otp) {
    const isBackendUp = await this.checkBackendHealth();
    if (!isBackendUp) {
      throw new Error(`Forensic Backend Offline: Cannot verify OTP code.`);
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, otp })
    }).catch(() => {
      throw new Error(`Failed to connect to Forensic Backend service.`);
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success || !data.user) {
      throw new Error(data.error || `Invalid or expired OTP code.`);
    }

    const verifiedUser = {
      ...data.user,
      role: 'Reviewer'
    };

    const jwtToken = data.token;
    localStorage.setItem('proven_token', jwtToken);
    localStorage.setItem('proven_user', JSON.stringify(verifiedUser));

    return { success: true, user: verifiedUser, token: jwtToken };
  },

  async logout() {
    try {
      await clientSignOut(clientAuth);
    } catch (e) {
      console.warn('Firebase client signout notice:', e);
    }
    try {
      localStorage.removeItem('proven_token');
      localStorage.removeItem('proven_user');
      localStorage.removeItem('proven_verified_records');
      localStorage.removeItem('proven_threat_records');
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Error clearing storage on logout:', e);
    }
  }
};

export default authService;
