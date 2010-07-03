TwCover::Application.routes.draw do |map|
  match 'sax' => 'sax#index'
  match 'sax/call' => 'sax#call'
end
