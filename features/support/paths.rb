# TL;DR: YOU SHOULD DELETE THIS FILE
#
# This file is used by web_steps.rb, which you should also delete
#
# You have been warned
module NavigationHelpers
  # Maps a name to a path. Used by the
  #
  #   When /^I go to (.+)$/ do |page_name|
  #
  # step definition in web_steps.rb
  #
  def path_to(page_name)
    case page_name

    when /^(the )?index page$/
      root_path
    when /^(the )?home\s?page$/
      homepage_path
    when /^(the )?signup page$/
      new_user_path
    when /^(the )?new donor page$/
      new_donor_path
    when /^(the )?donor edit page ([0-9]+)$/
      donor_path($2)
    when /^(the )?(search )?donor page$/
      donors_path
    when /^(the )?donor view page ([0-9]+)$/
      donorSummary_path($2)
    when /^(the )?dashboard\s?page$/
      dashboard_path      
    when /^(the )?report\s?page$/
      reports_path 
    when /^(the )?new report page$/
      new_report_path
    when /^(the )?edit report page ([0-9]+)$/
      edit_report_path($2)
    
    # Add more mappings here.
    # Here is an example that pulls values out of the Regexp:
    #
    #   when /^(.*)'s profile page$/i
    #     user_profile_path(User.find_by_login($1))

    else
      begin
        page_name =~ /^the (.*) page$/
        path_components = $1.split(/\s+/)
        self.send(path_components.push('path').join('_').to_sym)
      rescue NoMethodError, ArgumentError
        raise "Can't find mapping from \"#{page_name}\" to a path.\n" +
          "Now, go and add a mapping in #{__FILE__}"
      end
    end
  end
end

World(NavigationHelpers)
