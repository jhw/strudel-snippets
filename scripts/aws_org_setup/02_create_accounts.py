#!/usr/bin/env python3
"""
Create sub-accounts in AWS Organization.

Run this after 01_create_organization.py

Creates accounts defined in config.ACCOUNTS. Account creation is async -
this script polls until all accounts are ready.
"""

import time
import boto3
from botocore.exceptions import ClientError

from config import REGION, ACCOUNTS


def get_organizations_client():
    return boto3.client("organizations", region_name=REGION)


def get_existing_accounts(client):
    """Get dict of existing accounts by name."""
    accounts = {}
    paginator = client.get_paginator("list_accounts")
    for page in paginator.paginate():
        for account in page["Accounts"]:
            accounts[account["Name"]] = account
    return accounts


def create_account(client, name, email):
    """Create account and return creation request ID."""
    response = client.create_account(
        AccountName=name,
        Email=email,
    )
    return response["CreateAccountStatus"]


def wait_for_account_creation(client, request_id, timeout=120):
    """Poll until account creation completes."""
    start = time.time()
    while time.time() - start < timeout:
        response = client.describe_create_account_status(
            CreateAccountRequestId=request_id
        )
        status = response["CreateAccountStatus"]

        if status["State"] == "SUCCEEDED":
            return status
        elif status["State"] == "FAILED":
            raise Exception(
                f"Account creation failed: {status.get('FailureReason', 'Unknown')}"
            )

        print(f"  Status: {status['State']}... waiting")
        time.sleep(5)

    raise Exception(f"Account creation timed out after {timeout}s")


def main():
    print("=" * 60)
    print("AWS Sub-Account Creation")
    print("=" * 60)

    client = get_organizations_client()

    # Get existing accounts
    existing = get_existing_accounts(client)
    print(f"\nExisting accounts: {list(existing.keys())}")

    # Create each configured account
    created = []
    for account_config in ACCOUNTS:
        name = account_config["name"]
        email = account_config["email"]

        if name in existing:
            print(f"\n[SKIP] Account '{name}' already exists:")
            print(f"  ID: {existing[name]['Id']}")
            created.append(existing[name])
            continue

        print(f"\n[CREATE] Creating account '{name}' ({email})...")

        try:
            status = create_account(client, name, email)
            print(f"  Request ID: {status['Id']}")

            # Wait for completion
            final_status = wait_for_account_creation(client, status["Id"])
            print(f"  Account ID: {final_status['AccountId']}")
            print(f"  State: {final_status['State']}")

            # Fetch full account info
            account = client.describe_account(AccountId=final_status["AccountId"])
            created.append(account["Account"])

        except ClientError as e:
            print(f"  ERROR: {e}")
            continue

    # Summary
    print("\n" + "=" * 60)
    print("Summary - All Accounts:")
    print("=" * 60)

    all_accounts = get_existing_accounts(client)
    for name, account in all_accounts.items():
        print(f"  {name}: {account['Id']} ({account['Email']})")

    print("\n" + "=" * 60)
    print("Next step:")
    print("1. Enable Identity Center in console (one-time)")
    print("2. Run 03_setup_identity_center.py")
    print("=" * 60)

    return created


if __name__ == "__main__":
    main()
