FactoryBot.define do
  factory :task do
    name { 'MyString' }
    description { 'MyText' }
    author factory: :manager
    assignee factory: :manager
    state { :new_task }
    expired_at { '2021-11-24' }
  end
end
