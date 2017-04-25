class CreateAgendaView < ActiveRecord::Migration
  def up
    create_view :agenda_views, 
      "SELECT * FROM 
      (
        SELECT 
          a.title||' '||a.first_name||' '||a.last_name as name,
          a.organization as organization,
          c.contact_date as contact_date,
          c.followup_date as followup_date,
          c.id as contact_id
        FROM donors a JOIN contacts c ON a.id = c.donor_id
        WHERE c.followup_date >= date('now') AND a.active = 1) as RESULT
        ORDER BY followup_date ASC"
  end
  
  def down
    drop_view :agenda_views, :if_exists => true
  end
end
