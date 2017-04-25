# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161025202248) do

  create_table "accesses", force: :cascade do |t|
    t.string   "email"
    t.datetime "created_at", :null=>false
    t.datetime "updated_at", :null=>false
  end

  create_table "contacts", force: :cascade do |t|
    t.date     "contact_date"
    t.date     "followup_date"
    t.text     "narrative"
    t.integer  "donor_id"
    t.string   "created_by"
    t.datetime "created_at",       :null=>false
    t.string   "last_modified_by"
    t.datetime "last_modified_at"
    t.datetime "updated_at",       :null=>false
  end
  add_index "contacts", ["donor_id"], :name=>"index_contacts_on_donor_id"

  create_table "donors", force: :cascade do |t|
    t.string   "title"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "middle_name"
    t.string   "salution"
    t.string   "email"
    t.string   "organization"
    t.string   "company"
    t.string   "street_address"
    t.string   "city"
    t.string   "state",            :default=>"Texas"
    t.string   "country",          :default=>"United States"
    t.string   "zipcode"
    t.string   "home_phone"
    t.string   "business_phone"
    t.string   "created_by"
    t.string   "last_modified_by"
    t.datetime "created_at",       :null=>false
    t.datetime "last_modified_at"
    t.datetime "updated_at",       :null=>false
    t.string   "flag"
    t.integer  "active",           :default=>1
    t.string   "role"
    t.string   "note"
    t.string   "spouse"
    t.string   "street_address_2"
    t.string   "cell_phone"
    t.string   "subscribeflag"
  end

  create_view "agenda_views", <<-'END_VIEW_AGENDA_VIEWS', :force => true
SELECT * FROM 
      (
        SELECT 
          a.title||' '||a.first_name||' '||a.last_name as name,
          a.organization as organization,
          c.contact_date as contact_date,
          c.followup_date as followup_date,
          c.id as contact_id
        FROM donors a JOIN contacts c ON a.id = c.donor_id
        WHERE c.followup_date >= date('now') AND a.active = 1) as RESULT
        ORDER BY followup_date ASC
  END_VIEW_AGENDA_VIEWS

  create_table "filters", force: :cascade do |t|
    t.string   "table_name"
    t.string   "field_name"
    t.string   "value"
    t.decimal  "min_value"
    t.decimal  "max_value"
    t.date     "min_date"
    t.date     "max_date"
    t.string   "created_by"
    t.datetime "created_at",       :null=>false
    t.string   "last_modified_by"
    t.datetime "last_modified_at"
    t.integer  "report_id"
    t.datetime "updated_at",       :null=>false
  end
  add_index "filters", ["report_id"], :name=>"index_filters_on_report_id"

  create_table "finances", force: :cascade do |t|
    t.string   "_type"
    t.date     "date"
    t.decimal  "amount"
    t.text     "description"
    t.string   "designation"
    t.integer  "donor_id"
    t.integer  "contact_id"
    t.string   "created_by"
    t.datetime "created_at",       :null=>false
    t.string   "last_modified_by"
    t.datetime "last_modified_at"
    t.datetime "updated_at",       :null=>false
  end
  add_index "finances", ["contact_id"], :name=>"index_finances_on_contact_id"
  add_index "finances", ["donor_id"], :name=>"index_finances_on_donor_id"

  create_table "functions", force: :cascade do |t|
    t.string   "name"
    t.string   "created_by"
    t.string   "last_modified_by"
    t.datetime "created_at",       :null=>false
    t.datetime "last_modified_at"
    t.datetime "updated_at",       :null=>false
  end

  create_table "reports", force: :cascade do |t|
    t.string   "title"
    t.text     "description"
    t.datetime "last_run"
    t.string   "created_by"
    t.datetime "created_at",       :null=>false
    t.string   "last_modified_by"
    t.datetime "last_modified_at"
    t.datetime "updated_at",       :null=>false
  end

  create_table "users", force: :cascade do |t|
    t.string   "username"
    t.string   "email"
    t.string   "password_digest"
    t.string   "current_password"
    t.string   "first_name"
    t.string   "last_name"
    t.string   "function"
    t.string   "created_by"
    t.string   "last_modified_by"
    t.datetime "created_at",       :null=>false
    t.datetime "last_modified_at"
    t.datetime "updated_at",       :null=>false
    t.string   "phone_number"
    t.string   "street_address"
    t.string   "city"
    t.string   "state",            :default=>"Texas"
    t.string   "country",          :default=>"United States"
    t.integer  "zipcode"
  end

end
