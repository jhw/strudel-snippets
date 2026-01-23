# AWS Organization Setup Guide

From zero to user-in-sub-account via Identity Center. Fastest path with minimal console work.

## Quick Start with Scripts

After completing Phase 1 (console setup), use the boto3 scripts in `scripts/aws_org_setup/`:

```bash
# Install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Edit config first
vi scripts/aws_org_setup/config.py

# Run in order
cd scripts/aws_org_setup
python 01_create_organization.py
python 02_create_accounts.py
# >>> Enable Identity Center in console (one-time) <<<
python 03_setup_identity_center.py
python 04_create_users.py
python 05_assign_users.py
```

---

## Phase 1: Root Account (Console - One Time)

### 1.1 Create AWS Account
1. Go to https://aws.amazon.com → Create Account
2. Use a **group email** for root (e.g., `aws-root@yourdomain.com`) - you can't change this later
3. Complete signup with payment method

### 1.2 Secure Root Account
1. Sign in as root
2. Go to **IAM** → **Security credentials** (top-right dropdown → Security credentials)
3. **MFA** → Assign MFA device → Follow prompts (use authenticator app)
4. **Do NOT create access keys for root** - ever

### 1.3 Create IAM Admin User (Console Bootstrap)
This is the last console work before going programmatic.

1. Go to **IAM** → **Users** → **Create user**
2. Username: `admin` (or your name)
3. Check **Provide user access to the AWS Management Console** (optional but useful)
4. **Attach policies directly** → Select `AdministratorAccess`
5. Create user
6. Go to the user → **Security credentials** → **Create access key**
7. Select **Command Line Interface (CLI)**
8. Download/save the credentials

### 1.4 Configure CLI
```bash
aws configure
# Enter Access Key ID
# Enter Secret Access Key
# Region: us-east-1 (or your preferred, but Identity Center needs a region)
# Output: json
```

Verify:
```bash
aws sts get-caller-identity
```

---

## Phase 2: AWS Organizations (CLI)

### 2.1 Create Organization
```bash
aws organizations create-organization --feature-set ALL
```

Verify:
```bash
aws organizations describe-organization
```

### 2.2 Create Sub-Account(s)
```bash
aws organizations create-account \
  --account-name "dev" \
  --email "aws-dev@yourdomain.com"
```

**Important:** Each account needs a unique email. Use `+` aliases if needed: `aws+dev@yourdomain.com`

Check creation status (takes 1-2 minutes):
```bash
aws organizations list-accounts
```

Note the **Account ID** of the new account - you'll need it later.

```bash
# Save it to a variable
DEV_ACCOUNT_ID=$(aws organizations list-accounts \
  --query "Accounts[?Name=='dev'].Id" \
  --output text)
echo $DEV_ACCOUNT_ID
```

---

## Phase 3: Identity Center (Console + CLI)

### 3.1 Enable Identity Center (Console - Required)
**This step cannot be done via CLI** - one-time console requirement.

1. Go to **IAM Identity Center** (search in console)
2. Click **Enable**
3. Choose your region (recommend same as your org, often `us-east-1`)
4. Use **Identity Center directory** (built-in) for simplest setup

Note the **Instance ARN** and **Identity Store ID** - you'll need these:
- Find them in Identity Center → **Settings** → **Identity source**

```bash
# Set these as variables
INSTANCE_ARN="arn:aws:sso:::instance/ssoins-xxxxxxxxx"
IDENTITY_STORE_ID="d-xxxxxxxxxx"
```

Or retrieve programmatically:
```bash
INSTANCE_ARN=$(aws sso-admin list-instances \
  --query "Instances[0].InstanceArn" \
  --output text)
IDENTITY_STORE_ID=$(aws sso-admin list-instances \
  --query "Instances[0].IdentityStoreId" \
  --output text)

echo "Instance ARN: $INSTANCE_ARN"
echo "Identity Store ID: $IDENTITY_STORE_ID"
```

### 3.2 Create Permission Set (CLI)
Permission sets define what access users get when they assume a role in an account.

```bash
# Create an admin permission set
aws sso-admin create-permission-set \
  --instance-arn "$INSTANCE_ARN" \
  --name "AdministratorAccess" \
  --description "Full admin access" \
  --session-duration "PT8H"
```

Get the Permission Set ARN:
```bash
PERMISSION_SET_ARN=$(aws sso-admin list-permission-sets \
  --instance-arn "$INSTANCE_ARN" \
  --query "PermissionSets[0]" \
  --output text)
echo $PERMISSION_SET_ARN
```

Attach the AWS managed policy:
```bash
aws sso-admin attach-managed-policy-to-permission-set \
  --instance-arn "$INSTANCE_ARN" \
  --permission-set-arn "$PERMISSION_SET_ARN" \
  --managed-policy-arn "arn:aws:iam::aws:policy/AdministratorAccess"
```

### 3.3 Create User in Identity Center (CLI)
```bash
aws identitystore create-user \
  --identity-store-id "$IDENTITY_STORE_ID" \
  --user-name "jsmith" \
  --display-name "John Smith" \
  --name "GivenName=John,FamilyName=Smith" \
  --emails "Value=jsmith@yourdomain.com,Type=Work,Primary=true"
```

Get the User ID:
```bash
USER_ID=$(aws identitystore list-users \
  --identity-store-id "$IDENTITY_STORE_ID" \
  --query "Users[?UserName=='jsmith'].UserId" \
  --output text)
echo $USER_ID
```

### 3.4 Assign User to Account (CLI)
This grants the user access to the sub-account with the permission set:

```bash
aws sso-admin create-account-assignment \
  --instance-arn "$INSTANCE_ARN" \
  --target-id "$DEV_ACCOUNT_ID" \
  --target-type AWS_ACCOUNT \
  --permission-set-arn "$PERMISSION_SET_ARN" \
  --principal-type USER \
  --principal-id "$USER_ID"
```

Verify:
```bash
aws sso-admin list-account-assignments \
  --instance-arn "$INSTANCE_ARN" \
  --account-id "$DEV_ACCOUNT_ID" \
  --permission-set-arn "$PERMISSION_SET_ARN"
```

---

## Phase 4: User Login

### 4.1 Get the SSO Portal URL
```bash
aws sso-admin list-instances \
  --query "Instances[0].IdentityStoreId" \
  --output text

# The portal URL is shown in Identity Center console → Settings → Identity source
# Format: https://d-xxxxxxxxxx.awsapps.com/start
```

### 4.2 Set User Password
New users need a password. Do this via console or:

```bash
# This sends a setup email to the user
# Or set password directly (console only for initial password)
```

**Note:** Initial password setup typically requires console or email verification flow. The user will receive an email to set up their password.

### 4.3 User Signs In
1. User goes to SSO portal URL: `https://d-xxxxxxxxxx.awsapps.com/start`
2. Signs in with username + password
3. Sees available accounts and roles
4. Clicks on account → "AdministratorAccess" → Console or CLI credentials

---

## Phase 5: CLI Access for SSO Users

### 5.1 Configure AWS CLI for SSO
The user runs:
```bash
aws configure sso
# SSO start URL: https://d-xxxxxxxxxx.awsapps.com/start
# SSO Region: us-east-1 (or your region)
# Browser opens for authentication
# Select account and role
# CLI profile name: dev-admin (or whatever)
```

### 5.2 Use the Profile
```bash
aws s3 ls --profile dev-admin

# Or set default
export AWS_PROFILE=dev-admin
aws s3 ls
```

### 5.3 Refresh SSO Session
```bash
aws sso login --profile dev-admin
```

---

## Quick Reference: All Variables

```bash
# Set these up front after console steps
INSTANCE_ARN="arn:aws:sso:::instance/ssoins-xxxxxxxxx"
IDENTITY_STORE_ID="d-xxxxxxxxxx"
DEV_ACCOUNT_ID="123456789012"
PERMISSION_SET_ARN="arn:aws:sso:::permissionSet/ssoins-xxx/ps-xxx"
USER_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

---

## Troubleshooting

### "You must enable IAM Identity Center first"
→ Complete Phase 3.1 in console

### "Account creation in progress"
→ Wait 1-2 minutes, `create-account` is async

### User can't log in
→ Check they've set their password via email link

### Permission set not working
→ Ensure managed policy is attached (step 3.2)

### "Access Denied" on sso-admin commands
→ Ensure you're using the admin IAM user, not root
