resource "azurerm_resource_group" "storage" {
  location = var.location
  name = format(local.name_format, "storage")

  tags = {
    app = local.app_name
    env = terraform.workspace
    lock = local.lock_delete
  }
}

resource "random_integer" "storage" {
  max = 9999
  min = 1000
}

resource "azurerm_storage_account" "documents" {
  name = substr(replace(format(local.name_format, "docs${random_integer.storage.result}"), "-", ""), 0, 24)
  account_replication_type = "LRS"
  account_tier = "Standard"
  access_tier = "Hot"
  account_kind = "StorageV2"
  location = azurerm_resource_group.storage.location
  resource_group_name = azurerm_resource_group.storage.name

  blob_properties {
    delete_retention_policy {
      days = var.documents_soft_delete_retention
    }
  }
}

resource "azurerm_key_vault_secret" "docs-blob-storage-connection-string" {
  key_vault_id = azurerm_key_vault.key_vault.id
  name = "docs-blob-storage-connection-string"
  value = azurerm_storage_account.documents.primary_connection_string
}
