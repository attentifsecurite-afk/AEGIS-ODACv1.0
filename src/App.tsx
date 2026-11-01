import { useState, useEffect, useRef, useCallback } from 'react';
import { validateAdminPassword, config } from './secureConfig';

// ============================================
// TYPES & INTERFACES
// ============================================

type Screen = 'radar' | 'spectrum' | 'terrain' | 'analytics' | 'comms' | 'jarvis' | 'ai-core' | 'defense';

interface Threat {
  id: string;
  position: { lat: number; lon: number; alt: number };
  velocity: number;
  heading: number;
  classification: {
    type: string;
    confidence: number;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    category: string;
  };
  prediction: {
    time_to_go: number;
    miss_distance: number;
    confidence: number;
  };
  signature: {
    rf_detected: boolean;
    acoustic_score: number;
    visual_confirmed: boolean;
    fiber_constrained: boolean;
  };
  timestamp: number;
}

interface LogEntry {
  ts: number;
  type: string;
  msg: string;
  color: string;
}

// ============================================
// LOGIN SCREEN
// ============================================

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (validateAdminPassword(password)) {
        onLogin();
      } else {
        setError('Accès refusé - Authentification échouée');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-tac-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-tac-cyan/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tac-purple/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-strong border-2 border-tac-cyan/30 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-tac-cyan/20 to-tac-purple/20 border-2 border-tac-cyan/50 mb-4">
              <span className="text-4xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-tac-cyan to-tac-purple bg-clip-text text-transparent mb-2">
              AEGIS-ODAC
            </h1>
            <p className="text-sm text-tac-dim">Système de Défense Cognitif Multi-Domaines</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-tac-green animate-pulse"></div>
              <span className="text-xs text-tac-green font-bold">SYSTÈME OPÉRATIONNEL</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-tac-text mb-2">
                🔐 Authentification Administrateur
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 bg-tac-bg border-2 border-tac-border rounded-lg text-tac-text placeholder-tac-dim focus:outline-none focus:border-tac-cyan transition-all"
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 bg-tac-red/10 border border-tac-red/30 rounded-lg text-sm text-tac-red">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 bg-gradient-to-r from-tac-cyan to-tac-purple text-white font-bold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Vérification...
                </span>
              ) : (
                'ACCÉDER AU SYSTÈME'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-tac-border">
            <div className="text-xs text-tac-dim text-center space-y-2">
              <p>🔒 Connexion sécurisée - Accès restreint</p>
              <p className="text-[10px]">
                Doctrine: PASSIF · LÉGAL · SOUVERAIN · PREUVE SIGNÉE
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-tac-dim">
          <p>AEGIS-ODAC v1.0 · © 2026</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [screen, setScreen] = useState<Screen>('radar');
  const [threats, setThreats] = useState<Threat[]>([]);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [eventCount, setEventCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [proofCount, setProofCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Threat simulation
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const newThreat: Threat = {
        id: `T-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
        position: {
          lat: 48.8566 + (Math.random() - 0.5) * 0.01,
          lon: 2.3522 + (Math.random() - 0.5) * 0.01,
          alt: 50 + Math.random() * 150
        },
        velocity: 10 + Math.random() * 30,
        heading: Math.random() * Math.PI * 2,
        classification: {
          type: ['drone_fpv', 'drone_fiber', 'drone_commercial'][Math.floor(Math.random() * 3)],
          confidence: 0.5 + Math.random() * 0.45,
          severity: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'][Math.floor(Math.random() * 4)] as any,
          category: 'INTRUSION'
        },
        prediction: {
          time_to_go: 30 + Math.random() * 120,
          miss_distance: Math.random() * 500,
          confidence: 0.6 + Math.random() * 0.35
        },
        signature: {
          rf_detected: Math.random() > 0.3,
          acoustic_score: 0.3 + Math.random() * 0.6,
          visual_confirmed: Math.random() > 0.4,
          fiber_constrained: Math.random() > 0.9
        },
        timestamp: Date.now()
      };

      setThreats(prev => [...prev.slice(-19), newThreat]);
      setEventCount(prev => prev + 1);

      if (newThreat.classification.severity === 'CRITICAL') {
        setAlertCount(prev => prev + 1);
      }

      setProofCount(prev => prev + 1);

      setLog(prev => [...prev.slice(-99), {
        ts: Date.now(),
        type: 'detection',
        msg: `[${newThreat.classification.severity}] ${newThreat.id} - ${newThreat.classification.type}`,
        color: newThreat.classification.severity === 'CRITICAL' ? '#ff2244' : '#00ff88'
      }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const now = new Date();
  const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-tac-bg relative">
      {/* Animated background */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-tac-cyan/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-tac-purple/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-tac-cyan/20 glass-strong shrink-0 relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-tac-cyan to-tac-purple flex items-center justify-center neon-cyan">
                <span className="text-xl">🛡️</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-tac-green animate-pulse border-2 border-tac-bg"></div>
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-tac-cyan to-tac-purple bg-clip-text text-transparent">AEGIS-ODAC</span>
              <div className="text-[10px] text-tac-dim">v1.0 · DEFENSE SYSTEM</div>
            </div>
          </div>
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-tac-cyan/30 to-transparent"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tac-green animate-pulse"></div>
            <span className="text-sm text-tac-green font-semibold">SYSTEM ACTIVE</span>
          </div>
          <div className="h-8 w-px bg-gradient-to-b from-transparent via-tac-cyan/30 to-transparent"></div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-tac-cyan animate-pulse"></div>
            <span className="text-sm text-tac-cyan font-semibold">JARVIS ONLINE</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-tac-surface/50 border border-tac-cyan/20">
            <span className="text-xs text-tac-dim">UTC</span>
            <span className="text-sm font-mono font-bold text-tac-cyan">{timeStr}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-tac-dim uppercase tracking-wider">Events</span>
              <span className="text-xl font-bold text-tac-green font-mono">{eventCount}</span>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-tac-cyan/30 to-transparent"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-tac-dim uppercase tracking-wider">Alerts</span>
              <span className={`text-xl font-bold font-mono ${alertCount > 0 ? 'text-tac-red neon-red' : 'text-tac-dim'}`}>{alertCount}</span>
            </div>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-tac-cyan/30 to-transparent"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-tac-dim uppercase tracking-wider">Proofs</span>
              <span className="text-xl font-bold text-tac-purple font-mono">{proofCount}</span>
            </div>
          </div>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold border-2 transition-all ${
              isRunning 
                ? 'bg-tac-green/10 text-tac-green border-tac-green/50 hover:bg-tac-green/20 neon-green' 
                : 'bg-tac-red/10 text-tac-red border-tac-red/50 hover:bg-tac-red/20 neon-red'
            }`}
          >
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-tac-green animate-pulse' : 'bg-tac-red'}`}></span>
              {isRunning ? 'LIVE' : 'PAUSE'}
            </span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="h-14 flex items-center gap-2 px-6 border-b border-tac-cyan/20 glass shrink-0 relative z-10">
        {[
          { id: 'radar' as Screen, label: 'RADAR', icon: '◎' },
          { id: 'spectrum' as Screen, label: 'SPECTRUM', icon: '≋' },
          { id: 'terrain' as Screen, label: 'TERRAIN', icon: '△' },
          { id: 'analytics' as Screen, label: 'ANALYTICS', icon: '◇' },
          { id: 'comms' as Screen, label: 'COMMS', icon: '⚡' },
          { id: 'jarvis' as Screen, label: 'J.A.R.V.I.S', icon: '🤖' },
          { id: 'ai-core' as Screen, label: 'AI CORE', icon: '🧠' },
          { id: 'defense' as Screen, label: 'DEFENSE', icon: '🛡️' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.id)}
            className={`px-6 py-2.5 text-sm font-bold rounded-lg transition-all relative overflow-hidden group ${
              screen === tab.id
                ? 'bg-gradient-to-r from-tac-cyan/20 to-tac-purple/20 text-tac-cyan border border-tac-cyan/50 neon-cyan'
                : 'text-tac-dim hover:text-tac-text border border-transparent hover:border-tac-cyan/20 hover:bg-tac-cyan/5'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        <div className="flex-1 p-6 overflow-y-auto">
          {screen === 'radar' && (
            <div className="h-full flex gap-6">
              <div className="flex-1 glass rounded-xl p-6">
                <h2 className="text-xl font-bold text-tac-cyan mb-4">RADAR TACTIQUE</h2>
                <div className="h-[calc(100%-4rem)] flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">📡</div>
                    <div className="text-tac-text">Radar 360° actif</div>
                    <div className="text-tac-dim text-sm mt-2">{threats.length} tracks détectés</div>
                  </div>
                </div>
              </div>
              <div className="w-96 glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-tac-cyan mb-4">TRACKS ACTIFS</h3>
                <div className="space-y-2 overflow-y-auto max-h-[calc(100%-3rem)]">
                  {threats.slice(-10).reverse().map(threat => (
                    <div key={threat.id} className="p-3 bg-tac-bg/50 rounded-lg border border-tac-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-tac-text">{threat.id}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          threat.classification.severity === 'CRITICAL' ? 'bg-tac-red/20 text-tac-red' :
                          threat.classification.severity === 'HIGH' ? 'bg-tac-amber/20 text-tac-amber' :
                          'bg-tac-cyan/20 text-tac-cyan'
                        }`}>
                          {threat.classification.severity}
                        </span>
                      </div>
                      <div className="text-xs text-tac-dim">{threat.classification.type}</div>
                      <div className="text-xs text-tac-dim mt-1">
                        Confiance: {(threat.classification.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {screen === 'spectrum' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">SPECTRE RF</h2>
              <div className="h-[calc(100%-4rem)] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <div className="text-tac-text">Analyse spectrale 2.4GHz - 5.8GHz</div>
                  <div className="text-tac-dim text-sm mt-2">Waterfall temps réel</div>
                </div>
              </div>
            </div>
          )}

          {screen === 'terrain' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">VÉRITÉ TERRAIN</h2>
              <div className="h-[calc(100%-4rem)] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🏔️</div>
                  <div className="text-tac-text">Jumeau numérique 3D du site</div>
                  <div className="text-tac-dim text-sm mt-2">48.8566°N, 2.3522°E</div>
                </div>
              </div>
            </div>
          )}

          {screen === 'analytics' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">ANALYTICS</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-tac-bg/50 rounded-lg p-4 border border-tac-border">
                  <div className="text-3xl font-bold text-tac-green">{eventCount}</div>
                  <div className="text-sm text-tac-dim">Événements totaux</div>
                </div>
                <div className="bg-tac-bg/50 rounded-lg p-4 border border-tac-border">
                  <div className="text-3xl font-bold text-tac-red">{alertCount}</div>
                  <div className="text-sm text-tac-dim">Alertes critiques</div>
                </div>
                <div className="bg-tac-bg/50 rounded-lg p-4 border border-tac-border">
                  <div className="text-3xl font-bold text-tac-purple">{proofCount}</div>
                  <div className="text-sm text-tac-dim">Preuves scellées</div>
                </div>
              </div>
            </div>
          )}

          {screen === 'comms' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">COMMUNICATIONS</h2>
              <div className="h-[calc(100%-4rem)] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">📡</div>
                  <div className="text-tac-text">Réseau mesh LoRa actif</div>
                  <div className="text-tac-dim text-sm mt-2">4 nœuds connectés</div>
                </div>
              </div>
            </div>
          )}

          {screen === 'jarvis' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">J.A.R.V.I.S</h2>
              <div className="h-[calc(100%-4rem)] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <div className="text-tac-text">Assistant IA tactique</div>
                  <div className="text-tac-dim text-sm mt-2">7 modèles actifs</div>
                </div>
              </div>
            </div>
          )}

          {screen === 'ai-core' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">AI CORE</h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(config.models).map(([key, model]) => (
                  <div key={key} className="bg-tac-bg/50 rounded-lg p-4 border border-tac-border">
                    <div className="text-sm text-tac-dim uppercase">{key}</div>
                    <div className="text-tac-text font-mono text-sm mt-1">{model}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {screen === 'defense' && (
            <div className="h-full glass rounded-xl p-6">
              <h2 className="text-xl font-bold text-tac-cyan mb-4">SYSTÈME DE DÉFENSE</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-tac-bg/50 rounded-lg p-4 border border-tac-border">
                  <h3 className="text-lg font-bold text-tac-red mb-3">MENACES ACTIVES</h3>
                  <div className="text-4xl font-bold text-tac-red">{threats.length}</div>
                  <div className="text-sm text-tac-dim mt-2">Tracks détectés</div>
                </div>
                <div className="bg-tac-bg/50 rounded-lg p-4 border border-tac-border">
                  <h3 className="text-lg font-bold text-tac-amber mb-3">PRÉDICTION</h3>
                  <div className="text-4xl font-bold text-tac-amber">
                    {threats.length > 0 ? `${threats[threats.length - 1].prediction.time_to_go.toFixed(0)}s` : '--'}
                  </div>
                  <div className="text-sm text-tac-dim mt-2">Temps jusqu'à impact</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Log Panel */}
        <div className="w-96 border-l border-tac-cyan/20 glass flex flex-col">
          <div className="px-4 py-3 border-b border-tac-cyan/20">
            <h3 className="text-sm font-bold text-tac-cyan">BUS ÉVÉNEMENTS · ZeroMQ</h3>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1">
            {log.map((entry, i) => (
              <div key={i} className="text-xs p-2 rounded bg-tac-bg/30 hover:bg-tac-bg/50 transition-colors">
                <span className="text-tac-dim">
                  {new Date(entry.ts).toLocaleTimeString('fr-FR', { hour12: false })}
                </span>{' '}
                <span style={{ color: entry.color }}>{entry.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="h-12 flex items-center justify-between px-8 border-t border-tac-cyan/20 glass-strong shrink-0 text-sm relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-tac-cyan">🤖</span>
            <span className="text-tac-text">JARVIS</span>
          </div>
          <div className="h-4 w-px bg-tac-cyan/20"></div>
          <div className="flex items-center gap-2">
            <span className="text-tac-purple">🧠</span>
            <span className="text-tac-text">7 AI Models</span>
          </div>
          <div className="h-4 w-px bg-tac-cyan/20"></div>
          <div className="flex items-center gap-2">
            <span className="text-tac-green">🛡️</span>
            <span className="text-tac-text">Guardrails</span>
          </div>
          <div className="h-4 w-px bg-tac-cyan/20"></div>
          <div className="flex items-center gap-2">
            <span className="text-tac-amber">🔐</span>
            <span className="text-tac-text">Ed25519</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-xs text-tac-dim">
            <span className="text-tac-cyan font-semibold">PASSIVE</span> · <span className="text-tac-green font-semibold">LEGAL</span> · <span className="text-tac-purple font-semibold">SOVEREIGN</span> · <span className="text-tac-amber font-semibold">PROVEN</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isRunning ? 'bg-tac-green/10 border border-tac-green/30' : 'bg-tac-red/10 border border-tac-red/30'}`}>
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-tac-green animate-pulse' : 'bg-tac-red'}`}></span>
            <span className={`text-xs font-bold ${isRunning ? 'text-tac-green' : 'text-tac-red'}`}>
              {isRunning ? 'OPERATIONAL' : 'PAUSED'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
