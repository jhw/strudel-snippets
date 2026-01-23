#!/usr/bin/env python3
"""
Create AWS Organization.

Run this after:
1. Root account created (console)
2. Root MFA enabled (console)
3. IAM admin user created with access keys (console)
4. AWS CLI configured with admin credentials

This script creates the organization with all features enabled.
"""

import boto3
from botocore.exceptions import ClientError

from config import REGION


def get_organizations_client():
    return boto3.client("organizations", region_name=REGION)


def organization_exists(client):
    """Check if organization already exists."""
    try:
        response = client.describe_organization()
        return True, response["Organization"]
    except ClientError as e:
        if e.response["Error"]["Code"] == "AWSOrganizationsNotInUseException":
            return False, None
        raise


def create_organization(client):
    """Create organization with all features."""
    response = client.create_organization(FeatureSet="ALL")
    return response["Organization"]


def main():
    print("=" * 60)
    print("AWS Organization Setup")
    print("=" * 60)

    client = get_organizations_client()

    # Check if org already exists
    exists, org = organization_exists(client)
    if exists:
        print(f"\nOrganization already exists:")
        print(f"  ID: {org['Id']}")
        print(f"  Master Account ID: {org['MasterAccountId']}")
        print(f"  Master Account Email: {org['MasterAccountEmail']}")
        return org

    # Create organization
    print("\nCreating organization...")
    org = create_organization(client)

    print(f"\nOrganization created:")
    print(f"  ID: {org['Id']}")
    print(f"  ARN: {org['Arn']}")
    print(f"  Master Account ID: {org['MasterAccountId']}")
    print(f"  Feature Set: {org['FeatureSet']}")

    print("\n" + "=" * 60)
    print("Next step: Run 02_create_accounts.py")
    print("=" * 60)

    return org


if __name__ == "__main__":
    main()
