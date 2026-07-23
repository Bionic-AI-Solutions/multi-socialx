/**
 * Load application configuration from HashiCorp Vault KV v2.
 *
 * Path convention (cluster standard):
 *   secret/data/t6-apps/<app-slug>/config
 *
 * Required env:
 *   VAULT_HOST                – primary (matches .env), e.g. https://vault.baisoln.com
 *   VAULT_ADDR                – optional alias (e.g. in-cluster http://vault.vault.svc…:8200)
 *   VAULT_TOKEN               – token with read on the app path
 *
 * Optional:
 *   VAULT_APP_SLUG            – defaults to "socialx"
 *   VAULT_SKIP_LOAD=true      – skip loading (tests / local .env-only)
 *
 * Vault keys are stored as lowercase_snake_case and mapped to UPPER_SNAKE
 * process.env keys (e.g. database_url → DATABASE_URL). Existing non-empty
 * environment variables are preserved (K8s / shell overrides win).
 */
const DEFAULT_APP_SLUG = 'socialx';

function resolveVaultHost(): string {
  // Prefer VAULT_HOST (.env convention); VAULT_ADDR is an accepted alias.
  return process.env.VAULT_HOST || process.env.VAULT_ADDR || '';
}

function normalizeVaultHost(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, '');
  if (!trimmed) {
    return trimmed;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function toEnvKey(vaultKey: string): string {
  return vaultKey.trim().toUpperCase();
}

export type LoadVaultConfigResult = {
  loaded: boolean;
  path: string;
  keysApplied: string[];
  skipped: string[];
};

export async function loadVaultConfig(): Promise<LoadVaultConfigResult> {
  const empty: LoadVaultConfigResult = {
    loaded: false,
    path: '',
    keysApplied: [],
    skipped: [],
  };

  if (process.env.VAULT_SKIP_LOAD === 'true') {
    return empty;
  }

  const hostRaw = resolveVaultHost();
  const token = process.env.VAULT_TOKEN || '';
  const slug = process.env.VAULT_APP_SLUG || DEFAULT_APP_SLUG;

  if (!hostRaw || !token) {
    return empty;
  }

  const vaultHost = normalizeVaultHost(hostRaw);
  const path = `secret/data/t6-apps/${slug}/config`;
  const url = `${vaultHost}/v1/${path}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-Vault-Token': token,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Vault GET ${path} failed (${response.status}): ${body.slice(0, 500)}`
    );
  }

  const payload = (await response.json()) as {
    data?: { data?: Record<string, unknown> };
  };
  const data = payload?.data?.data || {};

  const keysApplied: string[] = [];
  const skipped: string[] = [];

  for (const [vaultKey, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Do not inject the runtime token field back as a config key consumers expect.
    if (vaultKey === 'vault_token' || vaultKey === 'placeholder') {
      skipped.push(vaultKey);
      continue;
    }

    const envKey = toEnvKey(vaultKey);
    const asString = typeof value === 'string' ? value : String(value);

    if (process.env[envKey] !== undefined && process.env[envKey] !== '') {
      skipped.push(envKey);
      continue;
    }

    process.env[envKey] = asString;
    keysApplied.push(envKey);
  }

  return {
    loaded: true,
    path,
    keysApplied,
    skipped,
  };
}
