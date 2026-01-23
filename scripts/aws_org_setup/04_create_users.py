#!/usr/bin/env python3
"""
Create users in Identity Center.

Run this after 03_setup_identity_center.py

Creates users defined in config.USERS.
Note: Users will need to set their password via email or console.
"""

import boto3
from botocore.exceptions import ClientError

from config import REGION, USERS


def get_sso_admin_client():
    return boto3.client("sso-admin", region_name=REGION)


def get_identity_store_client():
    return boto3.client("identitystore", region_name=REGION)


def get_identity_center_instance(sso_client):
    """Get Identity Center instance ARN and identity store ID."""
    response = sso_client.list_instances()
    instances = response.get("Instances", [])

    if not instances:
        raise Exception(
            "No Identity Center instance found. "
            "Please enable Identity Center in the AWS console first."
        )

    instance = instances[0]
    return instance["InstanceArn"], instance["IdentityStoreId"]


def get_existing_users(client, identity_store_id):
    """Get dict of existing users by username."""
    users = {}
    paginator = client.get_paginator("list_users")

    for page in paginator.paginate(IdentityStoreId=identity_store_id):
        for user in page.get("Users", []):
            users[user["UserName"]] = user

    return users


def create_user(client, identity_store_id, user_name, given_name, family_name, email):
    """Create a user in Identity Center."""
    response = client.create_user(
        IdentityStoreId=identity_store_id,
        UserName=user_name,
        DisplayName=f"{given_name} {family_name}",
        Name={"GivenName": given_name, "FamilyName": family_name},
        Emails=[{"Value": email, "Type": "Work", "Primary": True}],
    )
    return response


def main():
    print("=" * 60)
    print("Identity Center User Creation")
    print("=" * 60)

    sso_client = get_sso_admin_client()
    identity_client = get_identity_store_client()

    # Get Identity Center instance
    try:
        instance_arn, identity_store_id = get_identity_center_instance(sso_client)
    except Exception as e:
        print(f"\nERROR: {e}")
        return None

    print(f"\nIdentity Store ID: {identity_store_id}")

    # Get existing users
    existing = get_existing_users(identity_client, identity_store_id)
    print(f"Existing users: {list(existing.keys())}")

    # Create each configured user
    created = []
    for user_config in USERS:
        user_name = user_config["user_name"]
        given_name = user_config["given_name"]
        family_name = user_config["family_name"]
        email = user_config["email"]

        if user_name in existing:
            print(f"\n[SKIP] User '{user_name}' already exists:")
            print(f"  User ID: {existing[user_name]['UserId']}")
            created.append(existing[user_name])
            continue

        print(f"\n[CREATE] Creating user '{user_name}' ({email})...")

        try:
            response = create_user(
                identity_client,
                identity_store_id,
                user_name,
                given_name,
                family_name,
                email,
            )
            print(f"  User ID: {response['UserId']}")
            created.append({"UserId": response["UserId"], "UserName": user_name})

        except ClientError as e:
            print(f"  ERROR: {e}")
            continue

    # Summary
    print("\n" + "=" * 60)
    print("Summary - All Users:")
    print("=" * 60)

    all_users = get_existing_users(identity_client, identity_store_id)
    for user_name, user in all_users.items():
        print(f"  {user_name}: {user['UserId']}")

    print("\n" + "=" * 60)
    print("NOTE: Users need to set their password.")
    print("Go to Identity Center console -> Users -> Select user -> Reset password")
    print("\nNext step: Run 05_assign_users.py")
    print("=" * 60)

    return created


if __name__ == "__main__":
    main()
