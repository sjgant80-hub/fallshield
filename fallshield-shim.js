// ═══════════════════════════════════════════════════════════════════
//  fallshield-shim.js · sovereign Ed25519 identity · ◊·κ=1
//  Drop into any sovereign tool. Provides:
//    window.FallShield.generate()  → { publicKey, secretKey } (base64)
//    window.FallShield.sign(msg, secretKey) → signature (base64)
//    window.FallShield.verify(msg, signature, publicKey) → boolean
//    window.FallShield.identityCard(name, publicKey) → JSON card to publish
//  All crypto via WebCrypto · Ed25519. No external deps.
//  MIT · part of AI Native Solutions
// ═══════════════════════════════════════════════════════════════════
(function(){
  if (window.FallShield) return;
  const VERSION = '1.0.0';

  const b64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  async function generate(){
    const kp = await crypto.subtle.generateKey({ name: 'Ed25519' }, true, ['sign','verify']);
    const pub = await crypto.subtle.exportKey('raw', kp.publicKey);
    const sec = await crypto.subtle.exportKey('pkcs8', kp.privateKey);
    return { publicKey: b64(pub), secretKey: b64(sec), created: new Date().toISOString() };
  }

  async function _importPriv(b64Sec){
    return await crypto.subtle.importKey('pkcs8', unb64(b64Sec).buffer, { name: 'Ed25519' }, false, ['sign']);
  }
  async function _importPub(b64Pub){
    return await crypto.subtle.importKey('raw', unb64(b64Pub).buffer, { name: 'Ed25519' }, false, ['verify']);
  }

  async function sign(message, b64Secret){
    const key = await _importPriv(b64Secret);
    const data = typeof message === 'string' ? new TextEncoder().encode(message) : message;
    const sig = await crypto.subtle.sign({ name: 'Ed25519' }, key, data);
    return b64(sig);
  }

  async function verify(message, b64Sig, b64Pub){
    try {
      const key = await _importPub(b64Pub);
      const data = typeof message === 'string' ? new TextEncoder().encode(message) : message;
      return await crypto.subtle.verify({ name: 'Ed25519' }, key, unb64(b64Sig).buffer, data);
    } catch { return false; }
  }

  function identityCard(name, publicKey, meta = {}){
    return {
      kind: 'fallshield/identity',
      v: VERSION,
      name,
      publicKey,
      issued: new Date().toISOString(),
      seal: '◊·κ=1',
      prime: 283,
      ...meta,
    };
  }

  async function fingerprint(publicKey){
    const buf = unb64(publicKey);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return b64(hash).slice(0, 16);
  }

  window.FallShield = { version: VERSION, generate, sign, verify, identityCard, fingerprint };
})();
