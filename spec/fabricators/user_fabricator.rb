# frozen_string_literal: true

Fabricator(:user) do
  account      { Fabricate.build(:account, user: nil) }
  email        { sequence(:email) { |i| "#{i}#{Faker::Internet.email}" } }
  password     '123456789'
  confirmed_at { Time.zone.now }
  current_sign_in_at { Time.zone.now }
  agreement true
  invite_request { Fabricate.build(:user_invite_request, user: nil) }
end
