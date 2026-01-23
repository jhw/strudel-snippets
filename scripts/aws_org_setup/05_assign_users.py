#!/usr/bin/env python3
"""
Assign users to accounts with permission sets.

Run this after 04_create_users.py

Creates assignments defined in config.ASSIGNMENTS.
Each assignment grants a user access to an account with a specific permission set.
"""

import boto3
from botocore.exceptions import ClientError

from config import REGION, ASSIGNMENTS


def get_sso_admin_client():
    return boto3.client("sso-admin", region_name=REGION)


def get_identity_store_client():
    return boto3.client("identitystore", region_name=REGION)


def get_organizations_client():
    return boto3.client("organizations", region_name=REGION)


def get_identity_center_instance(sso_client):
    """Get Identity Center instance ARN and identity store ID."""
    response = sso_client.list_instances()
    instances = response.get("Instances", [])

    if not instances:
        raise Exception("No Identity Center instance found.")

    instance = instances[0]
    return instance["InstanceArn"], instance["IdentityStoreId"]


def get_accounts_by_name(org_client):
    """Get dict of accounts by name."""
    accounts = {}
    paginator = org_client.get_paginator("list_accounts")
    for page in paginator.paginate():
        for account in page["Accounts"]:
            accounts[account["Name"]] = account
    return accounts


def get_users_by_name(identity_client, identity_store_id):
    """Get dict of users by username."""
    users = {}
    paginator = identity_client.get_paginator("list_users")
    for page in paginator.paginate(IdentityStoreId=identity_store_id):
        for user in page.get("Users", []):
            users[user["UserName"]] = user
    return users


def get_permission_sets_by_name(sso_client, instance_arn):
    """Get dict of permission sets by name."""
    permission_sets = {}
    paginator = sso_client.get_paginator("list_permission_sets")

    for page in paginator.paginate(InstanceArn=instance_arn):
        for ps_arn in page.get("PermissionSets", []):
            ps = sso_client.describe_permission_set(
                InstanceArn=instance_arn, PermissionSetArn=ps_arn
            )["PermissionSet"]
            permission_sets[ps["Name"]] = ps

    return permission_sets


def get_existing_assignments(sso_client, instance_arn, account_id, permission_set_arn):
    """Get existing assignments for an account/permission set combo."""
    assignments = []
    try:
        paginator = sso_client.get_paginator("list_account_assignments")
        for page in paginator.paginate(
            InstanceArn=instance_arn,
            AccountId=account_id,
            PermissionSetArn=permission_set_arn,
        ):
            assignments.extend(page.get("AccountAssignments", []))
    except ClientError:
        pass
    return assignments


def create_assignment(
    sso_client, instance_arn, account_id, permission_set_arn, user_id
):
    """Create account assignment for a user."""
    response = sso_client.create_account_assignment(
        InstanceArn=instance_arn,
        TargetId=account_id,
        TargetType="AWS_ACCOUNT",
        PermissionSetArn=permission_set_arn,
        PrincipalType="USER",
        PrincipalId=user_id,
    )
    return response["AccountAssignmentCreationStatus"]


def main():
    print("=" * 60)
    print("Identity Center User-Account Assignments")
    print("=" * 60)

    sso_client = get_sso_admin_client()
    identity_client = get_identity_store_client()
    org_client = get_organizations_client()

    # Get Identity Center instance
    instance_arn, identity_store_id = get_identity_center_instance(sso_client)
    print(f"\nInstance ARN: {instance_arn}")

    # Get lookup tables
    accounts = get_accounts_by_name(org_client)
    users = get_users_by_name(identity_client, identity_store_id)
    permission_sets = get_permission_sets_by_name(sso_client, instance_arn)

    print(f"Accounts: {list(accounts.keys())}")
    print(f"Users: {list(users.keys())}")
    print(f"Permission Sets: {list(permission_sets.keys())}")

    # Create each configured assignment
    created = []
    for assignment in ASSIGNMENTS:
        user_name = assignment["user_name"]
        account_name = assignment["account_name"]
        ps_name = assignment["permission_set"]

        # Validate references
        if user_name not in users:
            print(f"\n[ERROR] User '{user_name}' not found")
            continue
        if account_name not in accounts:
            print(f"\n[ERROR] Account '{account_name}' not found")
            continue
        if ps_name not in permission_sets:
            print(f"\n[ERROR] Permission set '{ps_name}' not found")
            continue

        user_id = users[user_name]["UserId"]
        account_id = accounts[account_name]["Id"]
        ps_arn = permission_sets[ps_name]["PermissionSetArn"]

        # Check if assignment already exists
        existing = get_existing_assignments(sso_client, instance_arn, account_id, ps_arn)
        already_assigned = any(a["PrincipalId"] == user_id for a in existing)

        if already_assigned:
            print(f"\n[SKIP] {user_name} -> {account_name} ({ps_name}) already exists")
            continue

        print(f"\n[CREATE] Assigning {user_name} -> {account_name} ({ps_name})...")

        try:
            status = create_assignment(
                sso_client, instance_arn, account_id, ps_arn, user_id
            )
            print(f"  Status: {status['Status']}")
            created.append(assignment)

        except ClientError as e:
            print(f"  ERROR: {e}")
            continue

    # Summary
    print("\n" + "=" * 60)
    print("Setup Complete!")
    print("=" * 60)

    print("\nUsers can now sign in at the SSO portal:")
    print("  https://<identity-store-id>.awsapps.com/start")
    print(f"  (Identity Store ID: {identity_store_id})")

    print("\nTo get the exact portal URL, go to:")
    print("  Identity Center console -> Settings -> Identity source")

    print("\n" + "=" * 60)

    return created


if __name__ == "__main__":
    main()
