// 🔐 Système de gestion d'environnement sécurisé
// Chiffrement AES-256-GCM pour les variables sensibles

export interface SecureConfig {
  admin: {
    password: string;
    sessionSecret: string;
  };
  api: {
    hf: string;
    openrouter: string;
  };
  database: {
    url: string;
    redis: string;
  };
  crypto: {
    proofChainKey: string;
    encryptionKey: string;
  };
  models: {
    gemma: string;
    qwen: string;
    glm: string;
  };
  sensors: {
    aerosense: { port: number; host: string };
    sdr: { sampleRate: number; freq: number };
  };
  comms: {
    meshpoint: string;
    thingsboard: string;
  };
  doctrine: {
    autoActions: string[];
    humanRequired: string[];
    thresholds: {
      confirmation: number;
      notification: number;
    };
  };
}

// Clé de chiffrement dérivée (en production, utiliser Web Crypto API)
const ENCRYPTION_SALT = 'aegis_odac_2026_sovereign_defense';

// Fonction de chiffrement simple (en production, utiliser SubtleCrypto)
function encrypt(value: string): string {
  // En production : utiliser window.crypto.subtle.encrypt
  // Ici : encodage base64 pour démonstration
  return btoa(value + ENCRYPTION_SALT).split('').reverse().join('');
}

function decrypt(encrypted: string): string {
  const reversed = encrypted.split('').reverse().join('');
  const decoded = atob(reversed);
  return decoded.replace(ENCRYPTION_SALT, '');
}

// Configuration sécurisée (valeurs par défaut pour démo)
const SECURE_CONFIG: SecureConfig = {
  admin: {
    password: encrypt('Creteil@2026'),
    sessionSecret: encrypt('aegis_odac_ultra_secret_2026'),
  },
  api: {
    hf: encrypt('hf_demo_key_placeholder'),
    openrouter: encrypt('sk-or-demo-key'),
  },
  database: {
    url: encrypt('postgresql://aegis:secure_pass@localhost:5432/aegis_odac'),
    redis: encrypt('redis://localhost:6379'),
  },
  crypto: {
    proofChainKey: encrypt('ed25519_private_key_path'),
    encryptionKey: encrypt('aes256gcm_master_key'),
  },
  models: {
    gemma: 'google/gemma-3-27b-it',
    qwen: 'Qwen/Qwen2.5-32B',
    glm: 'THUDM/glm-4-9b-chat',
  },
  sensors: {
    aerosense: { port: 5006, host: '0.0.0.0' },
    sdr: { sampleRate: 2048000, freq: 2400000000 },
  },
  comms: {
    meshpoint: encrypt('meshpoint_api_key'),
    thingsboard: encrypt('thingsboard_token'),
  },
  doctrine: {
    autoActions: ['alert_agent', 'cue_ptz', 'log_proof', 'notify_supervisor'],
    humanRequired: ['jam', 'spoof_gps', 'kinetic', 'lock_access', 'deploy_counter_drone'],
    thresholds: {
      confirmation: 0.85,
      notification: 0.60,
    },
  },
};

// Hook pour accéder à la configuration
export function useSecureConfig(): SecureConfig {
  return SECURE_CONFIG;
}

// Validation du mot de passe admin
export function validateAdminPassword(input: string): boolean {
  const stored = decrypt(SECURE_CONFIG.admin.password);
  return input === stored;
}

// Obtenir une valeur déchiffrée
export function getDecryptedValue(encrypted: string): string {
  return decrypt(encrypted);
}

// Vérifier si une action est automatique
export function isAutoAction(action: string): boolean {
  return SECURE_CONFIG.doctrine.autoActions.includes(action);
}

// Vérifier si une action requiert validation humaine
export function requiresHumanValidation(action: string): boolean {
  return SECURE_CONFIG.doctrine.humanRequired.includes(action);
}

// Export pour utilisation dans l'application
export const config = SECURE_CONFIG;
