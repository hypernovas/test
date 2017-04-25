Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root :to=>'sessions#new'
  
  # these routes are for showing users a login form, logging them in, and logging them out.
  post 'login' => 'sessions#create', :as => 'login'
  get 'logout' => 'sessions#destroy', :as => 'logout'
  get 'homepage' => 'users#homepage', :as => 'homepage'
  get 'donorSummary/:id' => 'donors#showSummary', :as => 'donorSummary'
  get 'donorContact' => 'donors#showByContact', :as => 'donorContact'
  get 'dashboard' => 'dashboards#index', :as => 'dashboard'
  get 'dashboard/donor/:id' => 'dashboards#viewDonor', :as=>'dashboardDonor'
  get 'donor/importIndex' => 'donors#importIndex', :as=>'importIndex'
  post 'donor/import' => 'donors#import', :as=>'import'
  post 'donor/upload' => 'donors#upload', :as=>'upload'
  
  resources :users
  resources :accesses
  resources :donors
  resources :reports
  resources :contacts
  resources :finances
  resources :agendas
  resources :reports
  resources :filters
  
end
