FactoryBot.define do
  factory :user do
    first_name
    last_name
    password
    email
    avatar { 'MyString' }
    type { '' }

    factory :developer do
      type { 'Developer' }
    end

    factory :manager do
      type { 'manager ' }
    end
  end
end
