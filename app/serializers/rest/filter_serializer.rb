# frozen_string_literal: true

class REST::FilterSerializer < ActiveModel::Serializer
  attributes :id, :title, :context, :expires_at, :filter_action
  has_many :keywords, serializer: REST::FilterKeywordSerializer, if: :rules_requested?
  has_many :statuses, serializer: REST::FilterStatusSerializer, if: :rules_requested?

  def id
    object.id.to_s
  end

  def title
    object.id == CustomFilter::INSTANCE_FILTER_ID ? I18n.t('filters.instance_filter.title') : object.title
  end

  def rules_requested?
    instance_options[:rules_requested]
  end
end
