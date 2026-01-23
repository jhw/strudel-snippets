# AWS Organization Setup Configuration
# Edit these values before running the setup scripts

# Region for Identity Center (must match where you enabled it in console)
REGION = "us-east-1"

# Sub-accounts to create
# Each account needs a unique email address
ACCOUNTS = [
    {"name": "dev", "email": "aws+dev@yourdomain.com"},
    {"name": "staging", "email": "aws+staging@yourdomain.com"},
    {"name": "prod", "email": "aws+prod@yourdomain.com"},
]

# Users to create in Identity Center
USERS = [
    {
        "user_name": "jsmith",
        "given_name": "John",
        "family_name": "Smith",
        "email": "jsmith@yourdomain.com",
    },
]

# Permission sets to create
# These define what access users get when assigned to an account
PERMISSION_SETS = [
    {
        "name": "AdministratorAccess",
        "description": "Full admin access",
        "managed_policies": ["arn:aws:iam::aws:policy/AdministratorAccess"],
        "session_duration": "PT8H",
    },
    {
        "name": "ReadOnlyAccess",
        "description": "Read-only access",
        "managed_policies": ["arn:aws:iam::aws:policy/ReadOnlyAccess"],
        "session_duration": "PT8H",
    },
]

# User-to-account assignments
# Maps users to accounts with specific permission sets
ASSIGNMENTS = [
    {"user_name": "jsmith", "account_name": "dev", "permission_set": "AdministratorAccess"},
    {"user_name": "jsmith", "account_name": "staging", "permission_set": "ReadOnlyAccess"},
]
