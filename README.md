# ◊ fallshield · sovereign Ed25519 identity

**Prove it's really you. Sign your tools, verify any signature, defend against impersonation.**

[**Live**](https://sjgant80-hub.github.io/fallshield/) · [Shim](./fallshield-shim.js) · MIT · ◊·κ=1 · prime 283

## Use

```html
<script src="https://sjgant80-hub.github.io/fallshield/fallshield-shim.js"></script>
<script>
  const kp = await FallShield.generate();
  const sig = await FallShield.sign('my tool v1.0', kp.secretKey);
  const ok = await FallShield.verify('my tool v1.0', sig, kp.publicKey);
</script>
```

## The pattern

1. Generate a master keypair once. Secret half → cold storage (paper + fallvault).
2. Publish your public key + identity card at your hub: `your-hub.com/.fallshield-identity.json`
3. Sign every tool, release, post you want attributed to you.
4. Anyone fetches your card, grabs the public key, verifies any signed artifact.
5. Impersonators can't fake the signature without your secret key.

## Mesh with Konomi

Konomi (already in your estate) signs *actions* inside tools. fallshield signs *the tools* and *your identity*. Compound effect.

## License

MIT · part of [AI Native Solutions](https://www.ai-nativesolutions.com) · ◊·κ=1
