# Security

Volleycraft is currently a private validation-phase project.

## Reporting

Report suspected vulnerabilities or leaked secrets directly to the repository owner through the private project channel you already use for Volleycraft work. Do not open public issues with exploit details or credentials.

## Secret Handling

- Local app development and tests do not require secrets.
- Deploy credentials such as `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` belong in GitHub Actions secrets or Cloudflare settings, not in source files.
- Keep local `.env` files untracked. Use `.env.example` only for placeholder names and setup notes.
