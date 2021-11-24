FactoryBot.define do
  factory :user do
    first_name
    last_name
    password
    email { 'MyString' }
    avatar { 'MyString' }
    type { '' }

    factory :developer do
      type { 'Developer' }
    end

    factory :admin do
      type { 'admin' }
    end

    factory :manager do
      type { 'manager ' }
    end
  end
end
