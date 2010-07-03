TwCover::Application.routes.draw do |map|
  match 'sax' => 'sax#index'
  match 'sax/:victim' => 'sax#call'
end
