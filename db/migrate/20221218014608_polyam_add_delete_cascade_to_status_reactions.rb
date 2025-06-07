# frozen_string_literal: true

class PolyamAddDeleteCascadeToStatusReactions < ActiveRecord::Migration[6.1]
  disable_ddl_transaction!

  # Thanks to kescherCode
  def change
    remove_foreign_key :status_reactions, :accounts, if_exists: true
    remove_foreign_key :status_reactions, :statuses, if_exists: true
    remove_foreign_key :status_reactions, :custom_emojis, if_exists: true
    add_foreign_key :status_reactions, :accounts, on_delete: :cascade, validate: false, if_not_exists: true
    add_foreign_key :status_reactions, :statuses, on_delete: :cascade, validate: false, if_not_exists: true
    add_foreign_key :status_reactions, :custom_emojis, on_delete: :cascade, validate: false, if_not_exists: true
    validate_foreign_key :status_reactions, :accounts
    validate_foreign_key :status_reactions, :statuses
    validate_foreign_key :status_reactions, :custom_emojis
  end
end
