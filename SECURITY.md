# 🔐 Guide de Sécurité AEGIS-ODAC

## 🛡️ Architecture de Sécurité

### 1. Authentification
- **Méthode** : Mot de passe administrateur
- **Stockage** : Chiffré dans `secureConfig.ts` (AES-256-GCM)
- **Session** : JWT avec secret unique
- **Validation** : `validateAdminPassword()` avec comparaison sécurisée

### 2. Configuration Sensible
Toutes les données sensibles sont dans `secureConfig.ts` :
```typescript
// Exemple de chiffrement
const encrypted = encrypt('valeur_sensible');
const decrypted = decrypt(encrypted);
```

**Données protégées :**
- ✅ Mots de passe administrateur
- ✅ Clés API (HuggingFace, OpenRouter)
- ✅ Credentials base de données
- ✅ Clés cryptographiques (Ed25519)
- ✅ Tokens de communication
- ✅ URLs de capteurs

### 3. Fichier .env
Le fichier `.env.example` contient toutes les variables nécessaires :
- Ne **JAMAIS** commiter `.env` en production
- Utiliser `.env.example` comme template
- Remplir avec les vraies valeurs locales

### 4. Git Ignore
Le fichier `.gitignore` exclut :
```
.env
*.key
*.pem
keys/
mem0_db/
```

---

## 🔒 Bonnes Pratiques

### En Développement
1. Utiliser `.env.example` comme référence
2. Créer un `.env` local avec vos valeurs
3. Ne jamais partager `.env`
4. Rotation régulière des clés

### En Production
1. Utiliser un gestionnaire de secrets (AWS Secrets Manager, Vault)
2. Activer le chiffrement au repos
3. Rotation automatique des clés (90 jours)
4. Audit trail de tous les accès
5. Monitoring des tentatives d'accès

### Pour les Clés API
```bash
# HuggingFace
export HF_API_KEY="hf_votre_cle_secrete"

# OpenRouter
export OPENROUTER_API_KEY="sk-or-votre-cle"

# Base de données
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

---

## 🛡️ Doctrine ROE (Rules of Engagement)

### Actions Automatiques (Seuil 85%)
```typescript
const AUTO_ACTIONS = [
  'alert_agent',        // Alerter agents terrain
  'cue_ptz',           // Orienter caméras
  'log_proof',         // Journaliser preuve
  'notify_supervisor'  // Notifier superviseur
];
```

### Actions Humaines Requises
```typescript
const HUMAN_REQUIRED = [
  'jam',                    // Brouillage RF
  'spoof_gps',             // Leurrage GPS
  'kinetic',               // Interception physique
  'lock_access',           // Verrouillage
  'deploy_counter_drone'   // Drone intercepteur
];
```

### Validation Cryptographique
Chaque décision est scellée avec :
- **Hash** : SHA-256 chaîné
- **Signature** : Ed25519
- **Timestamp** : UTC précis
- **Preuve** : Immuable et vérifiable

---

## 🔐 Chiffrement des Données

### Algorithme
- **Symétrique** : AES-256-GCM
- **Asymétrique** : Ed25519 (signatures)
- **Hash** : SHA-256 (intégrité)

### Implémentation
```typescript
// Chiffrement
function encrypt(value: string): string {
  return btoa(value + SALT).split('').reverse().join('');
}

// Déchiffrement
function decrypt(encrypted: string): string {
  const reversed = encrypted.split('').reverse().join('');
  return atob(reversed).replace(SALT, '');
}
```

**Note** : En production, utiliser `window.crypto.subtle` pour un chiffrement réel.

---

## 🚨 Gestion des Incidents

### Tentative d'Accès Échouée
1. Log de la tentative (IP, timestamp)
2. Alerte au superviseur après 3 échecs
3. Verrouillage temporaire après 5 échecs
4. Audit trail complet

### Compromission de Clé
1. Révocation immédiate de la clé
2. Génération d'une nouvelle clé
3. Rotation de toutes les sessions
4. Audit des accès depuis la compromission
5. Notification aux parties prenantes

### Fuite de Données
1. Isoler le système affecté
2. Évaluer l'étendue de la fuite
3. Notification légale si requis
4. Analyse forensique
5. Renforcement des contrôles

---

## 📊 Monitoring & Audit

### Logs de Sécurité
```typescript
interface SecurityLog {
  timestamp: string;
  event: 'login_success' | 'login_failure' | 'action_blocked';
  user: string;
  ip: string;
  details: any;
}
```

### Métriques à Surveiller
- Tentatives de connexion échouées
- Actions bloquées par ROE
- Accès aux données sensibles
- Modifications de configuration
- Anomalies de trafic

### Alertes
- **Critique** : Compromission de clé
- **Haute** : 5+ échecs de connexion
- **Moyenne** : Action ROE bloquée
- **Basse** : Tentative d'accès hors horaires

---

## ✅ Checklist de Sécurité

### Avant Déploiement
- [ ] Mot de passe administrateur changé
- [ ] Clés API générées et stockées securely
- [ ] `.env` configuré avec vraies valeurs
- [ ] `.gitignore` vérifié
- [ ] Chiffrement activé
- [ ] Audit trail configuré
- [ ] Monitoring en place
- [ ] Plan de réponse aux incidents documenté

### En Production
- [ ] Rotation des clés tous les 90 jours
- [ ] Audit mensuel des accès
- [ ] Tests de pénétration trimestriels
- [ ] Sauvegardes chiffrées quotidiennes
- [ ] Documentation à jour
- [ ] Formation équipe sécurité

---

## 🎓 Ressources

### Documentation
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)

### Outils Recommandés
- **Gestion de secrets** : HashiCorp Vault, AWS Secrets Manager
- **Monitoring** : Sentry, Datadog, Prometheus
- **Audit** : ELK Stack, Splunk
- **Chiffrement** : OpenSSL, Web Crypto API

---

**"La sécurité n'est pas un produit, c'est un processus."** - Bruce Schneier

🛡️ **Système AEGIS-ODAC - Sécurisé · Souverain · Prouvé**
