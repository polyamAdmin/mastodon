# frozen_string_literal: true

class PolyamAddExclusiveToLists < ActiveRecord::Migration[6.1]
  def change
    add_column :lists, :exclusive, :boolean, default: false
  end
end
