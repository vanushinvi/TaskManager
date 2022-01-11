class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true

  validates :name, presence: true
  validates :description, presence: true
  validates :author, presence: true
  validates :description, length: { maximum: 500 }

  state_machine initial: :new_task do
    event :go_to_dev do
      transition from: [:new_task, :in_qa, :in_code_review], to: :in_development
    end

    event :go_to_qa do
      transition in_development: :in_qa
    end

    event :go_to_code_review do
      transition in_qa: :in_code_review
    end

    event :go_to_ready_for_release do
      transition in_code_review: :ready_for_release
    end

    event :go_to_release do
      transition ready_for_release: :released
    end

    event :go_to_archive do
      transition from: [:new_task, :released], to: :archived
    end
  end
end
