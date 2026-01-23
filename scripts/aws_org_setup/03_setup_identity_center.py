#!/usr/bin/env python3
"""
Setup Identity Center permission sets.

Run this after:
1. 02_create_accounts.py
2. Identity Center enabled in console (one-time manual step)

Creates permission sets defined in config.PERMISSION_SETS.
"""

import boto3
from botocore.exceptions import ClientError

from config import REGION, PERMISSION_SETS


def get_sso_admin_client():
    return boto3.client("sso-admin", region_name=REGION)


def get_identity_center_instance(client):
    """Get Identity Center instance ARN and identity store ID."""
    response = client.list_instances()
    instances = response.get("Instances", [])

    if not instances:
        raise Exception(
            "No Identity Center instance found. "
            "Please enable Identity Center in the AWS console first."
        )

    instance = instances[0]
    return instance["InstanceArn"], instance["IdentityStoreId"]


def get_existing_permission_sets(client, instance_arn):
    """Get dict of existing permission sets by name."""
    permission_sets = {}
    paginator = client.get_paginator("list_permission_sets")

    for page in paginator.paginate(InstanceArn=instance_arn):
        for ps_arn in page.get("PermissionSets", []):
            ps = client.describe_permission_set(
                InstanceArn=instance_arn, PermissionSetArn=ps_arn
            )["PermissionSet"]
            permission_sets[ps["Name"]] = ps

    return permission_sets


def create_permission_set(client, instance_arn, name, description, session_duration):
    """Create a permission set."""
    response = client.create_permission_set(
        InstanceArn=instance_arn,
        Name=name,
        Description=description,
        SessionDuration=session_duration,
    )
    return response["PermissionSet"]


def attach_managed_policy(client, instance_arn, permission_set_arn, policy_arn):
    """Attach AWS managed policy to permission set."""
    client.attach_managed_policy_to_permission_set(
        InstanceArn=instance_arn,
        PermissionSetArn=permission_set_arn,
        ManagedPolicyArn=policy_arn,
    )


def main():
    print("=" * 60)
    print("Identity Center Permission Sets Setup")
    print("=" * 60)

    client = get_sso_admin_client()

    # Get Identity Center instance
    try:
        instance_arn, identity_store_id = get_identity_center_instance(client)
    except Exception as e:
        print(f"\nERROR: {e}")
        print("\nPlease enable Identity Center in the AWS console:")
        print("1. Go to IAM Identity Center")
        print("2. Click 'Enable'")
        print("3. Choose your region")
        print("4. Re-run this script")
        return None

    print(f"\nIdentity Center Instance:")
    print(f"  Instance ARN: {instance_arn}")
    print(f"  Identity Store ID: {identity_store_id}")

    # Get existing permission sets
    existing = get_existing_permission_sets(client, instance_arn)
    print(f"\nExisting permission sets: {list(existing.keys())}")

    # Create each configured permission set
    created = []
    for ps_config in PERMISSION_SETS:
        name = ps_config["name"]
        description = ps_config["description"]
        managed_policies = ps_config["managed_policies"]
        session_duration = ps_config["session_duration"]

        if name in existing:
            print(f"\n[SKIP] Permission set '{name}' already exists:")
            print(f"  ARN: {existing[name]['PermissionSetArn']}")
            created.append(existing[name])
            continue

        print(f"\n[CREATE] Creating permission set '{name}'...")

        try:
            ps = create_permission_set(
                client, instance_arn, name, description, session_duration
            )
            print(f"  ARN: {ps['PermissionSetArn']}")

            # Attach managed policies
            for policy_arn in managed_policies:
                print(f"  Attaching policy: {policy_arn}")
                attach_managed_policy(
                    client, instance_arn, ps["PermissionSetArn"], policy_arn
                )

            created.append(ps)

        except ClientError as e:
            print(f"  ERROR: {e}")
            continue

    # Summary
    print("\n" + "=" * 60)
    print("Summary - All Permission Sets:")
    print("=" * 60)

    all_ps = get_existing_permission_sets(client, instance_arn)
    for name, ps in all_ps.items():
        print(f"  {name}: {ps['PermissionSetArn']}")

    print("\n" + "=" * 60)
    print("Next step: Run 04_create_users.py")
    print("=" * 60)

    return created


if __name__ == "__main__":
    main()
