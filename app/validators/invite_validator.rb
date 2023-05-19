# frozen_string_literal: true

class InviteValidator < ActiveModel::Validator
  LIMIT = (ENV['MAX_ACTIVE_INVITES'] || 5).to_i
  DAILY_LIMIT = (ENV['MAX_DAILY_INVITES'] || 20).to_i

  def validate(invite)
    return if invite.user.can?(:bypass_invite_limits)

    invite.errors.add(:base, I18n.t('invites.errors.limit_reached')) if limit_reached?(invite)
    invite.errors.add(:base, I18n.t('invites.errors.daily_limit_reached')) if daily_limit_reached?(invite)
  end

  private

  def limit_reached?(invite)
    invite.user.invites.available.count >= LIMIT
  end

  def daily_limit_reached?(invite)
    invite.user.invites.where('created_at >= ?', (Time.now.utc - 24.hours)).count >= DAILY_LIMIT
  end
end
